export interface PlayerData {
  Name: string;
  Team: number;
  "Lineup Slot": Position;
  "Eligible Positions": Position[];
  PA?: number;
  H?: number;
  R?: number;
  HR?: number;
  RBI?: number;
  SB?: number;
  AVG?: number;
  xBA?: number;
  OBP?: number;
  SLG?: number;
  xSLG?: number;
  wOBA?: number;
  xwOBA?: number;
  "wRC+"?: number;
  EV?: number;
  maxEV?: number;
  LA?: number;
  Barrels?: number;
  "Barrel%"?: number;
  HardHit?: number;
  "HardHit%"?: number;
  "BB%"?: number;
  "K%"?: number;
  "O-Swing%"?: number;
  "Z-Swing%"?: number;
  "Swing%"?: number;
  "O-Contact%"?: number;
  "Z-Contact%"?: number;
  "Contact%"?: number;
  "Zone%"?: number;
  "F-Strike%"?: number;
  "SwStr%"?: number;
  "CStr%"?: number;
  "CSW%"?: number;
  BABIP?: number;
  "LD%"?: number;
  "GB%"?: number;
  "FB%"?: number;
  "IFFB%"?: number;
  "HR/FB"?: number;
  "Pull%"?: number;
  "Cent%"?: number;
  "Oppo%"?: number;
  W?: number;
  L?: number;
  SV?: number;
  G?: number;
  IP?: number;
  ERA?: number;
  WHIP?: number;
  xERA?: number;
  FIP?: number;
  xFIP?: number;
  "K/9"?: number;
  "BB/9"?: number;
  "K-BB%"?: number;
  "LOB%"?: number;
  id: number;
}

export enum Position {
  CATCHER = "C",
  FIRST_BASE = "1B",
  SECOND_BASE = "2B",
  SHORTSTOP = "SS",
  THIRD_BASE = "3B",
  FIRST_BASE_THIRD_BASE = "1B/3B",
  SECOND_BASE_SHORTSTOP = "2B/SS",
  LEFT_FIELD = "LF",
  CENTER_FIELD = "CF",
  RIGHT_FIELD = "RF",
  OUTFIELD = "OF",
  DESIGNATED_HITTER = "DH",
  UTILITY = "UTIL",
  PITCHER = "P",
  STARTING_PITCHER = "SP",
  RELIEF_PITCHER = "RP",
  BENCH = "BE",
  INJURED_LIST = "IL",
  EMPTY = "",
}

export enum PlayerType {
  BATTER,
  PITCHER,
}
