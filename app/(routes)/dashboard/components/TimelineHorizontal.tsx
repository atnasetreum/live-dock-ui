import { useEffect, useState, useMemo } from "react";

import { Box, Chip, Stack, Typography } from "@mui/material";

import { useThemeConfig } from "@/theme/ThemeProvider";
import { ReceptionProcess } from "@/types";
import { formatTime } from "@/utils";

interface Props {
  receptionProcess: ReceptionProcess;
}
const TimelineHorizontal = ({ receptionProcess }: Props) => {
  const { theme } = useThemeConfig();
  const events = useMemo(
    () => receptionProcess.events ?? [],
    [receptionProcess.events],
  );
  const isProcessFinalized =
    receptionProcess.status === "FINALIZADO" ||
    receptionProcess.status === "RECHAZADO";
  const [elapsedTime, setElapsedTime] = useState<string>("--");

  const laneTitleColors = [
    theme.palette.primary?.main,
    theme.palette.success?.main,
    theme.palette.warning?.main,
    theme.palette.info?.main,
    theme.palette.secondary?.main,
  ].filter(Boolean) as string[];

  const sortedEvents = [...events].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
  const latestEventId = sortedEvents[0]?.id;

  const roleOrder = events.reduce<string[]>((acc, eventItem) => {
    if (!acc.includes(eventItem.role)) {
      acc.push(eventItem.role);
    }
    return acc;
  }, []);

  const lanes = roleOrder.map((role) => ({
    role,
    events: sortedEvents.filter((eventItem) => eventItem.role === role),
  }));

  useEffect(() => {
    const calculateElapsedTime = () => {
      if (!events.length) {
        setElapsedTime("--");
        return;
      }

      const times = events
        .map((eventItem) => new Date(eventItem.createdAt).getTime())
        .filter((time) => Number.isFinite(time));

      if (!times.length) {
        setElapsedTime("--");
        return;
      }

      const firstEventTime = Math.min(...times);
      const lastEventTime = isProcessFinalized
        ? Math.max(...times)
        : Date.now();
      const diffMs = Math.max(0, lastEventTime - firstEventTime);

      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

      setElapsedTime(`${hours}h ${minutes}m ${seconds}s`);
    };

    calculateElapsedTime();
    const interval = setInterval(calculateElapsedTime, 1000);

    return () => clearInterval(interval);
  }, [events, isProcessFinalized]);

  return (
    <Box
      sx={{
        padding: { xs: 1.5, md: 2 },
        borderRadius: 2,
        backgroundColor: theme.surfaces.panel,
        border: `1px solid ${theme.surfaces.border}`,
        overflow: "hidden",
        //Movimiento
        "@keyframes timelinePulse": {
          "0%": {
            transform: "scale(1)",
            opacity: 1,
          },
          "50%": {
            transform: "scale(1.02)",
            opacity: 0.85,
          },
          "100%": {
            transform: "scale(1)",
            opacity: 1,
          },
        },
        //Movimiento
      }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography
          variant="subtitle2"
          sx={{ color: theme.palette.textPrimary }}
        >
          Eventos
        </Typography>
        <Stack alignItems="center" spacing={0} sx={{ minWidth: 90 }}>
          <Typography
            variant="caption"
            sx={{
              color: theme.palette.textSecondary,
              textTransform: "uppercase",
            }}
          >
            Tiempo transcurrido
          </Typography>
          <Typography
            variant="caption"
            sx={{ color: theme.palette.textPrimary, fontWeight: 600 }}
            aria-live="polite"
          >
            {elapsedTime}
          </Typography>
        </Stack>
        <Chip
          label={`${events.length} eventos`}
          size="small"
          sx={{
            backgroundColor: theme.surfaces.translucent,
            color: theme.palette.textSecondary,
          }}
        />
      </Stack>

      <Box
        sx={{
          mt: 2,
          overflowX: "hidden",
        }}
      >
        <Stack
          direction="row"
          spacing={2}
          sx={{
            width: "100%",
          }}
        >
          {lanes.map((lane, laneIndex) => (
            <Box
              key={lane.role}
              sx={{
                minWidth: 0,
                flex: "1 1 0",
                borderRadius: 2,
                border: `1px solid ${theme.surfaces.border}`,
                backgroundColor: theme.surfaces.translucent,
                overflow: "hidden",
              }}
            >
              <Box
                sx={{
                  px: 1.5,
                  py: 1,
                  backgroundColor:
                    laneTitleColors[laneIndex % laneTitleColors.length] ||
                    theme.surfaces.panel,
                  borderBottom: `1px dashed ${theme.surfaces.border}`,
                  textTransform: "uppercase",
                  letterSpacing: 0.6,
                  fontWeight: 700,
                  fontSize: "1rem",
                  color: theme.buttons.containedText,
                  textAlign: "center",
                }}
              >
                {lane.role.replace(/_/g, " ")}
              </Box>

              <Stack spacing={2} sx={{ p: 1.5 }}>
                {lane.events.map((eventItem, index) => {
                  const isLatestEvent = eventItem.id === latestEventId;
                  const isPastEvent = !isLatestEvent;
                  const isLastInLane = index === lane.events.length - 1;

                  return (
                    <Stack
                      key={eventItem.id}
                      direction="row"
                      spacing={1.5}
                      alignItems="flex-start"
                    >
                      <Stack alignItems="center" spacing={0.5}>
                        <Box
                          sx={{
                            width: 12,
                            height: 12,
                            borderRadius: "50%",
                            backgroundColor: isLatestEvent
                              ? theme.palette.primary?.main
                              : theme.palette.success?.main,
                            boxShadow: isLatestEvent
                              ? theme.overlays.cardShadow
                              : "none",
                            animation: isLatestEvent
                              ? "timelinePulse 1.1s ease-in-out infinite"
                              : "none",
                            "@media (prefers-reduced-motion: reduce)": {
                              animation: "none",
                            },
                          }}
                        />
                        {!isLastInLane && (
                          <Box
                            sx={{
                              width: 2,
                              minHeight: 30,
                              backgroundColor: theme.surfaces.border,
                            }}
                          />
                        )}
                      </Stack>

                      <Box
                        sx={{
                          flex: 1,
                          padding: 1.25,
                          borderRadius: 1.5,
                          backgroundColor: isLatestEvent
                            ? theme.chips.realTime
                            : theme.surfaces.panel,
                          border: isLatestEvent
                            ? `1px solid ${theme.palette.primary?.main}`
                            : `1px solid ${theme.surfaces.border}`,
                          boxShadow: isLatestEvent
                            ? theme.overlays.cardShadow
                            : "none",
                          animation: isLatestEvent
                            ? "timelinePulse 1.1s ease-in-out infinite"
                            : "none",
                          "@media (prefers-reduced-motion: reduce)": {
                            animation: "none",
                          },
                          transformOrigin: "center",
                        }}
                      >
                        <Stack spacing={1}>
                          <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                            justifyContent="space-between"
                          >
                            <Typography
                              variant="caption"
                              sx={{
                                color: theme.palette.textSecondary,
                                textTransform: "uppercase",
                                letterSpacing: 0.5,
                                fontSize: "0.9rem",
                              }}
                            >
                              {formatTime(eventItem.createdAt)}
                            </Typography>
                            {isLatestEvent && (
                              <Chip
                                label="Actual"
                                size="small"
                                sx={{
                                  backgroundColor: theme.palette.primary?.main,
                                  color: theme.buttons.containedText,
                                  fontWeight: 600,
                                }}
                              />
                            )}
                            {isPastEvent && (
                              <Box
                                sx={{
                                  display: "inline-flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  width: 16,
                                  height: 16,
                                  borderRadius: "50%",
                                  border: `1px solid ${theme.palette.success?.main}`,
                                  backgroundColor: theme.chips.low,
                                  color: theme.palette.success?.main,
                                }}
                                aria-label="Evento realizado"
                              >
                                <Box
                                  component="svg"
                                  viewBox="0 0 24 24"
                                  sx={{ width: 10, height: 10 }}
                                >
                                  <Box
                                    component="polyline"
                                    points="20 6 9 17 4 12"
                                    sx={{
                                      fill: "none",
                                      stroke: "currentColor",
                                      strokeWidth: 2,
                                      strokeLinecap: "round",
                                      strokeLinejoin: "round",
                                    }}
                                  />
                                </Box>
                              </Box>
                            )}
                          </Stack>

                          <Typography
                            variant="body1"
                            sx={{
                              fontWeight: 600,
                              color: theme.palette.textPrimary,
                              lineHeight: 1.4,
                            }}
                          >
                            {eventItem.status?.replace(/_/g, " ")}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{ color: theme.palette.textSecondary }}
                          >
                            {eventItem.event.replace(/_/g, " ")}
                          </Typography>
                        </Stack>
                      </Box>
                    </Stack>
                  );
                })}
              </Stack>
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  );
};

export default TimelineHorizontal;
