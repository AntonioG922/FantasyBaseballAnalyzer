"use client"

import TeamTable from './components/teamtable/team_table';
import MatchupAnalyzer from './components/matchup_analyzer';
import { Divider, Stack } from '@mui/material';

export default function Home() {
  const leagueInfo = async () => {
    const res = await fetch('/api/getLeagueInfo');
    const data = await res.json();
    console.log(data);
  }
  const playerData = async () => {
    const start = Date.now();
    const res = await fetch('/api/getPlayerData');
    const data = await res.json();
    console.log(data);
    const end = Date.now();
    console.log(`Execution time: ${end - start} ms`);
  }

  return (
    <main className="flex min-h-screen flex-col p-24">
      <Stack spacing={5}>
        <TeamTable></TeamTable>
        <Divider variant='middle' />
        <button onClick={leagueInfo}>League Info</button>
        <button onClick={playerData}>Player Data</button>
        {/* <MatchupAnalyzer></MatchupAnalyzer> */}
      </Stack>
    </main>
  )
}
