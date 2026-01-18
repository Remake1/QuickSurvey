package repository

import (
	"context"

	"github.com/remake1/quicksurvey/api/internal/domain"
)

type UserRepository interface {
	Create(ctx context.Context, email string, name *string, passwordHash string) (*domain.User, error)
	FindByEmail(ctx context.Context, email string) (*domain.User, error)
	FindByID(ctx context.Context, id string) (*domain.User, error)
	FindByIDs(ctx context.Context, ids []string) (map[string]*domain.User, error)
}

type SurveyRepository interface {
	Create(ctx context.Context, survey *domain.Survey) (*domain.Survey, error)
	FindByID(ctx context.Context, id string) (*domain.Survey, error)
	FindByOwner(ctx context.Context, ownerID string) ([]*domain.Survey, error)
	UpdateStatus(ctx context.Context, id string, ownerID string, status domain.SurveyStatus) (*domain.Survey, error)
	CreateResponse(ctx context.Context, response *domain.SurveyResponse) (*domain.SurveyResponse, error)
	ResponsesBySurvey(ctx context.Context, surveyID string) ([]*domain.SurveyResponse, error)
}
