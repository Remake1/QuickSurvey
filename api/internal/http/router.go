package http

import (
	stdhttp "net/http"

	"github.com/99designs/gqlgen/graphql"
	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/playground"
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	infraauth "github.com/remake1/quicksurvey/api/internal/infrastructure/auth"
	"github.com/remake1/quicksurvey/api/internal/infrastructure/dataloader"
	"github.com/remake1/quicksurvey/api/internal/repository"
)

func NewRouter(authHandlers *AuthHandlers, tokens *infraauth.JWTManager, userRepo repository.UserRepository, executable graphql.ExecutableSchema) stdhttp.Handler {
	router := chi.NewRouter()
	router.Use(middleware.RequestID)
	router.Use(middleware.RealIP)
	router.Use(middleware.Logger)
	router.Use(middleware.Recoverer)
	router.Use(AuthMiddleware(tokens))

	router.Get("/healthz", func(w stdhttp.ResponseWriter, r *stdhttp.Request) {
		writeJSON(w, stdhttp.StatusOK, map[string]string{"status": "ok"})
	})

	router.Route("/auth", func(r chi.Router) {
		r.Post("/register", authHandlers.Register)
		r.Post("/login", authHandlers.Login)
		r.Post("/logout", authHandlers.Logout)
		r.Get("/me", authHandlers.Me)
	})

	graphqlHandler := dataloader.Middleware(userRepo)(handler.NewDefaultServer(executable))
	router.Handle("/graphql", graphqlHandler)
	router.Handle("/playground", playground.Handler("QuickSurvey GraphQL", "/graphql"))

	return router
}
