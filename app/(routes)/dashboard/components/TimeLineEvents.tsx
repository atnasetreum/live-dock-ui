"use client";

import { useEffect, useState } from "react";

import { Box, Chip, Stack, Typography } from "@mui/material";
import {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineOppositeContent,
  TimelineSeparator,
} from "@mui/lab";

import { ProcessEventRole, ReceptionProcess } from "@/types";
import { useThemeConfig } from "@/theme/ThemeProvider";
import { formatTime } from "@/utils";

interface ProcessEvent {
  id: number;
  event: string;
  createdAt: string;
}

const ElapsedTimeDisplay = ({
  events,
  isProcessFinalized,
}: {
  events: ProcessEvent[];
  isProcessFinalized: boolean;
}) => {
  const [elapsedTime, setElapsedTime] = useState<string>("");

  useEffect(() => {
    const calculateElapsedTime = () => {
      if (!events || events.length === 0) return;

      const firstEventTime = new Date(events[0].createdAt).getTime();
      const lastEventTime = isProcessFinalized
        ? new Date(events[events.length - 1].createdAt).getTime()
        : new Date().getTime();
      const diffMs = lastEventTime - firstEventTime;

      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

      setElapsedTime(`${hours}h ${minutes}m ${seconds}s`);
    };

    calculateElapsedTime();
    const interval = setInterval(calculateElapsedTime, 1000);

    return () => clearInterval(interval);
  }, [events, isProcessFinalized]);

  return <Typography variant="caption"> {elapsedTime}</Typography>;
};

interface Props {
  receptionProcess: ReceptionProcess;
  currentStatus: string;
}

