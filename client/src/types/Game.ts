export interface Game {
    game_id: number,
    date: string,
    home_team_name: string,
    home_team_id: number,
    home_team_city: string,
    away_team_name: string,
    away_team_city: string,
    status: string,
    home_score: string | number,
    away_score: string | number,
    arena: string,
    arena_city: string,
    arena_state: string
    home_team_abbr: string,
    away_team_abbr: string
}