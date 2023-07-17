import {
  GridColDef,
  GridColumnGroupingModel,
  GridComparatorFn,
  GridValueFormatterParams,
} from "@mui/x-data-grid";

const DEFAULT_STAT_WIDTH = 70;

function lineupSlotOrder(lineupSlot: string) {
  switch(lineupSlot) {
      case "C":
          return 1
      case "1B":
          return 2
      case "2B":
          return 3
      case "3B":
          return 4
      case "SS":
          return 5
      case "2B/SS":
          return 6
      case "1B/3B":
          return 7
      case "LF":
          return 8
      case "CF":
          return 9
      case "RF":
          return 10
      case "OF":
          return 11
      case "UTIL":
          return 12
      case "P":
          return 13
      case "SP":
          return 14
      case "RP":
          return 15
      case "BE":
          return 16
      case "IL":
          return 17
      default:
          return 18
  }
}

const positionComparator: GridComparatorFn<string> = (r1: string, r2: string) => {
  return lineupSlotOrder(r2) - lineupSlotOrder(r1);
}

export const fantasyInfoColumns: GridColDef[] = [
  {
    type: "number",
    field: "Name",
    headerName: "Name",
    sortable: false,
    width: 160,
  },
  { type: "number", field: "Team", headerName: "Team", width: 160 },
  {
    type: "string",
    field: "Lineup Slot",
    headerName: "Lineup Slot",
    width: 120,
    sortComparator: positionComparator,
  },
  {
    type: "number",
    field: "Eligible Positions",
    headerName: "Eligible Positions",
    width: 200,
  },
];

export const batterCountingColumns: GridColDef[] = [
  { type: "number", field: "PA", headerName: "PA", width: DEFAULT_STAT_WIDTH },
  { type: "number", field: "H", headerName: "H", width: DEFAULT_STAT_WIDTH },
  { type: "number", field: "R", headerName: "R", width: DEFAULT_STAT_WIDTH },
  { type: "number", field: "HR", headerName: "HR", width: DEFAULT_STAT_WIDTH },
  {
    type: "number",
    field: "RBI",
    headerName: "RBI",
    width: DEFAULT_STAT_WIDTH,
  },
  { type: "number", field: "SB", headerName: "SB", width: DEFAULT_STAT_WIDTH },
];

export const batterRatioColumns: GridColDef[] = [
  {
    type: "number",
    field: "AVG",
    headerName: "AVG",
    width: DEFAULT_STAT_WIDTH,
    valueFormatter: roundToThousandth,
  },
  {
    type: "number",
    field: "xBA",
    headerName: "xBA",
    width: DEFAULT_STAT_WIDTH,
    valueFormatter: roundToThousandth,
  },
  {
    type: "number",
    field: "OBP",
    headerName: "OBP",
    width: DEFAULT_STAT_WIDTH,
    valueFormatter: roundToThousandth,
  },
  {
    type: "number",
    field: "SLG",
    headerName: "SLG",
    width: DEFAULT_STAT_WIDTH,
    valueFormatter: roundToThousandth,
  },
  {
    type: "number",
    field: "xSLG",
    headerName: "xSLG",
    width: DEFAULT_STAT_WIDTH,
    valueFormatter: roundToThousandth,
  },
  {
    type: "number",
    field: "wOBA",
    headerName: "wOBA",
    width: DEFAULT_STAT_WIDTH,
    valueFormatter: roundToThousandth,
  },
  {
    type: "number",
    field: "xwOBA",
    headerName: "xwOBA",
    width: DEFAULT_STAT_WIDTH,
    valueFormatter: roundToThousandth,
  },
  {
    type: "number",
    field: "wRC+",
    headerName: "wRC+",
    width: DEFAULT_STAT_WIDTH,
  },
];

export const pitcherCountingColumns: GridColDef[] = [
  { type: "number", field: "W", headerName: "W", width: DEFAULT_STAT_WIDTH },
  { type: "number", field: "L", headerName: "L", width: DEFAULT_STAT_WIDTH },
  { type: "number", field: "SV", headerName: "SV", width: DEFAULT_STAT_WIDTH },
  { type: "number", field: "G", headerName: "G", width: DEFAULT_STAT_WIDTH },
  { type: "number", field: "IP", headerName: "IP", width: DEFAULT_STAT_WIDTH },
];

