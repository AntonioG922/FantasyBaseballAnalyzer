import { Divider, MenuItem, TextField } from "@mui/material";
import { ChangeEvent, Dispatch, SetStateAction, useEffect, useState } from "react";
import { Team } from "./datatypes";

export default function TeamSelector({
    selectedTeam,
    setSelectedTeam,
    teams
  }: {
    selectedTeam: number;
    setSelectedTeam: Dispatch<SetStateAction<number>>;
    teams: Team[];
  }) {
    const updateSelectedTeam = (event: ChangeEvent<HTMLInputElement>) => {
      setSelectedTeam(event.target.value as unknown as number);
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
          <MenuItem key={team.team_id} value={team.team_id}>
            {team.team_name}
          </MenuItem>
        ))}
        <Divider />
        <MenuItem value="Free Agent">Free Agents</MenuItem>
      </TextField>
    );
  }