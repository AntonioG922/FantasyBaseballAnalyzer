import json

from os.path import join
import pickle
import jsonpickle
from espn_api.baseball import League
from flask import Flask

# from unidecode import unidecode

from constants import (
    USELESS_POSITIONS,
)

app = Flask(__name__)


@app.route("/api/getPlayerData")
def getPlayerData():
    fangraphsStats = []
    with open(join("pybaseballdata", "playerdata.pkl"), "rb") as file:
        fangraphsStats = pickle.load(file)

    league = League(league_id=167157, year=2023)
    fantasyStats = getFantasyStats(league)

    playerData = combineFantasyAndFangraphsStats(fantasyStats, fangraphsStats)

    return json.dumps(playerData).replace("NaN", "null")


@app.route("/api/getLeagueInfo")
def getLeagueInfo():
    league = League(league_id=167157, year=2023)
    return jsonpickle.dumps(league)


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


def addTeamName(players, teamName):
    for player in players:
        player["Team"] = teamName
    return players


def combineFantasyAndFangraphsStats(fantasyStats, fangraphsStats):
    for player in fantasyStats:
        fangraphsPlayerStats = next(
            (p for p in fangraphsStats if p["Name"] == player["Name"]), None
        )
        if fangraphsPlayerStats is not None:
            player.update(fangraphsPlayerStats)

    return fantasyStats
