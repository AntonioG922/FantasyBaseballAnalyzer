import json
from timedlrucache import timed_lru_cache

import jsonpickle
import pandas as pd
from espn_api.baseball import League
from flask import Flask
from pybaseball import batting_stats, pitching_stats
from unidecode import unidecode

from constants import (CURRENT_YEAR, FANGRAPHS_BATTING_FIELDS,
                       FANGRAPHS_PITCHING_FIELDS, USELESS_POSITIONS,
                       lineupSlotOrder)

app = Flask(__name__)

@app.route('/api')
def home():
    return 'Hello, World!'

@app.route('/api/getPlayerData')
def getPlayerData():
    batterStats = getBatterStats()
    pitcherStats = getPitcherStats()

    league = League(league_id=167157, year=2023)

    playerData = combineFantasyAndStatsData(
        league, batterStats, pitcherStats
    )

    return json.dumps(playerData.to_dict("records")).replace("NaN", "null")

@app.route('/api/getLeagueInfo')
def getLeagueInfo():
    league = League(league_id=167157, year=2023)
    return jsonpickle.dumps(league)

@timed_lru_cache(seconds=(60 * 60 * 6))
def getBatterStats():
    return batting_stats(CURRENT_YEAR, qual=20)[FANGRAPHS_BATTING_FIELDS]

@timed_lru_cache(seconds=(60 * 60 * 6))
def getPitcherStats():
    return pitching_stats(CURRENT_YEAR, qual=20)[FANGRAPHS_PITCHING_FIELDS]


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


def filterPlayersByPosition(players, position):
    return list(filter(lambda player: position in player.eligibleSlots, players))


def combineFantasyAndStatsData(league, batterStats, pitcherStats):
    batterData = getStatsForFantasyTeam(
        "Free Agent", filterPlayersByPosition(league.free_agents(), "UTIL"), batterStats
    )
    pitcherData = getStatsForFantasyTeam(
        "Free Agent", filterPlayersByPosition(league.free_agents(), "P"), pitcherStats
    )
    for team in league.teams:
        batterData = pd.concat(
            [
                batterData,
                getStatsForFantasyTeam(
                    team.team_name,
                    filterPlayersByPosition(team.roster, "UTIL"),
                    batterStats,
                ),
            ],
            ignore_index=True
        )
        pitcherData = pd.concat(
            [
                pitcherData,
                getStatsForFantasyTeam(
                    team.team_name,
                    filterPlayersByPosition(team.roster, "P"),
                    pitcherStats,
                ),
            ],
            ignore_index=True
        )
    data = pd.concat([batterData, pitcherData], ignore_index=True)
    data['id'] = data.index
    return data
