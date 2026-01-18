package config

import (
	"os"
	"strconv"
	"time"

	"github.com/joho/godotenv"
)

type Config struct {
	Port         string
	DatabaseURL  string
	JWTSecret    string
	JWTTTL       time.Duration
	CookieSecure bool
}

func Load() (Config, error) {
	_ = godotenv.Load()

	ttl, err := time.ParseDuration(getenv("JWT_TTL", "24h"))
	if err != nil {
		return Config{}, err
	}

	secure, err := strconv.ParseBool(getenv("COOKIE_SECURE", "false"))
	if err != nil {
		return Config{}, err
	}

	return Config{
		Port:         getenv("PORT", "3000"),
		DatabaseURL:  getenv("DATABASE_URL", "postgres://postgres:password123@localhost:5432/survey_db?sslmode=disable"),
		JWTSecret:    getenv("JWT_SECRET", "change-me-in-development"),
		JWTTTL:       ttl,
		CookieSecure: secure,
	}, nil
}

func getenv(key string, fallback string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return fallback
}
