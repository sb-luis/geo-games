package store

import (
	"context"
	"fmt"
)

type CountryStat struct {
	Feature    string
	Correct    int
	Wrong      int
	Skipped    int
	AvgCorrectMs *int64
}

type PracticeStats struct {
	GamesPlayed    int
	GamesCompleted int
	Countries      []CountryStat
}

func (s *Store) GetPracticeStats(ctx context.Context, userID int64, variant string) (PracticeStats, error) {
	var stats PracticeStats

	if err := s.db.QueryRow(ctx, `
		SELECT
			COUNT(*)                                   AS games_played,
			COUNT(*) FILTER (WHERE completed = true)   AS games_completed
		FROM practice_games
		WHERE user_id = $1 AND variant = $2
	`, userID, variant).Scan(&stats.GamesPlayed, &stats.GamesCompleted); err != nil {
		return PracticeStats{}, fmt.Errorf("query game counts: %w", err)
	}

	rows, err := s.db.Query(ctx, `
		SELECT
			r.feature,
			COUNT(*) FILTER (WHERE r.outcome = 'correct')                        AS correct,
			COUNT(*) FILTER (WHERE r.outcome = 'wrong')                          AS wrong,
			COUNT(*) FILTER (WHERE r.outcome = 'skipped')                        AS skipped,
			AVG(r.duration_ms) FILTER (WHERE r.outcome = 'correct')::BIGINT      AS avg_correct_ms
		FROM practice_rounds r
		JOIN practice_games g ON g.id = r.game_id
		WHERE g.user_id = $1 AND g.variant = $2
		GROUP BY r.feature
		ORDER BY r.feature
	`, userID, variant)
	if err != nil {
		return PracticeStats{}, fmt.Errorf("query country stats: %w", err)
	}
	defer rows.Close()

	for rows.Next() {
		var cs CountryStat
		if err := rows.Scan(&cs.Feature, &cs.Correct, &cs.Wrong, &cs.Skipped, &cs.AvgCorrectMs); err != nil {
			return PracticeStats{}, fmt.Errorf("scan country stat: %w", err)
		}
		stats.Countries = append(stats.Countries, cs)
	}
	return stats, rows.Err()
}
