"use client";

import Chip from "@mui/material/Chip";
import MenuItem from "@mui/material/MenuItem";
import {
  DataGrid,
  GridColDef,
  GridColumnVisibilityModel,
} from "@mui/x-data-grid";
import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { Button, ButtonGroup, Divider, Stack, TextField } from "@mui/material";
import {
  battedBallColumns,
  batterColumns,
  batterCountingColumns,
  batterRatioColumns,
  columnGroupingModel,
  pitcherColumns,
  pitcherCountingColumns,
  pitcherRatioColumns,
  plateDisciplineColumns,
  statcastColumns,
} from "./columns";
import { PlayerData, PlayerType, Position } from "./datatypes";

const PITCHER_POSITIONS = [Position.STARTING_PITCHER, Position.RELIEF_PITCHER];
const BATTER_POSITIONS = [
  Position.CATCHER,
  Position.FIRST_BASE,
  Position.SECOND_BASE,
  Position.SHORTSTOP,
  Position.THIRD_BASE,
  Position.LEFT_FIELD,
  Position.CENTER_FIELD,
  Position.RIGHT_FIELD,
  Position.DESIGNATED_HITTER,
];

// def lineupSlotOrder(lineupSlot):
//     match lineupSlot:
//         case "C":
//             return 1
//         case "1B":
//             return 2
//         case "2B":
//             return 3
//         case "3B":
//             return 4
//         case "SS":
//             return 5
//         case "2B/SS":
//             return 6
//         case "1B/3B":
//             return 7
//         case "LF":
//             return 8
//         case "CF":
//             return 9
//         case "RF":
//             return 10
//         case "OF":
//             return 11
//         case "UTIL":
//             return 12
//         case "P":
//             return 13
//         case "SP":
//             return 14
//         case "RP":
//             return 15
//         case "BE":
//             return 16
//         case "IL":
//             return 17
//         case _:
//             return 18

export default function TeamTable() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<PlayerData[]>([]);
  const [selectedTeam, setSelectedTeam] = useState("Free Agent");
  const [playerType, setPlayerType] = useState(PlayerType.BATTER);
  const [columnVisibilityModel, setColumnVisibilityModel] =
    useState<GridColumnVisibilityModel>(
      { Team: false } /** team is selected via dropdown */
    );

  useEffect(() => {
    async function fetchPlayerData() {
      const res = await fetch("/api/getPlayerData");
      const data = (await res.json()) as PlayerData[];
      setData(data);
      setLoading(false);
      setSelectedTeam(
        data
          .filter((player) => player.Team !== "Free Agent")
          .map((player) => player.Team)[0]
      );
    }

    fetchPlayerData();
  }, []);

  function getRows() {
    return data
      .filter((player) => player.Team === selectedTeam)
      .filter((player) =>
        playerType === PlayerType.BATTER
          ? player["Eligible Positions"].some((position) =>
              BATTER_POSITIONS.includes(position)
            )
          : player["Eligible Positions"].some((position) =>
              PITCHER_POSITIONS.includes(position)
            )
      );
  }

  function getColumns() {
    return playerType === PlayerType.BATTER ? batterColumns : pitcherColumns;
  }

  function toggleColumns(showStat: boolean, columns: GridColDef[]) {
    setColumnVisibilityModel({
      ...columnVisibilityModel,
      ...columns
        .map((column) => {
          return { [column.field]: !showStat };
        })
        .reduce((x, y) => {
          return { ...x, ...y };
        }),
    });
  }

  return (
    <div style={{ width: "100%" }}>
      <div className="mb-3 flex justify-between items-end">
        <Stack direction="row" spacing={1} className="items-end">
          <TeamSelector
            selectedTeam={selectedTeam}
            setSelectedTeam={setSelectedTeam}
            teams={[
              ...new Set(
                data
                  .filter((player) => player.Team !== "Free Agent")
                  .map((player) => player.Team)
              ),
            ]}
          />
          <PlayerTypeSelector
            playerType={playerType}
            setPlayerType={setPlayerType}
          />
        </Stack>
        <ColumnVisibilityChips toggleColumns={toggleColumns} />
      </div>
      <div style={{ height: "600px" }}>
        <DataGrid
          loading={loading}
          rows={getRows()}
          columns={getColumns()}
          experimentalFeatures={{ columnGrouping: true }}
          columnGroupingModel={columnGroupingModel}
          pageSizeOptions={[]}
          columnVisibilityModel={columnVisibilityModel}
          onColumnVisibilityModelChange={(newModel) =>
            setColumnVisibilityModel(newModel)
          }
          disableRowSelectionOnClick
        />
      </div>
    </div>
  );
}

