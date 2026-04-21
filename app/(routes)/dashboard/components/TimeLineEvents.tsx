"use client";

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
import { formatElapsedTime } from "@/hooks/useElapsedTime";
import { useThemeConfig } from "@/theme/ThemeProvider";
import { formatDateTime } from "@/utils";

interface Props {
  receptionProcess: ReceptionProcess;
  currentStatus: string;
  elapsedTimeLabel?: string;
}

const TimeLineEvents = ({
  receptionProcess: { events },
  currentStatus,
  elapsedTimeLabel,
}: Props) => {
  const { theme } = useThemeConfig();
  const sortedEvents = [...(events ?? [])].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
  const fallbackElapsedTime =
    events && events.length > 0
      ? formatElapsedTime(
          events[0].createdAt,
          currentStatus.includes("FINALIZO")
            ? events[events.length - 1].createdAt
            : undefined,
        )
      : "--";

  const displayElapsedTime = elapsedTimeLabel ?? fallbackElapsedTime;

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
          sx={{
            color: theme.palette.textSecondary,
            textTransform: "uppercase",
          }}
        >
          Tiempo transcurrido
          <Typography component="span" variant="caption" sx={{ ml: 0.75 }}>
            {displayElapsedTime}
          </Typography>
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
              ? `${formatElapsedTime(eventItem.createdAt, prevEvent.createdAt)} desde anterior`
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
                    {formatDateTime(eventItem.createdAt)}
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
                          Ejecutado por ✅
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: theme.palette.textPrimary,
                            mt: 0.25,
                            fontWeight: 500,
                          }}
                        >
                          #{eventItem.createdBy.id}{" "}
                          {eventItem.role !== ProcessEventRole.SISTEMA &&
                            eventItem.createdBy.name}{" "}
                          ({eventItem.role})
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
                          {formatDateTime(eventItem.createdAt)}
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
