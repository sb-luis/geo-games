package routes

import (
	"net/http"

	"wiw-backend/routes/handlers"
	"wiw-backend/routes/middleware"
	"wiw-backend/store"
)

func Register(mux *http.ServeMux, s *store.Store, hub *handlers.Hub, allowedOrigins []string) {
	auth := handlers.NewAuthHandler(s)
	ws := handlers.NewWSHandler(hub, s, allowedOrigins)

	authMiddleware := middleware.Auth(s)

	mux.Handle("GET /healthcheck", authMiddleware(http.HandlerFunc(handlers.Healthcheck)))

	mux.Handle("POST /auth/register", authMiddleware(http.HandlerFunc(auth.Register)))
	mux.Handle("POST /auth/login", authMiddleware(http.HandlerFunc(auth.Login)))
	mux.Handle("POST /auth/logout", authMiddleware(http.HandlerFunc(auth.Logout)))
	mux.Handle("GET /auth/me", authMiddleware(http.HandlerFunc(auth.GetMe)))
	mux.Handle("PATCH /auth/me", authMiddleware(http.HandlerFunc(auth.UpdateMe)))

	mux.Handle("GET /ws", authMiddleware(ws))
}