const TimeLineEvents = ({
  receptionProcess: { events },
  currentStatus,
}: Props) => {
  const { theme } = useThemeConfig();
  const sortedEvents = [...(events ?? [])].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  return (
    <Box
      sx={{
        padding: 1.5,
        borderRadius: 2,
        backgroundColor: theme.surfaces.panel,
        border: `1px solid ${theme.surfaces.border}`,
      }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography
          variant="subtitle2"
          sx={{ color: theme.palette.textPrimary }}
        >
          Eventos
        </Typography>
        <Typography
          variant="subtitle2"
          sx={{ color: theme.palette.textPrimary }}
        >
          Transcurrido
          {events && events.length > 0 && (
            <ElapsedTimeDisplay
              events={events}
              isProcessFinalized={currentStatus.includes("FINALIZO")}
            />
          )}
        </Typography>
        <Chip
          label={`${events?.length ?? 0} eventos`}
          size="small"
          sx={{
            backgroundColor: theme.surfaces.translucent,
            color: theme.palette.textSecondary,
          }}
        />
      </Stack>
      {sortedEvents.length ? (
        <Timeline
          sx={{
            mt: 1.5,
            mb: 0,
            px: 0,
            [`& .MuiTimelineItem-root:before`]: {
              flex: 0,
              padding: 0,
            },
          }}
        >
          {sortedEvents.map((eventItem, index) => {
            const isLatestEvent = index === 0;
            const isPastEvent = !isLatestEvent;
            const prevEvent = index > 0 ? sortedEvents[index - 1] : undefined;
            const timeSincePrevious = prevEvent
              ? (() => {
                  const prevTime = new Date(prevEvent.createdAt).getTime();
                  const currTime = new Date(eventItem.createdAt).getTime();
                  const diffMs = Math.abs(currTime - prevTime);
                  const hours = Math.floor(diffMs / (1000 * 60 * 60));
                  const minutes = Math.floor(
                    (diffMs % (1000 * 60 * 60)) / (1000 * 60),
                  );
                  const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);
                  return `${hours}h ${minutes}m ${seconds}s desde anterior`;
                })()
              : "Evento actual";

            return (
              <TimelineItem key={eventItem.id}>
                <TimelineOppositeContent
                  sx={{
                    display: { xs: "none", sm: "block" },
                    flex: 0.35,
                    px: 1,
                    color: theme.palette.textSecondary,
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{
                      textTransform: "uppercase",
                      letterSpacing: 0.5,
                      fontSize: "0.7rem",
                    }}
                  >
                    Fecha
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: theme.palette.textPrimary,
                      mt: 0.25,
                      fontWeight: 500,
                    }}
                  >
                    {formatTime(eventItem.createdAt)}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      mt: 0.5,
                      display: "block",
                    }}
                  >
                    {timeSincePrevious}
                  </Typography>
                </TimelineOppositeContent>
                <TimelineSeparator>
                  <TimelineDot
                    sx={{
                      backgroundColor: isLatestEvent
                        ? theme.palette.primary?.main
                        : theme.surfaces.translucent,
                      boxShadow: isLatestEvent
                        ? theme.overlays.cardShadow
                        : "none",
                      border: isLatestEvent
                        ? `2px solid ${theme.palette.primary?.main}`
                        : `1px solid ${theme.surfaces.border}`,
                      width: isLatestEvent ? 16 : 12,
                      height: isLatestEvent ? 16 : 12,
                    }}
                  />
                  {index < sortedEvents.length - 1 && (
                    <TimelineConnector
                      sx={{
                        backgroundColor: isLatestEvent
                          ? theme.palette.primary?.main
                          : theme.surfaces.border,
                      }}
                    />
                  )}
                </TimelineSeparator>
                <TimelineContent sx={{ px: 1, pb: 2 }}>
                  <Box
                    sx={{
                      padding: { xs: 1.5, sm: 2 },
                      borderRadius: 1.5,
                      backgroundColor: isLatestEvent
                        ? theme.chips.realTime
                        : theme.surfaces.translucent,
                      border: isLatestEvent
                        ? `1px solid ${theme.palette.primary?.main}`
                        : `1px solid ${theme.surfaces.border}`,
                      boxShadow: isLatestEvent
                        ? theme.overlays.cardShadow
                        : "none",
                    }}
                  >
                    <Stack spacing={1.25}>
                      {isLatestEvent && (
                        <Box>
                          <Chip
                            label="Actual"
                            size="small"
                            sx={{
                              backgroundColor: theme.palette.primary?.main,
                              color: theme.buttons.containedText,
                              fontWeight: 600,
                            }}
                          />
                        </Box>
                      )}
                      <Box>
                        <Typography
                          variant="caption"
                          sx={{
                            color: theme.palette.textSecondary,
                            textTransform: "uppercase",
                            letterSpacing: 0.5,
                            fontSize: "0.7rem",
                          }}
                        >
                          Evento
                        </Typography>{" "}
                        {isPastEvent && (
                          <Box
                            sx={{
                              display: "inline-flex",
                              alignItems: "center",
                              justifyContent: "center",
                              width: 20,
                              height: 20,
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
                              sx={{ width: 12, height: 12 }}
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
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 600,
                            color: theme.palette.textPrimary,
                            mt: 0.25,
                            lineHeight: 1.4,
                          }}
                        >
                          {eventItem.event.replace(/_/g, " ")}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography
                          variant="caption"
                          sx={{
                            color: theme.palette.textSecondary,
                            textTransform: "uppercase",
                            letterSpacing: 0.5,
                            fontSize: "0.7rem",
                          }}
                        >
                          Estatus
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 500,
                            color: theme.palette.textPrimary,
                            mt: 0.25,
                          }}
                        >
                          {eventItem.status?.replace(/_/g, " ")}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography
                          variant="caption"
                          sx={{
                            color: theme.palette.textSecondary,
                            textTransform: "uppercase",
                            letterSpacing: 0.5,
                            fontSize: "0.7rem",
                          }}
                        >
                          Responsable
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: theme.palette.textPrimary,
                            mt: 0.25,
                            fontWeight: 500,
                          }}
                        >
                          {eventItem.role !== ProcessEventRole.SISTEMA &&
                            eventItem.createdBy.name}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            color: theme.palette.textSecondary,
                            mt: 0.5,
                            display: "block",
                          }}
                        >
                          {eventItem.role}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          display: {
                            xs: "block",
                            sm: "none",
                          },
                        }}
                      >
                        <Typography
                          variant="caption"
                          sx={{
                            color: theme.palette.textSecondary,
                            textTransform: "uppercase",
                            letterSpacing: 0.5,
                            fontSize: "0.7rem",
                          }}
                        >
                          Fecha
                        </Typography>

                        <Typography
                          variant="body2"
                          sx={{
                            color: theme.palette.textPrimary,
                            mt: 0.25,
                            fontWeight: 500,
                          }}
                        >
                          {formatTime(eventItem.createdAt)}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            color: theme.palette.textSecondary,
                            mt: 0.5,
                            display: "block",
                          }}
                        >
                          {timeSincePrevious}
                        </Typography>
                      </Box>
                    </Stack>
                  </Box>
                </TimelineContent>
              </TimelineItem>
            );
          })}
        </Timeline>
      ) : (
        <Typography
          variant="body2"
          sx={{ color: theme.palette.textSecondary, mt: 1.5 }}
        >
          Sin eventos registrados.
        </Typography>
      )}
    </Box>
  );
};

export default TimeLineEvents;
