export function roundToTenth(value: number) {
    if (value == null) {
      return "";
    }
    return value.toFixed(1);
  }

export function roundToHundredth(value: number) {
  if (value == null) {
    return "";
  }
  return value.toFixed(2);
}

export function roundToThousandth(value: number) {
  if (value == null) {
    return "";
  }
  // All stats that get rounded to thousandth are typically between
  // [0, 1] so we can usually cut off the leading 0.
  return value.toFixed(3).substring(value >= 1 ? 0 : 1);
}

export function asPercent(value: number) {
  if (value == null) {
    return "";
  }
  return `${(value * 100).toFixed(1)}%`;
}
