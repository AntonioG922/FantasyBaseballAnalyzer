export interface MatchupBoxScores {
  matchupPeriod: number;
  boxScores: BoxScore[];
  averageStats: { [key: string]: number };
}

export interface BoxScore {
  winner: Winner;
  home_team: Team;
  home_wins: number;
  home_losses: number;
  home_ties: number;
  home_stats: { [key: string]: Stat };
  away_team: Team;
  away_wins: number;
  away_losses: number;
  away_ties: number;
  away_stats: { [key: string]: Stat };
}

export interface TeamBoxScore {
  winner: boolean;
  team: Team;
  wins: number;
  losses: number;
  ties: number;
  stats: { [key: string]: Stat };
}

export interface Stat {
  value: number;
  result: Result | null;
}

export enum Result {
  Loss = "LOSS",
  Tie = "TIE",
  Win = "WIN",
}

export interface Team {
  logo_url: string;
  team_abbrev: string;
  team_id: number;
  team_name: string;
}

export enum Winner {
  Away = "AWAY",
  Home = "HOME",
  Tie = "TIE",
  Undecided = "UNDECIDED",
}
