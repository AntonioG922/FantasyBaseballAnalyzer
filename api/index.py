import json

import jsonpickle
import pandas as pd
from espn_api.baseball import League
from flask import Flask
from unidecode import unidecode

from constants import (
    USELESS_POSITIONS,
    lineupSlotOrder,
)

app = Flask(__name__)

@app.route("/api/getPlayerData")
def getPlayerData():
    fangraphsStats = pd.read_pickle("../pybaseballdata/playerdata.txt")

    league = League(league_id=167157, year=2023)

    playerData = combineFantasyAndStatsData(league, fangraphsStats)

    return json.dumps(playerData.to_dict("records")).replace("NaN", "null")


@app.route("/api/getLeagueInfo")
def getLeagueInfo():
    league = League(league_id=167157, year=2023)
    return jsonpickle.dumps(league)


def getStatsForFantasyTeam(teamName, roster, playerStats):
    return (
        pd.DataFrame(
            {
                "Name": map(lambda player: player.name, roster),
                "Team": teamName,
                "Lineup Slot": map(lambda player: player.lineupSlot, roster),
                "Eligible Positions": map(
                    lambda player: list(
                        filter(
                            lambda slot: slot not in USELESS_POSITIONS,
                            player.eligibleSlots,
                        )
                    ),
                    roster,
                ),
            },
        )
        .merge(playerStats, how="left", on="Name")
        .sort_values(by="Lineup Slot", key=lambda col: col.map(lineupSlotOrder))
    )


def combineFantasyAndStatsData(league, fangraphsStats):
    playerData = getStatsForFantasyTeam(
        "Free Agent", league.free_agents(), fangraphsStats
    )
    for team in league.teams:
        playerData = pd.concat(
            [
                playerData,
                getStatsForFantasyTeam(
                    team.team_name,
                    team.roster,
                    fangraphsStats,
                ),
            ],
            ignore_index=True,
        )
    playerData["id"] = playerData.index
    return playerData
