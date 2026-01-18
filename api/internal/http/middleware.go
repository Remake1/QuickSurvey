package http

import (
	stdhttp "net/http"
	"strings"

	infraauth "github.com/remake1/quicksurvey/api/internal/infrastructure/auth"
)

func AuthMiddleware(tokens *infraauth.JWTManager) func(stdhttp.Handler) stdhttp.Handler {
	return func(next stdhttp.Handler) stdhttp.Handler {
		return stdhttp.HandlerFunc(func(w stdhttp.ResponseWriter, r *stdhttp.Request) {
			tokenString := bearerToken(r.Header.Get("Authorization"))
			if tokenString == "" {
				if cookie, err := r.Cookie(AuthCookieName); err == nil {
					tokenString = cookie.Value
				}
			}
			if tokenString != "" {
				if claims, err := tokens.Parse(tokenString); err == nil {
					r = r.WithContext(ContextWithUserID(r.Context(), claims.UserID))
				}
			}
			next.ServeHTTP(w, r)
		})
	}
}

func bearerToken(header string) string {
	if header == "" {
		return ""
	}
	prefix := "Bearer "
	if !strings.HasPrefix(header, prefix) {
		return ""
	}
	return strings.TrimSpace(strings.TrimPrefix(header, prefix))
}
