package handlers

import (
	"net/http"

	"github.com/sb-luis/where-name/apps/backend-go/routes/middleware"
	"github.com/sb-luis/where-name/apps/backend-go/store"
)

type PracticeHandler struct {
	store *store.Store
}

func NewPracticeHandler(s *store.Store) *PracticeHandler {
	return &PracticeHandler{store: s}
}

func (h *PracticeHandler) CreateGame(w http.ResponseWriter, r *http.Request) {
	user, ok := middleware.UserFromCtx(r.Context())
	if !ok {
		writeError(w, http.StatusUnauthorized, "not authenticated")
		return
	}

	var body struct {
		Variant    string `json:"variant"`
		Completed  bool   `json:"completed"`
		DurationMs int64  `json:"duration_ms"`
		Rounds     []struct {
			Position   int16  `json:"position"`
			Feature    string `json:"feature"`
			Attempt    int16  `json:"attempt"`
			Outcome    string `json:"outcome"`
			DurationMs int64  `json:"duration_ms"`
		} `json:"rounds"`
	}
	if err := readBody(w, r, &body); err != nil {
		writeError(w, http.StatusBadRequest, "invalid request body")
		return
	}
	if body.Variant == "" {
		writeError(w, http.StatusUnprocessableEntity, "variant is required")
		return
	}
	if len(body.Rounds) == 0 {
		writeError(w, http.StatusUnprocessableEntity, "rounds must not be empty")
		return
	}

	rounds := make([]store.CreatePracticeRoundParams, len(body.Rounds))
	for i, r := range body.Rounds {
		if r.Outcome != "correct" && r.Outcome != "wrong" && r.Outcome != "skipped" {
			writeError(w, http.StatusUnprocessableEntity, "outcome must be 'correct', 'wrong', or 'skipped'")
			return
		}
		rounds[i] = store.CreatePracticeRoundParams{
			Position:   r.Position,
			Feature:    r.Feature,
			Attempt:    r.Attempt,
			Outcome:    r.Outcome,
			DurationMs: r.DurationMs,
		}
	}

	game, err := h.store.CreatePracticeGame(r.Context(), user.ID, body.Variant, body.Completed, body.DurationMs, rounds)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "internal error")
		return
	}

	writeJSON(w, http.StatusCreated, map[string]any{"id": game.ID})
}
