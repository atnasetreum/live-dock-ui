import { useState } from "react";

import {
  FormControl,
  FormControlLabel,
  Paper,
  Radio,
  RadioGroup,
  Stack,
  useMediaQuery,
} from "@mui/material";

import { useThemeConfig } from "@/theme/ThemeProvider";
import TimelineHorizontal from "./TimelineHorizontal";
import ProcessFlowDesktop from "./ProcessFlowDesktop";
import TimeLineEvents from "./TimeLineEvents";
import { ReceptionProcess } from "@/types";

interface Props {
  receptionProcess: ReceptionProcess;
  currentStatus: string;
}

const ProcessFlow = ({ receptionProcess, currentStatus }: Props) => {
  const isSmallScreen = useMediaQuery("(max-width:900px)");
  const [view, setView] = useState<"timeline" | "horizontal" | "desktop">(
    isSmallScreen ? "timeline" : "horizontal",
  );

  const { theme } = useThemeConfig();

  return (
    <Stack spacing={{ xs: 1.5, md: 2 }}>
      <Stack alignItems="center">
        <Paper
          elevation={0}
          sx={{
            px: { xs: 1, sm: 2 },
            py: 0.5,
            borderRadius: 999,
            border: "1px solid",
            borderColor:
              theme.name === "dark" ? theme.surfaces.border : theme.divider,
            backgroundColor:
              theme.name === "dark" ? theme.surfaces.panel : "#ffffff",
            boxShadow:
              theme.name === "dark"
                ? theme.overlays.cardShadow
                : "0 10px 30px rgba(15, 23, 42, 0.08)",
            color: theme.palette.textPrimary,
            "& .MuiFormControlLabel-label": {
              color: theme.palette.textPrimary,
              fontWeight: 500,
            },
            "& .MuiRadio-root": {
              color: theme.palette.textSecondary,
              "&.Mui-checked": {
                color: theme.palette.primary?.main,
              },
            },
          }}
        >
          <FormControl>
            <RadioGroup
              row={!isSmallScreen}
              value={view}
              onChange={(event) =>
                setView(
                  event.target.value as "timeline" | "horizontal" | "desktop",
                )
              }
            >
              <FormControlLabel
                value="timeline"
                control={<Radio />}
                label="Linea de tiempo"
              />
              <FormControlLabel
                value="horizontal"
                control={<Radio />}
                label="Tablero"
              />
              <FormControlLabel
                value="desktop"
                control={<Radio />}
                label="Flujo"
              />
            </RadioGroup>
          </FormControl>
        </Paper>
      </Stack>

      {view === "timeline" && (
        <TimeLineEvents
          receptionProcess={receptionProcess}
          currentStatus={currentStatus}
        />
      )}

      {view === "horizontal" && (
        <TimelineHorizontal receptionProcess={receptionProcess} />
      )}

      {view === "desktop" && (
        <ProcessFlowDesktop
          receptionProcess={receptionProcess}
          currentStatus={currentStatus}
        />
      )}
    </Stack>
  );
};

export default ProcessFlow;
