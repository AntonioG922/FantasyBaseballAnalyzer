import { GridValueFormatterParams } from "@mui/x-data-grid";

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
  return value.toFixed(3);
}

export function asPercent(value: number) {
  if (value == null) {
    return "";
  }
  return `${(value * 100).toFixed(1)}%`;
}
