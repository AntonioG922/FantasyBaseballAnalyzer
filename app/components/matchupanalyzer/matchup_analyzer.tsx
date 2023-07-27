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
import {
  BoxScore,
  MatchupBoxScores,
  Result,
  TeamBoxScore,
  Winner,
} from "./datatypes";
import {
  roundToHundredth,
  roundToTenth,
  roundToThousandth,
} from "../util/formatter";

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
      return (statValue / 3).toFixed(0) + "." + `${Math.floor(statValue % 3)}`;
    default:
      return statValue % 1 === 0 ? statValue : roundToTenth(statValue);
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

function userResult(
  stat: string,
  userStat: number,
  opponentStat: number
): Result {
  switch (stat) {
    case "ERA":
    case "WHIP":
      return userStat < opponentStat
        ? Result.Win
        : userStat > opponentStat
        ? Result.Loss
        : Result.Tie;
    default:
      return userStat > opponentStat
        ? Result.Win
        : userStat < opponentStat
        ? Result.Loss
        : Result.Tie;
  }
}

function StatsDivider({
  stat,
  userStat,
  opposingStat,
}: {
  stat: string;
  userStat: number;
  opposingStat: number;
}) {
  const result = userResult(stat, userStat, opposingStat);
  return (
    <Divider
      flexItem
      sx={{
        width: "100%",
        borderBottomWidth: 2,
        bgcolor:
          result === Result.Win
            ? "green"
            : result === Result.Loss
            ? "red"
            : "grey",
      }}
    />
  );
}

function MatchupStatRow({ matchupStats }: { matchupStats: MatchupStats }) {
  return (
    <Box textAlign={"center"}>
      <Grid container direction="row">
        <Grid item xs>
          {statFormatter(matchupStats.stat, matchupStats.opponentStatValue)}
        </Grid>
        <Grid item xs={2} container alignContent={"center"}>
          <StatsDivider
            stat={matchupStats.stat}
            userStat={matchupStats.statValue}
            opposingStat={matchupStats.opponentStatValue}
          />
        </Grid>
        <Grid item xs>
          {statFormatter(matchupStats.stat, matchupStats.statValue)}
        </Grid>
        <Grid item xs={2} container alignContent={"center"}>
          <StatsDivider
            stat={matchupStats.stat}
            userStat={matchupStats.statValue}
            opposingStat={matchupStats.averageStatValue}
          />
        </Grid>
        <Grid item xs>
          {statFormatter(matchupStats.stat, matchupStats.averageStatValue)}
        </Grid>
      </Grid>
      <Typography variant="caption">{statName(matchupStats.stat)}</Typography>
    </Box>
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
  const userResultsAgainstLeague = matchupBoxScores.boxScores
    .flatMap((boxScore) =>
      boxScore.away_team.team_id === teamId
        ? [boxScore.home_stats]
        : boxScore.home_team.team_id === teamId
        ? [boxScore.away_stats]
        : [boxScore.home_stats, boxScore.away_stats]
    )
    .map((opponentStats) =>
      Object.keys(opponentStats)
        .filter((stat) => opponentStats[stat].result !== null)
        .map((stat) =>
          userBoxScore.stats[stat].value > opponentStats[stat].value
            ? Result.Win
            : userBoxScore.stats[stat].value < opponentStats[stat].value
            ? Result.Loss
            : Result.Tie
        )
    )
    .flatMap((winsAndLosses) => winsAndLosses);
  const numberOfOtherTeams = matchupBoxScores.boxScores.length * 2 - 1;
  const userAverageWins =
    userResultsAgainstLeague.filter((result) => result === Result.Win).length /
    numberOfOtherTeams;
  const userAverageLosses =
    userResultsAgainstLeague.filter((result) => result === Result.Loss).length /
    numberOfOtherTeams;
  const matchupWinsMinusAverageWins = userBoxScore.wins - userAverageWins;

  return (
    <Card sx={{ minWidth: 350 }} variant="outlined">
      <CardHeader
        title={"Matchup " + matchupBoxScores.matchupPeriod}
        className="text-center pb-0"
      />
      <CardContent>
        <Grid container justifyContent={"center"} alignContent={"center"}>
          <Grid item xs container direction={"column"} alignItems={"center"}>
            <Avatar src={opponentBoxScore.team.logo_url} />
            <Typography variant="caption">
              {opponentBoxScore.team.team_abbrev}
            </Typography>
          </Grid>
          <Grid item xs={2}></Grid>
          <Grid item xs container direction={"column"} alignItems={"center"}>
            <Avatar src={userBoxScore.team.logo_url} />
            <Typography variant="caption">
              {userBoxScore.team.team_abbrev}
            </Typography>
          </Grid>
          <Grid item xs={2}></Grid>
          <Grid item xs container justifyContent={"center"}>
            <Avatar
              src={userBoxScore.team.logo_url}
              style={{ filter: "grayscale(100%)" }}
            />
            <Typography variant="caption">{"League"}</Typography>
          </Grid>
        </Grid>
        <Grid container className="mb-2">
          <Grid item xs textAlign={"center"}>
            {opponentBoxScore.wins}
          </Grid>
          <Grid item xs={2} container alignContent={"center"}>
            <StatsDivider
              stat=""
              userStat={userBoxScore.wins}
              opposingStat={opponentBoxScore.wins}
            />
          </Grid>
          <Grid item xs textAlign={"center"}>
            {userBoxScore.wins}
          </Grid>
          <Grid item xs={2} container alignContent={"center"}></Grid>
          <Grid item xs></Grid>
        </Grid>
        <Grid container className="mb-2">
          <Grid item xs></Grid>
          <Grid item xs={2} container alignContent={"center"}></Grid>
          <Grid item xs textAlign={"center"}>
            {roundToHundredth(userAverageWins)}
          </Grid>
          <Grid item xs={2} container alignContent={"center"}>
            <StatsDivider
              stat=""
              userStat={userAverageWins}
              opposingStat={userAverageLosses}
            />
          </Grid>
          <Grid item xs textAlign="center">
            {roundToHundredth(userAverageLosses)}
          </Grid>
        </Grid>
        <Box
          textAlign="center"
          color={
            matchupWinsMinusAverageWins > 0
              ? "green"
              : matchupWinsMinusAverageWins < 0
              ? "red"
              : "black"
          }
          paddingBottom={3}
        >
          {(matchupWinsMinusAverageWins > 0 ? "+" : "").concat(
            roundToHundredth(matchupWinsMinusAverageWins)
          )}
        </Box>
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

export default function MatchupAnalyzer({teamId}: {teamId: number}) {
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
    <Box display="flex" justifyContent="center" alignItems="center">
      <Container sx={{ overflow: "scroll" }}>
        <Stack direction="row" spacing={3}>
          {boxScores.reverse().map((boxScore) => (
            <BoxScoreCard
              key={boxScore.matchupPeriod}
              matchupBoxScores={boxScore}
              teamId={teamId}
            ></BoxScoreCard>
          ))}
        </Stack>
      </Container>
    </Box>
  );
}
