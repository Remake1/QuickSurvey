package http

import (
	"encoding/json"
	"errors"
	stdhttp "net/http"

	"github.com/remake1/quicksurvey/api/internal/domain"
)

func writeJSON(w stdhttp.ResponseWriter, status int, value interface{}) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(value)
}

func writeError(w stdhttp.ResponseWriter, status int, message string) {
	writeJSON(w, status, map[string]string{"error": message})
}

func handleDomainError(w stdhttp.ResponseWriter, err error) {
	switch {
	case errors.Is(err, domain.ErrInvalidCredentials):
		writeError(w, stdhttp.StatusUnauthorized, "Invalid email or password")
	case errors.Is(err, domain.ErrUnauthenticated):
		writeError(w, stdhttp.StatusUnauthorized, "Authentication required")
	case errors.Is(err, domain.ErrForbidden):
		writeError(w, stdhttp.StatusForbidden, "Not authorized")
	case errors.Is(err, domain.ErrNotFound):
		writeError(w, stdhttp.StatusNotFound, "Not found")
	case errors.Is(err, domain.ErrConflict):
		writeError(w, stdhttp.StatusConflict, "Email already registered")
	case errors.Is(err, domain.ErrInvalidInput):
		writeError(w, stdhttp.StatusBadRequest, "Invalid input")
	default:
		writeError(w, stdhttp.StatusInternalServerError, "Internal server error")
	}
}
