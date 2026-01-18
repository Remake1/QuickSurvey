package postgres

import (
	"context"
	"encoding/json"
	"errors"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgconn"
	"github.com/remake1/quicksurvey/api/internal/domain"
	"github.com/remake1/quicksurvey/api/internal/infrastructure/postgres/db"
)

type UserRepository struct {
	queries *db.Queries
}

type SurveyRepository struct {
	queries *db.Queries
}

func NewUserRepository(queries *db.Queries) *UserRepository {
	return &UserRepository{queries: queries}
}

func NewSurveyRepository(queries *db.Queries) *SurveyRepository {
	return &SurveyRepository{queries: queries}
}

func (r *UserRepository) Create(ctx context.Context, email string, name *string, passwordHash string) (*domain.User, error) {
	row, err := r.queries.CreateUser(ctx, db.CreateUserParams{
		Email:        email,
		Name:         name,
		PasswordHash: passwordHash,
	})
	if err != nil {
		if isUniqueViolation(err) {
			return nil, domain.ErrConflict
		}
		return nil, err
	}
	return toUser(row), nil
}

func (r *UserRepository) FindByEmail(ctx context.Context, email string) (*domain.User, error) {
	row, err := r.queries.GetUserByEmail(ctx, email)
	if err != nil {
		return nil, mapReadError(err)
	}
	return toUser(row), nil
}

func (r *UserRepository) FindByID(ctx context.Context, id string) (*domain.User, error) {
	row, err := r.queries.GetUserByID(ctx, id)
	if err != nil {
		return nil, mapReadError(err)
	}
	return toUser(row), nil
}

func (r *UserRepository) FindByIDs(ctx context.Context, ids []string) (map[string]*domain.User, error) {
	rows, err := r.queries.ListUsersByIDs(ctx, ids)
	if err != nil {
		return nil, err
	}
	users := make(map[string]*domain.User, len(rows))
	for _, row := range rows {
		user := toUser(row)
		users[user.ID] = user
	}
	return users, nil
}

func (r *SurveyRepository) Create(ctx context.Context, survey *domain.Survey) (*domain.Survey, error) {
	questions, err := json.Marshal(survey.Questions)
	if err != nil {
		return nil, err
	}
	row, err := r.queries.CreateSurvey(ctx, db.CreateSurveyParams{
		Title:       survey.Title,
		Description: survey.Description,
		Questions:   questions,
		OwnerID:     survey.OwnerID,
	})
	if err != nil {
		return nil, err
	}
	return toSurvey(row)
}

func (r *SurveyRepository) FindByID(ctx context.Context, id string) (*domain.Survey, error) {
	row, err := r.queries.GetSurveyByID(ctx, id)
	if err != nil {
		return nil, mapReadError(err)
	}
	return toSurvey(row)
}

func (r *SurveyRepository) FindByOwner(ctx context.Context, ownerID string) ([]*domain.Survey, error) {
	rows, err := r.queries.ListSurveysByOwner(ctx, ownerID)
	if err != nil {
		return nil, err
	}
	surveys := make([]*domain.Survey, 0, len(rows))
	for _, row := range rows {
		survey, err := toSurvey(row)
		if err != nil {
			return nil, err
		}
		surveys = append(surveys, survey)
	}
	return surveys, nil
}

func (r *SurveyRepository) UpdateStatus(ctx context.Context, id string, ownerID string, status domain.SurveyStatus) (*domain.Survey, error) {
	row, err := r.queries.UpdateSurveyStatus(ctx, db.UpdateSurveyStatusParams{
		ID:      id,
		Status:  string(status),
		OwnerID: ownerID,
	})
	if err != nil {
		return nil, mapReadError(err)
	}
	return toSurvey(row)
}

func (r *SurveyRepository) CreateResponse(ctx context.Context, response *domain.SurveyResponse) (*domain.SurveyResponse, error) {
	answers, err := json.Marshal(response.Answers)
	if err != nil {
		return nil, err
	}
	row, err := r.queries.CreateSurveyResponse(ctx, db.CreateSurveyResponseParams{
		SurveyID: response.SurveyID,
		Answers:  answers,
	})
	if err != nil {
		return nil, err
	}
	return toSurveyResponse(row)
}

func (r *SurveyRepository) ResponsesBySurvey(ctx context.Context, surveyID string) ([]*domain.SurveyResponse, error) {
	rows, err := r.queries.ListResponsesBySurvey(ctx, surveyID)
	if err != nil {
		return nil, err
	}
	responses := make([]*domain.SurveyResponse, 0, len(rows))
	for _, row := range rows {
		response, err := toSurveyResponse(row)
		if err != nil {
			return nil, err
		}
		responses = append(responses, response)
	}
	return responses, nil
}

func toUser(row db.User) *domain.User {
	return &domain.User{
		ID:           row.ID,
		Email:        row.Email,
		Name:         row.Name,
		PasswordHash: row.PasswordHash,
		CreatedAt:    row.CreatedAt.Time,
	}
}

func toSurvey(row db.Survey) (*domain.Survey, error) {
	var questions []domain.Question
	if err := json.Unmarshal(row.Questions, &questions); err != nil {
		return nil, err
	}
	return &domain.Survey{
		ID:          row.ID,
		Title:       row.Title,
		Description: row.Description,
		Questions:   questions,
		Status:      domain.SurveyStatus(row.Status),
		OwnerID:     row.OwnerID,
		CreatedAt:   row.CreatedAt.Time,
		UpdatedAt:   row.UpdatedAt.Time,
	}, nil
}

func toSurveyResponse(row db.SurveyResponse) (*domain.SurveyResponse, error) {
	var answers []domain.Answer
	if err := json.Unmarshal(row.Answers, &answers); err != nil {
		return nil, err
	}
	return &domain.SurveyResponse{
		ID:        row.ID,
		SurveyID:  row.SurveyID,
		Answers:   answers,
		CreatedAt: row.CreatedAt.Time,
	}, nil
}

func mapReadError(err error) error {
	if errors.Is(err, pgx.ErrNoRows) {
		return domain.ErrNotFound
	}
	return err
}

func isUniqueViolation(err error) bool {
	var pgErr *pgconn.PgError
	return errors.As(err, &pgErr) && pgErr.Code == "23505"
}
