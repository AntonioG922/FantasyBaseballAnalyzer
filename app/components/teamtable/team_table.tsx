"use client";

import Chip from "@mui/material/Chip";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import {
  DataGrid,
  GridColDef,
  GridColumnVisibilityModel,
} from "@mui/x-data-grid";
import { ChangeEvent, Dispatch, SetStateAction, useState } from "react";
import { data } from "./data";
import { Button, ButtonGroup, Divider, Stack, TextField } from "@mui/material";
import { battedBallColumns, batterColumns, batterCountingColumns, batterRatioColumns, columnGroupingModel, pitcherColumns, pitcherCountingColumns, pitcherRatioColumns, plateDisciplineColumns, statcastColumns } from "./columns";

const PITCHER_POSITIONS = ["SP", "RP"];
const BATTER_POSITIONS = ["C", "1B", "2B", "SS", "3B", "LF", "CF", "RF", "DH"];

enum PLAYER_TYPE {
  BATTER,
  PITCHER,
}

export default function TeamTable() {
  const [selectedTeam, setSelectedTeam] = useState(data.filter(player => player.Team !== "Free Agent").map(player => player.Team)[0]);
  const [playerType, setPlayerType] = useState(PLAYER_TYPE.BATTER);
  const [showCountingStats, setShowCountingStats] = useState(true);
  const [showRatioStats, setShowRatioStats] = useState(true);
  const [showStatcastStats, setShowStatcastStats] = useState(true);
  const [showPlateDisciplineStats, setShowPlateDisciplineStats] =
    useState(true);
  const [showBattedBallStats, setShowBattedBallStats] = useState(true);
  const [columnVisibilityModel, setColumnVisibilityModel] =
    useState<GridColumnVisibilityModel>(
      { Team: false } /** team is selected via dropdown */
    );

  function getRows() {
    return data
      .filter((player) => player.Team === selectedTeam)
      .filter((player) =>
        playerType === PLAYER_TYPE.BATTER
          ? player["Eligible Positions"].some((position) =>
              BATTER_POSITIONS.includes(position)
            )
          : player["Eligible Positions"].some((position) =>
              PITCHER_POSITIONS.includes(position)
            )
      );
  }

  function getColumns() {
    return playerType === PLAYER_TYPE.BATTER ? batterColumns : pitcherColumns;
  }

  const onTeamChange = (event: ChangeEvent) => {
    setSelectedTeam(event.target.value as string);
  };

  function toggleColumns(
    showStat: boolean,
    showStatSetter: Dispatch<SetStateAction<boolean>>,
    columns: GridColDef[]
  ) {
    showStatSetter(!showStat);
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
          <TextField
            id="teams"
            value={selectedTeam}
            label="Team"
            onChange={onTeamChange}
            className="mr-3"
            select
          >
            {[...new Set(data.filter((player) => player.Team !== "Free Agent").map((player) => player.Team))].map((team) => (
              <MenuItem key={team} value={team}>{team}</MenuItem>
            ))}
            <Divider />
            <MenuItem value="Free Agent">Free Agents</MenuItem>
          </TextField>
          <ButtonGroup>
            <Button
              variant={
                playerType === PLAYER_TYPE.BATTER ? "contained" : "outlined"
              }
              onClick={() => setPlayerType(PLAYER_TYPE.BATTER)}
            >
              Batters
            </Button>
            <Button
              variant={
                playerType === PLAYER_TYPE.PITCHER ? "contained" : "outlined"
              }
              onClick={() => setPlayerType(PLAYER_TYPE.PITCHER)}
            >
              Pitchers
            </Button>
          </ButtonGroup>
          </Stack>
        <Stack direction="row" spacing={1}>
          <Chip
            label="Counting"
            variant={showCountingStats ? undefined : "outlined"}
            color="primary"
            onClick={() =>
              toggleColumns(
                showCountingStats,
                setShowCountingStats,
                [...batterCountingColumns, ...pitcherCountingColumns]
              )
            }
          />
          <Chip
            label="Ratios"
            variant={showRatioStats ? undefined : "outlined"}
            color="primary"
            onClick={() =>
              toggleColumns(
                showRatioStats,
                setShowRatioStats,
                [...batterRatioColumns, ...pitcherRatioColumns]
              )
            }
          />
          <Chip
            label="Statcast"
            variant={showStatcastStats ? undefined : "outlined"}
            color="primary"
            onClick={() =>
              toggleColumns(
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
              toggleColumns(
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
              toggleColumns(
                showBattedBallStats,
                setShowBattedBallStats,
                battedBallColumns
              )
            }
          />
        </Stack>
      </div>
      <div style={{ height: "600px" }}>
        <DataGrid
          rows={getRows()}
          columns={getColumns()}
          experimentalFeatures={{ columnGrouping: true }}
          columnGroupingModel={columnGroupingModel}
          pageSizeOptions={[]}
          columnVisibilityModel={columnVisibilityModel}
          onColumnVisibilityModelChange={(newModel) =>
            setColumnVisibilityModel(newModel)
          }
        />
      </div>
    </div>
  );
}
