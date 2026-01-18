package usecase

import (
	"context"
	"errors"
	"strings"
	"time"

	"github.com/remake1/quicksurvey/api/internal/domain"
	"github.com/remake1/quicksurvey/api/internal/repository"
	"golang.org/x/crypto/bcrypt"
)

type TokenIssuer interface {
	Issue(user *domain.User) (string, error)
}

type AuthService struct {
	users  repository.UserRepository
	tokens TokenIssuer
}

type RegisterInput struct {
	Email    string
	Password string
	Name     *string
}

type LoginInput struct {
	Email    string
	Password string
}

func NewAuthService(users repository.UserRepository, tokens TokenIssuer) *AuthService {
	return &AuthService{users: users, tokens: tokens}
}

func (s *AuthService) Register(ctx context.Context, input RegisterInput) (*domain.User, string, error) {
	email := strings.ToLower(strings.TrimSpace(input.Email))
	if email == "" || len(input.Password) < 8 {
		return nil, "", domain.ErrInvalidInput
	}

	hash, err := bcrypt.GenerateFromPassword([]byte(input.Password), bcrypt.DefaultCost)
	if err != nil {
		return nil, "", err
	}

	user, err := s.users.Create(ctx, email, cleanName(input.Name), string(hash))
	if err != nil {
		return nil, "", err
	}

	token, err := s.tokens.Issue(user)
	if err != nil {
		return nil, "", err
	}

	return user, token, nil
}

func (s *AuthService) Login(ctx context.Context, input LoginInput) (*domain.User, string, error) {
	email := strings.ToLower(strings.TrimSpace(input.Email))
	user, err := s.users.FindByEmail(ctx, email)
	if err != nil {
		if errors.Is(err, domain.ErrNotFound) {
			return nil, "", domain.ErrInvalidCredentials
		}
		return nil, "", err
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(input.Password)); err != nil {
		return nil, "", domain.ErrInvalidCredentials
	}

	token, err := s.tokens.Issue(user)
	if err != nil {
		return nil, "", err
	}

	return user, token, nil
}

func (s *AuthService) CurrentUser(ctx context.Context, userID string) (*domain.User, error) {
	if userID == "" {
		return nil, domain.ErrUnauthenticated
	}
	return s.users.FindByID(ctx, userID)
}

func cleanName(name *string) *string {
	if name == nil {
		return nil
	}
	value := strings.TrimSpace(*name)
	if value == "" {
		return nil
	}
	return &value
}

func CookieExpires(ttl time.Duration) time.Time {
	return time.Now().Add(ttl)
}
