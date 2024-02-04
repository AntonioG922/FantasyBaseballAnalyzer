import json

from os.path import join
import pickle
import jsonpickle
from espn_api.baseball import League
from flask import Flask
from _timed_lru_cache import timed_lru_cache
from functools import reduce
import time

# from unidecode import unidecode

CURRENT_YEAR = 2023
# 18, 21, 22 have appeared but unknown what position they correspond to
USELESS_POSITIONS = ["2B/SS", "1B/3B", "IF", "OF", "UTIL", "BE", "IL", "P", 18, 21, 22]
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
    return jsonpickle.encode(fetchEspnLeagueInfo(MY_LEAGUE_ID), unpicklable=False)


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
    times = []
    for matchupPeriod in range(1, league.currentMatchupPeriod + 1):
        start = time.time()
        boxScoresForMatchup = league.box_scores(matchupPeriod)
        end = time.time()
        times.append(end-start)
        print(f'Period {matchupPeriod} ' + str(end - start))
        numberOfTeams = 2*len(boxScoresForMatchup)
        averageStatsPerMatchup = []
        for matchup in boxScoresForMatchup:
            matchup.home_team = {key: getattr(matchup.home_team, key) for key in BOX_SCORE_TEAM_MASK}
            matchup.away_team = {key: getattr(matchup.away_team, key) for key in BOX_SCORE_TEAM_MASK}
            average = {}
            for x in set(matchup.home_stats):
                homeStat = parseStat(matchup.home_stats.get(x)['value'])
                awayStat = parseStat(matchup.away_stats.get(x)['value'])
                average[x] = (homeStat + awayStat)/numberOfTeams
            averageStatsPerMatchup.append(average)
        # Add average stats here
        averageStats = reduce(lambda bs1, bs2: {x: bs1.get(x) + bs2.get(x) for x in set(bs1)}, averageStatsPerMatchup)
        boxScores.append({'matchupPeriod': matchupPeriod, 'boxScores': boxScoresForMatchup, 'averageStats': averageStats})

    print(f'Total Time: {reduce(lambda t1, t2: t1+t2, times)}')
    return boxScores

def parseStat(stat):
    if stat == 'Infinity':
        return 99.99
    
    return stat


def getFantasyStats(league):
    fantasyStats = getFantasyStatsForTeam(league.free_agents(), -1)
    for team in league.teams:
        fantasyStats += getFantasyStatsForTeam(team.roster, team.team_id)
    return fantasyStats


def getFantasyStatsForTeam(roster, teamId):
    fantasyStats = []
    for idx, player in enumerate(roster):
        fantasyStats.append(
            {
                "id": idx,
                "Name": player.name,
                "Team": teamId,
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