export const pitcherRatioColumns: GridColDef[] = [
  {
    type: "number",
    field: "ERA",
    headerName: "ERA",
    width: DEFAULT_STAT_WIDTH,
    valueFormatter: roundToHundredth,
  },
  {
    type: "number",
    field: "xERA",
    headerName: "xERA",
    width: DEFAULT_STAT_WIDTH,
    valueFormatter: roundToHundredth,
  },
  {
    type: "number",
    field: "WHIP",
    headerName: "WHIP",
    width: DEFAULT_STAT_WIDTH,
    valueFormatter: roundToHundredth,
  },
  {
    type: "number",
    field: "FIP",
    headerName: "FIP",
    width: DEFAULT_STAT_WIDTH,
    valueFormatter: roundToHundredth,
  },
  {
    type: "number",
    field: "xFIP",
    headerName: "xFIP",
    width: DEFAULT_STAT_WIDTH,
    valueFormatter: roundToHundredth,
  },
  {
    type: "number",
    field: "K/9",
    headerName: "K/9",
    width: DEFAULT_STAT_WIDTH,
    valueFormatter: roundToHundredth,
  },
  {
    type: "number",
    field: "BB/9",
    headerName: "BB/9",
    width: DEFAULT_STAT_WIDTH,
    valueFormatter: roundToHundredth,
  },
];

export const statcastColumns: GridColDef[] = [
  { type: "number", field: "EV", headerName: "EV", width: DEFAULT_STAT_WIDTH },
  {
    type: "number",
    field: "maxEV",
    headerName: "maxEV",
    width: DEFAULT_STAT_WIDTH,
  },
  { type: "number", field: "LA", headerName: "LA", width: DEFAULT_STAT_WIDTH },
  {
    type: "number",
    field: "Barrels",
    headerName: "Barrels",
    width: DEFAULT_STAT_WIDTH,
  },
  {
    type: "number",
    field: "Barrel%",
    headerName: "Barrel%",
    width: DEFAULT_STAT_WIDTH,
    valueFormatter: asPercent,
  },
  {
    type: "number",
    field: "HardHit",
    headerName: "HardHit",
    width: DEFAULT_STAT_WIDTH,
  },
  {
    type: "number",
    field: "HardHit%",
    headerName: "HardHit%",
    width: DEFAULT_STAT_WIDTH,
    valueFormatter: asPercent,
  },
];

export const plateDisciplineColumns: GridColDef[] = [
  {
    type: "number",
    field: "BB%",
    headerName: "BB%",
    width: DEFAULT_STAT_WIDTH,
    valueFormatter: asPercent,
  },
  {
    type: "number",
    field: "K%",
    headerName: "K%",
    width: DEFAULT_STAT_WIDTH,
    valueFormatter: asPercent,
  },
  {
    type: "number",
    field: "O-Swing%",
    headerName: "O-Swing%",
    width: DEFAULT_STAT_WIDTH,
    valueFormatter: asPercent,
  },
  {
    type: "number",
    field: "Z-Swing%",
    headerName: "Z-Swing%",
    width: DEFAULT_STAT_WIDTH,
    valueFormatter: asPercent,
  },
  {
    type: "number",
    field: "Swing%",
    headerName: "Swing%",
    width: DEFAULT_STAT_WIDTH,
    valueFormatter: asPercent,
  },
  {
    type: "number",
    field: "O-Contact%",
    headerName: "O-Contact%",
    width: DEFAULT_STAT_WIDTH,
    valueFormatter: asPercent,
  },
  {
    type: "number",
    field: "Z-Contact%",
    headerName: "Z-Contact%",
    width: DEFAULT_STAT_WIDTH,
    valueFormatter: asPercent,
  },
  {
    type: "number",
    field: "Contact%",
    headerName: "Contact%",
    width: DEFAULT_STAT_WIDTH,
    valueFormatter: asPercent,
  },
  {
    type: "number",
    field: "Zone%",
    headerName: "Zone%",
    width: DEFAULT_STAT_WIDTH,
    valueFormatter: asPercent,
  },
  {
    type: "number",
    field: "F-Strike%",
    headerName: "F-Strike%",
    width: DEFAULT_STAT_WIDTH,
    valueFormatter: asPercent,
  },
  {
    type: "number",
    field: "SwStr%",
    headerName: "SwStr%",
    width: DEFAULT_STAT_WIDTH,
    valueFormatter: asPercent,
  },
  {
    type: "number",
    field: "CStr%",
    headerName: "CStr%",
    width: DEFAULT_STAT_WIDTH,
    valueFormatter: asPercent,
  },
  {
    type: "number",
    field: "CSW%",
    headerName: "CSW%",
    width: DEFAULT_STAT_WIDTH,
    valueFormatter: asPercent,
  },
];

