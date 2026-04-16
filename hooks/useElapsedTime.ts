import { useEffect, useMemo, useState } from "react";

type TimeInput = string | number | Date | null | undefined;

const toTimestamp = (value: TimeInput): number | undefined => {
  if (value === null || value === undefined) {
    return undefined;
  }

  const timestamp =
    value instanceof Date ? value.getTime() : new Date(value).getTime();

  return Number.isFinite(timestamp) ? timestamp : undefined;
};

export const formatElapsedTime = (
  startAt: TimeInput,
  endAt?: TimeInput,
): string => {
  const startTimestamp = toTimestamp(startAt);
  const endTimestamp = toTimestamp(endAt) ?? Date.now();

  if (!startTimestamp || !endTimestamp || endTimestamp < startTimestamp) {
    return "--";
  }

  const diffMs = endTimestamp - startTimestamp;
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

  return `${hours}h ${minutes}m ${seconds}s`;
};

export const useElapsedTime = ({
  startAt,
  endAt,
  isLive = true,
  intervalMs = 1000,
}: {
  startAt: TimeInput;
  endAt?: TimeInput;
  isLive?: boolean;
  intervalMs?: number;
}) => {
  const [nowTimestamp, setNowTimestamp] = useState<number>(() => Date.now());

  useEffect(() => {
    if (!isLive || endAt !== undefined) {
      return undefined;
    }

    const interval = setInterval(() => {
      setNowTimestamp(Date.now());
    }, intervalMs);

    return () => clearInterval(interval);
  }, [isLive, endAt, intervalMs]);

  return useMemo(
    () => formatElapsedTime(startAt, endAt ?? nowTimestamp),
    [startAt, endAt, nowTimestamp],
  );
};
