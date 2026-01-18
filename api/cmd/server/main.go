package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/remake1/quicksurvey/api/graph"
	"github.com/remake1/quicksurvey/api/graph/generated"
	"github.com/remake1/quicksurvey/api/internal/config"
	httpadapter "github.com/remake1/quicksurvey/api/internal/http"
	infraauth "github.com/remake1/quicksurvey/api/internal/infrastructure/auth"
	"github.com/remake1/quicksurvey/api/internal/infrastructure/postgres"
	"github.com/remake1/quicksurvey/api/internal/infrastructure/postgres/db"
	"github.com/remake1/quicksurvey/api/internal/usecase"
)

func main() {
	cfg, err := config.Load()
	if err != nil {
		log.Fatalf("load config: %v", err)
	}

	ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
	defer stop()

	pool, err := pgxpool.New(ctx, cfg.DatabaseURL)
	if err != nil {
		log.Fatalf("connect postgres: %v", err)
	}
	defer pool.Close()

	queries := db.New(pool)
	userRepo := postgres.NewUserRepository(queries)
	surveyRepo := postgres.NewSurveyRepository(queries)
	tokens := infraauth.NewJWTManager(cfg.JWTSecret, cfg.JWTTTL)
	authService := usecase.NewAuthService(userRepo, tokens)
	surveyService := usecase.NewSurveyService(surveyRepo)

	resolver := graph.NewResolver(authService, surveyService, userRepo)
	executable := generated.NewExecutableSchema(generated.Config{Resolvers: resolver})
	router := httpadapter.NewRouter(
		httpadapter.NewAuthHandlers(authService, cfg.JWTTTL, cfg.CookieSecure),
		tokens,
		userRepo,
		executable,
	)

	server := &http.Server{
		Addr:              ":" + cfg.Port,
		Handler:           router,
		ReadHeaderTimeout: 5 * time.Second,
	}

	go func() {
		log.Printf("api listening on http://localhost:%s", cfg.Port)
		if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("listen: %v", err)
		}
	}()

	<-ctx.Done()
	shutdownCtx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	if err := server.Shutdown(shutdownCtx); err != nil {
		log.Printf("shutdown: %v", err)
	}
}
