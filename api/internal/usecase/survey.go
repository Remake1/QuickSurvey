package usecase

import (
	"context"
	"errors"

	"github.com/google/uuid"
	"github.com/remake1/quicksurvey/api/internal/domain"
	"github.com/remake1/quicksurvey/api/internal/repository"
)

type SurveyService struct {
	surveys repository.SurveyRepository
}

type CreateSurveyInput struct {
	Title       string
	Description *string
	Questions   []domain.Question
	OwnerID     string
}

type SubmitResponseInput struct {
	SurveyID string
	Answers  []domain.Answer
}

func NewSurveyService(surveys repository.SurveyRepository) *SurveyService {
	return &SurveyService{surveys: surveys}
}

func (s *SurveyService) GetSurvey(ctx context.Context, id string, viewerID *string) (*domain.Survey, error) {
	survey, err := s.surveys.FindByID(ctx, id)
	if err != nil {
		return nil, err
	}
	if survey.Status == domain.SurveyStatusDraft && (viewerID == nil || *viewerID != survey.OwnerID) {
		return nil, domain.ErrForbidden
	}
	return survey, nil
}

func (s *SurveyService) MySurveys(ctx context.Context, ownerID string) ([]*domain.Survey, error) {
	if ownerID == "" {
		return nil, domain.ErrUnauthenticated
	}
	return s.surveys.FindByOwner(ctx, ownerID)
}

func (s *SurveyService) CreateSurvey(ctx context.Context, input CreateSurveyInput) (*domain.Survey, error) {
	if input.OwnerID == "" {
		return nil, domain.ErrUnauthenticated
	}
	if input.Title == "" || len(input.Questions) == 0 {
		return nil, domain.ErrInvalidInput
	}
	questions := normalizeQuestions(input.Questions)
	return s.surveys.Create(ctx, &domain.Survey{
		Title:       input.Title,
		Description: input.Description,
		Questions:   questions,
		Status:      domain.SurveyStatusDraft,
		OwnerID:     input.OwnerID,
	})
}

func (s *SurveyService) Publish(ctx context.Context, id string, ownerID string) (*domain.Survey, error) {
	return s.updateStatus(ctx, id, ownerID, domain.SurveyStatusPublished)
}

func (s *SurveyService) Unpublish(ctx context.Context, id string, ownerID string) (*domain.Survey, error) {
	return s.updateStatus(ctx, id, ownerID, domain.SurveyStatusDraft)
}

func (s *SurveyService) SubmitResponse(ctx context.Context, input SubmitResponseInput) (*domain.SurveyResponse, error) {
	survey, err := s.surveys.FindByID(ctx, input.SurveyID)
	if err != nil {
		return nil, err
	}
	if survey.Status != domain.SurveyStatusPublished {
		return nil, domain.ErrForbidden
	}
	if len(input.Answers) == 0 {
		return nil, domain.ErrInvalidInput
	}
	return s.surveys.CreateResponse(ctx, &domain.SurveyResponse{
		SurveyID: input.SurveyID,
		Answers:  input.Answers,
	})
}

func (s *SurveyService) Responses(ctx context.Context, surveyID string, ownerID string) ([]*domain.SurveyResponse, error) {
	survey, err := s.surveys.FindByID(ctx, surveyID)
	if err != nil {
		return nil, err
	}
	if ownerID == "" {
		return nil, domain.ErrUnauthenticated
	}
	if survey.OwnerID != ownerID {
		return nil, domain.ErrForbidden
	}
	return s.surveys.ResponsesBySurvey(ctx, surveyID)
}

func (s *SurveyService) updateStatus(ctx context.Context, id string, ownerID string, status domain.SurveyStatus) (*domain.Survey, error) {
	if ownerID == "" {
		return nil, domain.ErrUnauthenticated
	}
	survey, err := s.surveys.UpdateStatus(ctx, id, ownerID, status)
	if errors.Is(err, domain.ErrNotFound) {
		return nil, domain.ErrForbidden
	}
	return survey, err
}

func normalizeQuestions(questions []domain.Question) []domain.Question {
	out := make([]domain.Question, 0, len(questions))
	for _, question := range questions {
		if question.ID == "" {
			question.ID = uuid.NewString()
		}
		for i := range question.Options {
			if question.Options[i].ID == "" {
				question.Options[i].ID = uuid.NewString()
			}
		}
		if question.Type == domain.QuestionTypeLinearScale {
			if question.Min == nil {
				min := 1
				question.Min = &min
			}
			if question.Max == nil {
				max := 5
				question.Max = &max
			}
		}
		out = append(out, question)
	}
	return out
}