export const battedBallBatterColumns: GridColDef[] = [
  {
    type: "number",
    field: "BABIP",
    headerName: "BABIP",
    width: DEFAULT_STAT_WIDTH,
    valueFormatter: roundToThousandth,
  },
  {
    type: "number",
    field: "LD%",
    headerName: "LD%",
    width: DEFAULT_STAT_WIDTH,
    valueFormatter: asPercent,
  },
  {
    type: "number",
    field: "GB%",
    headerName: "GB%",
    width: DEFAULT_STAT_WIDTH,
    valueFormatter: asPercent,
  },
  {
    type: "number",
    field: "FB%",
    headerName: "FB%",
    width: DEFAULT_STAT_WIDTH,
    valueFormatter: asPercent,
  },
  {
    type: "number",
    field: "IFFB%",
    headerName: "IFFB%",
    width: DEFAULT_STAT_WIDTH,
    valueFormatter: asPercent,
  },
  {
    type: "number",
    field: "HR/FB",
    headerName: "HR/FB",
    width: DEFAULT_STAT_WIDTH,
    valueFormatter: asPercent,
  },
  {
    type: "number",
    field: "Pull%",
    headerName: "Pull%",
    width: DEFAULT_STAT_WIDTH,
    valueFormatter: asPercent,
  },
  {
    type: "number",
    field: "Cent%",
    headerName: "Cent%",
    width: DEFAULT_STAT_WIDTH,
    valueFormatter: asPercent,
  },
  {
    type: "number",
    field: "Oppo%",
    headerName: "Oppo%",
    width: DEFAULT_STAT_WIDTH,
    valueFormatter: asPercent,
  },
];

export const battedBallColumns: GridColDef[] = [
  {
    type: "number",
    field: "BABIP",
    headerName: "BABIP",
    width: DEFAULT_STAT_WIDTH,
    valueFormatter: roundToThousandth,
  },
  {
    type: "number",
    field: "LD%",
    headerName: "LD%",
    width: DEFAULT_STAT_WIDTH,
    valueFormatter: asPercent,
  },
  {
    type: "number",
    field: "GB%",
    headerName: "GB%",
    width: DEFAULT_STAT_WIDTH,
    valueFormatter: asPercent,
  },
  {
    type: "number",
    field: "FB%",
    headerName: "FB%",
    width: DEFAULT_STAT_WIDTH,
    valueFormatter: asPercent,
  },
  {
    type: "number",
    field: "IFFB%",
    headerName: "IFFB%",
    width: DEFAULT_STAT_WIDTH,
    valueFormatter: asPercent,
  },
  {
    type: "number",
    field: "HR/FB",
    headerName: "HR/FB",
    width: DEFAULT_STAT_WIDTH,
    valueFormatter: asPercent,
  },
];

export const batterColumns: GridColDef[] = fantasyInfoColumns.concat(
  batterCountingColumns,
  batterRatioColumns,
  statcastColumns,
  plateDisciplineColumns,
  battedBallColumns
);

export const pitcherColumns: GridColDef[] = fantasyInfoColumns.concat(
  pitcherCountingColumns,
  pitcherRatioColumns,
  statcastColumns,
  plateDisciplineColumns,
  battedBallColumns
);

export const columnGroupingModel: GridColumnGroupingModel = [
  {
    groupId: "fantasy_info",
    headerName: "Fantasy",
    children: fantasyInfoColumns.map((column) => {
      return { field: column.field };
    }),
  },
  {
    groupId: "batter_counting",
    headerName: "Counting",
    children: batterCountingColumns.map((column) => {
      return { field: column.field };
    }),
  },
  {
    groupId: "pitcher_counting",
    headerName: "Counting",
    children: pitcherCountingColumns.map((column) => {
      return { field: column.field };
    }),
  },
  {
    groupId: "batter_ratios",
    headerName: "Ratios",
    children: batterRatioColumns.map((column) => {
      return { field: column.field };
    }),
  },
  {
    groupId: "pitcher_ratios",
    headerName: "Ratios",
    children: pitcherRatioColumns.map((column) => {
      return { field: column.field };
    }),
  },
  {
    groupId: "statcast",
    headerName: "Statcast",
    children: statcastColumns.map((column) => {
      return { field: column.field };
    }),
  },
  {
    groupId: "plate_discipline",
    headerName: "Plate Discipline",
    children: plateDisciplineColumns.map((column) => {
      return { field: column.field };
    }),
  },
  {
    groupId: "batted_ball",
    headerName: "Batted Ball",
    children: battedBallColumns.map((column) => {
      return { field: column.field };
    }),
  },
];

function roundToHundredth(params: GridValueFormatterParams<number>) {
  if (params.value == null) {
    return "";
  }
  return params.value.toFixed(2);
}

function roundToThousandth(params: GridValueFormatterParams<number>) {
  if (params.value == null) {
    return "";
  }
  return params.value.toFixed(3);
}

function asPercent(params: GridValueFormatterParams<number>) {
  if (params.value == null) {
    return "";
  }
  return `${(params.value * 100).toFixed(1)}%`;
}
