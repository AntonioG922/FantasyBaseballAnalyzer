import json

from os.path import join
import pickle
import jsonpickle
from espn_api.baseball import League
from flask import Flask
from python.timed_lru_cache import timed_lru_cache
from functools import reduce

# from unidecode import unidecode

CURRENT_YEAR = 2023
USELESS_POSITIONS = ["2B/SS", "1B/3B", "IF", "OF", "UTIL", "BE", "IL", "P"]
MY_LEAGUE_ID = 167157
BOX_SCORE_TEAM_MASK = ['logo_url', 'team_abbrev', 'team_id', 'team_name']

app = Flask(__name__)


@app.route("/api/getPlayerData")
def getPlayerData():
    fangraphsStats = []
    with open(join("pybaseballdata", "playerdata.pkl"), "rb") as file:
        fangraphsStats = pickle.load(file)

    fantasyStats = getFantasyStats(fetchEspnLeagueInfo(MY_LEAGUE_ID))

    playerData = combineFantasyAndFangraphsStats(fantasyStats, fangraphsStats)

    return json.dumps(playerData).replace("NaN", "null")


@app.route("/api/getEspnLeagueInfo")
def getEspnLeagueInfo():
    return jsonpickle.dumps(fetchEspnLeagueInfo(MY_LEAGUE_ID))


@app.route("/api/getEspnBoxScores")
def getEspnBoxScores():
    league = fetchEspnLeagueInfo(MY_LEAGUE_ID)
    return jsonpickle.encode(getBoxScoresForLeague(league), unpicklable=False)


@timed_lru_cache(seconds=60*60*4)
def fetchEspnLeagueInfo(leagueId):
    return League(league_id=leagueId, year=CURRENT_YEAR)


@timed_lru_cache(seconds=60*60*4)
def getBoxScoresForLeague(league):
    boxScores = []
    for matchupPeriod in range(1, league.currentMatchupPeriod + 1):
        boxScoresForMatchup = league.box_scores(matchupPeriod)
        averageStatsPerMatchup = []
        for matchup in boxScoresForMatchup:
            matchup.home_team = {key: getattr(matchup.home_team, key) for key in BOX_SCORE_TEAM_MASK}
            matchup.away_team = {key: getattr(matchup.away_team, key) for key in BOX_SCORE_TEAM_MASK}
            averageStatsPerMatchup.append({x: (matchup.home_stats.get(x)['value'] + matchup.away_stats.get(x)['value'])/(2*len(boxScoresForMatchup)) for x in set(matchup.home_stats)})
        # Add average stats here
        averageStats = reduce(lambda bs1, bs2: {x: bs1.get(x) + bs2.get(x) for x in set(bs1)}, averageStatsPerMatchup)
        boxScores.append({'matchupPeriod': matchupPeriod, 'boxScores': boxScoresForMatchup, 'averageStats': averageStats})

    return boxScores


def getFantasyStats(league):
    fantasyStats = getFantasyStatsForTeam(league.free_agents(), "Free Agent")
    for team in league.teams:
        fantasyStats += getFantasyStatsForTeam(team.roster, team.team_name)
    return fantasyStats


def getFantasyStatsForTeam(roster, teamName):
    fantasyStats = []
    for idx, player in enumerate(roster):
        fantasyStats.append(
            {
                "id": idx,
                "Name": player.name,
                "Team": teamName,
                "Lineup Slot": player.lineupSlot,
                "Eligible Positions": list(
                    filter(
                        lambda slot: slot not in USELESS_POSITIONS,
                        player.eligibleSlots,
                    )
                ),
            }
        )
    return fantasyStats


def combineFantasyAndFangraphsStats(fantasyStats, fangraphsStats):
    for player in fantasyStats:
        fangraphsPlayerStats = next(
            (p for p in fangraphsStats if p["Name"] == player["Name"]), None
        )
        if fangraphsPlayerStats is not None:
            player.update(fangraphsPlayerStats)

    return fantasyStats
