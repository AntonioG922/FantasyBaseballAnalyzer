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
import TeamSelector from "../teamselector/teamselector";

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

export default function TeamTable({selectedTeamId}: {selectedTeamId: number}) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<PlayerData[]>([]);
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
    }

    fetchPlayerData();
  }, []);

  function getRows() {
    return data
      .filter((player) => player.Team === selectedTeamId)
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
          initialState={{
            sorting: {
              sortModel: [{ field: 'Lineup Slot', sort: 'desc' }],
            },
          }}
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

function PlayerTypeSelector({
  playerType,
  setPlayerType,
}: {
  playerType: PlayerType;
  setPlayerType: Dispatch<SetStateAction<PlayerType>>;
}) {
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
