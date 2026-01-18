//go:build tools

package api

import (
	_ "github.com/99designs/gqlgen"
	_ "github.com/sqlc-dev/sqlc/cmd/sqlc"
	_ "github.com/vektah/dataloaden"
)
