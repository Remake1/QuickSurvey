package graph

// This file will not be regenerated automatically.
//
// It serves as dependency injection for your app, add any dependencies you require
// here.

import (
	"github.com/remake1/quicksurvey/api/internal/repository"
	"github.com/remake1/quicksurvey/api/internal/usecase"
)

type Resolver struct {
	auth    *usecase.AuthService
	surveys *usecase.SurveyService
	users   repository.UserRepository
}

func NewResolver(auth *usecase.AuthService, surveys *usecase.SurveyService, users repository.UserRepository) *Resolver {
	return &Resolver{auth: auth, surveys: surveys, users: users}
}