interface PlayerTypeSelectorProps {
  playerType: PlayerType;
  setPlayerType: Dispatch<SetStateAction<PlayerType>>;
}
function PlayerTypeSelector({
  playerType,
  setPlayerType,
}: PlayerTypeSelectorProps) {
  return (
    <ButtonGroup>
      <Button
        variant={playerType === PlayerType.BATTER ? "contained" : "outlined"}
        onClick={() => setPlayerType(PlayerType.BATTER)}
      >
        Batters
      </Button>
      <Button
        variant={playerType === PlayerType.PITCHER ? "contained" : "outlined"}
        onClick={() => setPlayerType(PlayerType.PITCHER)}
      >
        Pitchers
      </Button>
    </ButtonGroup>
  );
}

interface TeamSelectorProps {
  selectedTeam: string;
  setSelectedTeam: Dispatch<SetStateAction<string>>;
  teams: string[];
}
function TeamSelector({
  selectedTeam,
  setSelectedTeam,
  teams,
}: TeamSelectorProps) {
  const updateSelectedTeam = (event: ChangeEvent<HTMLInputElement>) => {
    setSelectedTeam(event.target.value as string);
  };

  return (
    <TextField
      id="teams"
      value={selectedTeam}
      label="Team"
      onChange={updateSelectedTeam}
      className="mr-3"
      select
    >
      {teams.map((team) => (
        <MenuItem key={team} value={team}>
          {team}
        </MenuItem>
      ))}
      <Divider />
      <MenuItem value="Free Agent">Free Agents</MenuItem>
    </TextField>
  );
}

function ColumnVisibilityChips({
  toggleColumns,
}: {
  toggleColumns: (showStat: boolean, columns: GridColDef[]) => void;
}) {
  const [showCountingStats, setShowCountingStats] = useState(true);
  const [showRatioStats, setShowRatioStats] = useState(true);
  const [showStatcastStats, setShowStatcastStats] = useState(true);
  const [showPlateDisciplineStats, setShowPlateDisciplineStats] =
    useState(true);
  const [showBattedBallStats, setShowBattedBallStats] = useState(true);

  function toggleButtonAndColumns(
    showStat: boolean,
    showStatSetter: Dispatch<SetStateAction<boolean>>,
    columns: GridColDef[]
  ) {
    showStatSetter(!showStat);
    toggleColumns(showStat, columns);
  }

  return (
    <Stack direction="row" spacing={1}>
      <Chip
        label="Counting"
        variant={showCountingStats ? undefined : "outlined"}
        color="primary"
        onClick={() =>
          toggleButtonAndColumns(showCountingStats, setShowCountingStats, [
            ...batterCountingColumns,
            ...pitcherCountingColumns,
          ])
        }
      />
      <Chip
        label="Ratios"
        variant={showRatioStats ? undefined : "outlined"}
        color="primary"
        onClick={() =>
          toggleButtonAndColumns(showRatioStats, setShowRatioStats, [
            ...batterRatioColumns,
            ...pitcherRatioColumns,
          ])
        }
      />
      <Chip
        label="Statcast"
        variant={showStatcastStats ? undefined : "outlined"}
        color="primary"
        onClick={() =>
          toggleButtonAndColumns(
            showStatcastStats,
            setShowStatcastStats,
            statcastColumns
          )
        }
      />
      <Chip
        label="Plate Discipline"
        variant={showPlateDisciplineStats ? undefined : "outlined"}
        color="primary"
        onClick={() =>
          toggleButtonAndColumns(
            showPlateDisciplineStats,
            setShowPlateDisciplineStats,
            plateDisciplineColumns
          )
        }
      />
      <Chip
        label="Batted Ball"
        variant={showBattedBallStats ? undefined : "outlined"}
        color="primary"
        onClick={() =>
          toggleButtonAndColumns(
            showBattedBallStats,
            setShowBattedBallStats,
            battedBallColumns
          )
        }
      />
    </Stack>
  );
}
