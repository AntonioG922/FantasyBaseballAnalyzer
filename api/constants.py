CURRENT_YEAR = 2023
USELESS_POSITIONS = ["2B/SS", "1B/3B", "IF", "OF", "UTIL", "BE", "IL", "P"]
FANGRAPHS_BATTING_FIELDS = [
    "Name",
    # Counting Stats
    "PA",
    "H",
    "R",
    "HR",
    "RBI",
    "SB",
    # Ratios
    "AVG",
    "xBA",
    "OBP",
    "SLG",
    "xSLG",
    "wOBA",
    "xwOBA",
    "wRC+",
    # Statcast
    "EV",
    "maxEV",
    "LA",
    "Barrels",
    "Barrel%",
    "HardHit",
    "HardHit%",
    # Plate Discipline
    "BB%",
    "K%",
    "O-Swing%",
    "Z-Swing%",
    "Swing%",
    "O-Contact%",
    "Z-Contact%",
    "Contact%",
    "Zone%",
    "F-Strike%",
    "SwStr%",
    "CStr%",
    "CSW%",
    # Batted Ball
    "BABIP",
    "LD%",
    "GB%",
    "FB%",
    "IFFB%",
    "HR/FB",
    "Pull%",
    "Cent%",
    "Oppo%",
]

FANGRAPHS_PITCHING_FIELDS = [
    "Name",
    # Counting Stats
    "W",
    "L",
    "SV",
    "G",
    "IP",
    # Ratios
    "ERA",
    "WHIP",
    "xERA",
    "FIP",
    "xFIP",
    "K/9",
    "BB/9",
    # Statcast
    "EV",
    "maxEV",
    "LA",
    "Barrels",
    "Barrel%",
    "HardHit",
    "HardHit%",
    # Plate Discipline
    "K%",
    "BB%",
    "K-BB%",
    "O-Swing%",
    "Z-Swing%",
    "Swing%",
    "O-Contact%",
    "Z-Contact%",
    "Contact%",
    "Zone%",
    "F-Strike%",
    "SwStr%",
    "CStr%",
    "CSW%",
    # Batted Ball
    "BABIP",
    "LOB%",
    "LD%",
    "GB%",
    "FB%",
    "IFFB%",
    "HR/FB",
]

def lineupSlotOrder(lineupSlot):
    match lineupSlot:
        case "C":
            return 1
        case "1B":
            return 2
        case "2B":
            return 3
        case "3B":
            return 4
        case "SS":
            return 5
        case "2B/SS":
            return 6
        case "1B/3B":
            return 7
        case "LF":
            return 8
        case "CF":
            return 9
        case "RF":
            return 10
        case "OF":
            return 11
        case "UTIL":
            return 12
        case "P":
            return 13
        case "SP":
            return 14
        case "RP":
            return 15
        case "BE":
            return 16
        case "IL":
            return 17
        case _:
            return 18