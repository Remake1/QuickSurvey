package http

import (
	"encoding/json"
	stdhttp "net/http"
	"time"

	"github.com/remake1/quicksurvey/api/internal/domain"
	"github.com/remake1/quicksurvey/api/internal/usecase"
)

const AuthCookieName = "auth_token"

type AuthHandlers struct {
	auth         *usecase.AuthService
	cookieTTL    time.Duration
	cookieSecure bool
}

type authUserResponse struct {
	ID        string    `json:"id"`
	Email     string    `json:"email"`
	Name      *string   `json:"name"`
	CreatedAt time.Time `json:"createdAt"`
}

func NewAuthHandlers(auth *usecase.AuthService, cookieTTL time.Duration, cookieSecure bool) *AuthHandlers {
	return &AuthHandlers{auth: auth, cookieTTL: cookieTTL, cookieSecure: cookieSecure}
}

func (h *AuthHandlers) Register(w stdhttp.ResponseWriter, r *stdhttp.Request) {
	var input usecase.RegisterInput
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		writeError(w, stdhttp.StatusBadRequest, "Invalid request body")
		return
	}
	user, token, err := h.auth.Register(r.Context(), input)
	if err != nil {
		handleDomainError(w, err)
		return
	}
	h.setAuthCookie(w, token)
	writeJSON(w, stdhttp.StatusCreated, toAuthUser(user))
}

func (h *AuthHandlers) Login(w stdhttp.ResponseWriter, r *stdhttp.Request) {
	var input usecase.LoginInput
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		writeError(w, stdhttp.StatusBadRequest, "Invalid request body")
		return
	}
	user, token, err := h.auth.Login(r.Context(), input)
	if err != nil {
		handleDomainError(w, err)
		return
	}
	h.setAuthCookie(w, token)
	writeJSON(w, stdhttp.StatusOK, toAuthUser(user))
}

func (h *AuthHandlers) Logout(w stdhttp.ResponseWriter, r *stdhttp.Request) {
	stdhttp.SetCookie(w, &stdhttp.Cookie{
		Name:     AuthCookieName,
		Value:    "",
		Path:     "/",
		MaxAge:   -1,
		HttpOnly: true,
		SameSite: stdhttp.SameSiteLaxMode,
		Secure:   h.cookieSecure,
	})
	writeJSON(w, stdhttp.StatusOK, map[string]string{"message": "Logged out"})
}

func (h *AuthHandlers) Me(w stdhttp.ResponseWriter, r *stdhttp.Request) {
	userID, ok := UserIDFromContext(r.Context())
	if !ok {
		writeError(w, stdhttp.StatusUnauthorized, "Authentication required")
		return
	}
	user, err := h.auth.CurrentUser(r.Context(), userID)
	if err != nil {
		handleDomainError(w, err)
		return
	}
	writeJSON(w, stdhttp.StatusOK, toAuthUser(user))
}

func (h *AuthHandlers) setAuthCookie(w stdhttp.ResponseWriter, token string) {
	stdhttp.SetCookie(w, &stdhttp.Cookie{
		Name:     AuthCookieName,
		Value:    token,
		Path:     "/",
		Expires:  usecase.CookieExpires(h.cookieTTL),
		HttpOnly: true,
		SameSite: stdhttp.SameSiteLaxMode,
		Secure:   h.cookieSecure,
	})
}

func toAuthUser(user *domain.User) authUserResponse {
	return authUserResponse{
		ID:        user.ID,
		Email:     user.Email,
		Name:      user.Name,
		CreatedAt: user.CreatedAt,
	}
}
