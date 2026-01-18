package dataloader

import (
	"context"
	"net/http"
	"time"

	"github.com/remake1/quicksurvey/api/internal/domain"
	"github.com/remake1/quicksurvey/api/internal/repository"
)

type contextKey string

const loadersKey contextKey = "loaders"

type Loaders struct {
	Users *UserLoader
}

func NewLoaders(ctx context.Context, users repository.UserRepository) *Loaders {
	return &Loaders{
		Users: NewUserLoader(UserLoaderConfig{
			Wait:     time.Millisecond,
			MaxBatch: 100,
			Fetch: func(keys []string) ([]*User, []error) {
				found, err := users.FindByIDs(ctx, keys)
				if err != nil {
					return nil, []error{err}
				}
				result := make([]*User, len(keys))
				errs := make([]error, len(keys))
				for i, key := range keys {
					user, ok := found[key]
					if !ok {
						errs[i] = domain.ErrNotFound
						continue
					}
					result[i] = user
				}
				return result, errs
			},
		}),
	}
}

func Middleware(users repository.UserRepository) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			loaders := NewLoaders(r.Context(), users)
			ctx := context.WithValue(r.Context(), loadersKey, loaders)
			next.ServeHTTP(w, r.WithContext(ctx))
		})
	}
}

func FromContext(ctx context.Context) *Loaders {
	loaders, _ := ctx.Value(loadersKey).(*Loaders)
	return loaders
}
