import json

from os.path import join
import pickle
import jsonpickle
from espn_api.baseball import League
from flask import Flask
from ../python/timed_lru_cache import timed_lru_cache

# from unidecode import unidecode

CURRENT_YEAR = 2023
USELESS_POSITIONS = ["2B/SS", "1B/3B", "IF", "OF", "UTIL", "BE", "IL", "P"]
MY_LEAGUE_ID = 167157

app = Flask(__name__)


@app.route("/api/getPlayerData")
def getPlayerData():
    fangraphsStats = []
    with open(join("pybaseballdata", "playerdata.pkl"), "rb") as file:
        fangraphsStats = pickle.load(file)

    fantasyStats = getFantasyStats(fetchEspnLeagueInfo(league_id=MY_LEAGUE_ID))

    playerData = combineFantasyAndFangraphsStats(fantasyStats, fangraphsStats)

    return json.dumps(playerData).replace("NaN", "null")


@app.route("/api/getEspnLeagueInfo")
def getEspnLeagueInfo():
    return jsonpickle.dumps(fetchEspnLeagueInfo=MY_LEAGUE_ID)

@timed_lru_cache(seconds=60*60*4)
def fetchEspnLeagueInfo(leagueId):
    return League(league_id=leagueId, year=CURRENT_YEAR)

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
