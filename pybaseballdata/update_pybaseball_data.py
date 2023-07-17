import pickle
import pandas as pd
from pybaseball import batting_stats, pitching_stats

from constants import CURRENT_YEAR, FANGRAPHS_BATTING_FIELDS, FANGRAPHS_PITCHING_FIELDS


def getPlayerData():
    batterStats = getBatterStats()
    pitcherStats = getPitcherStats()

    playerData = combineFantasyAndStatsData(batterStats, pitcherStats)

    return pickle.dump(playerData.to_dict("records"), open("playerdata.pkl", "wb"))


def getBatterStats():
    return batting_stats(CURRENT_YEAR, qual=20)[FANGRAPHS_BATTING_FIELDS]


def getPitcherStats():
    return pitching_stats(CURRENT_YEAR, qual=20)[FANGRAPHS_PITCHING_FIELDS]


def combineFantasyAndStatsData(batterStats, pitcherStats):
    data = pd.concat([batterStats, pitcherStats], ignore_index=True)
    data["id"] = data.index
    return data


if __name__ == "__main__":
    getPlayerData()
