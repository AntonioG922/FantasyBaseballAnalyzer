"use client";

import TeamTable from "./components/teamtable/team_table";
import MatchupAnalyzer from "./components/matchupanalyzer/matchup_analyzer";
import { Divider, Paper, Stack } from "@mui/material";
import { useEffect, useState } from "react";
import TeamSelector from "./components/teamselector/teamselector";

export default function Home() {
  const [selectedTeam, setSelectedTeam] = useState(-1);
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    async function fetchTeams() {
      const res = await fetch("/api/getEspnLeagueInfo");
      const data = (await res.json()).teams;
      setTeams(data);
      setSelectedTeam(data[0].team_id);
    }

    fetchTeams();
  }, []);

  const leagueInfo = async () => {
    const start = Date.now();
    const res = await fetch("/api/getEspnLeagueInfo");
    const data = await res.json();
    console.log(data);
    const end = Date.now();
    console.log(`Execution time: ${end - start} ms`);
  };
  const playerData = async () => {
    const start = Date.now();
    const res = await fetch("/api/getPlayerData");
    const data = await res.json();
    console.log(data);
    const end = Date.now();
    console.log(`Execution time: ${end - start} ms`);
  };
  const boxScores = async () => {
    const start = Date.now();
    const res = await fetch("/api/getEspnBoxScores");
    const data = await res.json();
    console.log(data);
    const end = Date.now();
    console.log(`Execution time: ${end - start} ms`);
  };

  return (
    <main className="flex min-h-screen flex-col px-24 py-12">
      <Stack spacing={5}>
        <Paper elevation={0}>
        <TeamSelector
            selectedTeam={selectedTeam}
            setSelectedTeam={setSelectedTeam}
            teams={teams}
          />
        </Paper>
        <Paper className="p-4">
          <TeamTable selectedTeamId={selectedTeam}></TeamTable>
        </Paper>
        <Divider variant="middle" />
        {/* <button onClick={leagueInfo}>League Info</button>
        <button onClick={playerData}>Player Datas</button>
        <button onClick={boxScores}>Box Scores</button> */}
        <Paper className="p-4">
          <MatchupAnalyzer teamId={selectedTeam}></MatchupAnalyzer>
        </Paper>
      </Stack>
    </main>
  );
}
