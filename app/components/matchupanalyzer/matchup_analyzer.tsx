import {
  Card,
  CardContent,
  CardHeader,
  Container,
  Divider,
  Grid,
  Box,
  Stack,
  Avatar,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { BoxScore, MatchupBoxScores, TeamBoxScore, Winner } from "./datatypes";
import { roundToHundredth, roundToThousandth } from "../util/formatter";

function getIndividualTeamBoxScores(boxScore: BoxScore): {
  homeBoxScore: TeamBoxScore;
  awayBoxScore: TeamBoxScore;
} {
  const homeBoxScore = {
    winner: boxScore.winner == Winner.Home,
    team: boxScore.home_team,
    wins: boxScore.home_wins,
    losses: boxScore.home_losses,
    ties: boxScore.home_ties,
    stats: boxScore.home_stats,
  };
  const awayBoxScore = {
    winner: boxScore.winner == Winner.Away,
    team: boxScore.away_team,
    wins: boxScore.away_wins,
    losses: boxScore.away_losses,
    ties: boxScore.away_ties,
    stats: boxScore.away_stats,
  };
  return { homeBoxScore, awayBoxScore };
}

function statOrder(stat: string) {
  switch (stat) {
    case "R":
      return 1;
    case "HR":
      return 2;
    case "RBI":
      return 3;
    case "SB":
      return 4;
    case "OBP":
      return 5;
    case "SLG":
      return 6;
    // Pitcher stats
    case "IP":
    case "OUTS":
      return 7;
    case "QS":
      return 8;
    case "SV":
      return 9;
    case "ERA":
      return 10;
    case "WHIP":
      return 11;
    case "K/9":
      return 12;
    default:
      return Infinity;
  }
}

function statFormatter(stat: string, statValue: number) {
    switch (stat) {
        case "OBP":
        case "SLG":
            return roundToThousandth(statValue);
        case "ERA":
        case "WHIP":
        case "K/9":
            return roundToHundredth(statValue);
        case "OUTS":
            return (statValue/3).toFixed(0) + '.' + `${Math.floor(statValue%3)}`;
        default:
            return statValue;
    }
}

function statName(stat: string) {
    switch (stat) {
        case "OUTS":
            return "IP";
        default:
            return stat;
    }
}

interface MatchupStats {
  stat: string;
  statValue: number;
  opponentStatValue: number;
  averageStatValue: number;
}

function MatchupStatRow({ matchupStats }: { matchupStats: MatchupStats }) {
  return (
    <Container align={"center"}>
      <Grid container direction="row"  spacing={2}>
        <Grid item xs>
          {statFormatter(matchupStats.stat, matchupStats.opponentStatValue)}
        </Grid>
        <Divider orientation="vertical" flexItem />
        <Grid item xs>
          {statFormatter(matchupStats.stat, matchupStats.statValue)}
        </Grid>
        <Grid item xs>
          {statFormatter(matchupStats.stat, matchupStats.averageStatValue)}
        </Grid>
      </Grid>
      <Typography variant="caption">{statName(matchupStats.stat)}</Typography>
    </Container>
  );
}

function BoxScoreCard({
  matchupBoxScores,
  teamId,
}: {
  matchupBoxScores: MatchupBoxScores;
  teamId: number;
}) {
  const relevantBoxScore = matchupBoxScores.boxScores.find(
    (boxScore) =>
      boxScore.home_team.team_id == teamId ||
      boxScore.away_team.team_id == teamId
  )!;
  const { homeBoxScore, awayBoxScore } =
    getIndividualTeamBoxScores(relevantBoxScore);
  const userIsHomeTeam = relevantBoxScore.home_team.team_id == teamId;
  const userBoxScore = userIsHomeTeam ? homeBoxScore : awayBoxScore;
  const opponentBoxScore = userIsHomeTeam ? awayBoxScore : homeBoxScore;

  return (
    <Card sx={{ minWidth: 350 }} raised={true}>
      <CardHeader
        title={"Matchup " + matchupBoxScores.matchupPeriod}
        className="text-center"
      />
      <CardContent>
        <Grid container align={"center"}>
          <Grid item xs>
            <Avatar src={opponentBoxScore.team.logo_url} />
            <Typography variant="caption">
              {opponentBoxScore.team.team_name}
            </Typography>
          </Grid>
          <Grid item xs>
            <Avatar src={userBoxScore.team.logo_url} />
            <Typography variant="caption">
              {userBoxScore.team.team_name}
            </Typography>
          </Grid>
          <Grid item xs>
            <Avatar
              src={userBoxScore.team.logo_url}
              style={{ filter: "grayscale(100%)" }}
            />
            <Typography variant="caption">{"League Average"}</Typography>
          </Grid>
        </Grid>
        <Stack>
          {Object.keys(userBoxScore.stats)
            .filter((stat) => userBoxScore.stats[stat].result !== null)
            .sort((a, b) => statOrder(a) - statOrder(b))
            .map((stat) => (
              <MatchupStatRow
                key={stat}
                matchupStats={{
                  stat,
                  statValue: userBoxScore.stats[stat].value,
                  opponentStatValue: opponentBoxScore.stats[stat].value,
                  averageStatValue: matchupBoxScores.averageStats[stat],
                }}
              />
            ))}
        </Stack>
      </CardContent>
    </Card>
  );
}

export default function MatchupAnalyzer() {
  const [loading, setLoading] = useState(true);
  const [boxScores, setBoxScores] = useState<MatchupBoxScores[]>([]);

  useEffect(() => {
    async function fetchBoxScores() {
      const res = await fetch("/api/getEspnBoxScores");
      const boxScores = (await res.json()) as MatchupBoxScores[];
      setBoxScores(boxScores);
      console.log(boxScores);
      setLoading(false);
    }

    fetchBoxScores();
  }, []);

  return (
    <Stack direction="row" spacing={3}>
      {boxScores.map((boxScore) => (
        <BoxScoreCard
          key={boxScore.matchupPeriod}
          matchupBoxScores={boxScore}
          teamId={1}
        ></BoxScoreCard>
      ))}
    </Stack>
  );
}
