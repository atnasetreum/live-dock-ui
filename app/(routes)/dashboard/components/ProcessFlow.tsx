"use client";

import * as React from "react";

import Box from "@mui/material/Box";
import ReactFlow, {
  Background,
  Controls,
  MarkerType,
  Handle,
  Position,
  type Edge,
  type Node,
  type NodeProps,
} from "reactflow";

import { useThemeConfig } from "@/theme/ThemeProvider";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";

import { ReceptionProcess } from "@/types";
import {
  COLUMN_SPACING,
  LANE_LABEL_WIDTH,
  LANE_SPACING,
  laneConfig,
  processSteps,
  processConnections,
  type LaneId,
} from "./processFlowData";

import "reactflow/dist/style.css";

type LaneNodeData = { label: string; accent: string };
type ProcessNodeData = {
  title?: string;
  subtitle?: string;
  accent: string;
  variant: "solid" | "outlined";
  width: number;
};
type CircleNodeData = { circleLabel?: string; accent: string };
type DiamondNodeData = { label?: string; accent: string };

const laneIndex = laneConfig.reduce<Record<LaneId, number>>(
  (acc, lane, idx) => {
    acc[lane.id] = idx;
    return acc;
  },
  {} as Record<LaneId, number>,
);

const laneColorMap = laneConfig.reduce<Record<LaneId, string>>(
  (acc, lane) => {
    acc[lane.id] = lane.accent;
    return acc;
  },
  {} as Record<LaneId, string>,
);

type StepMeta = { laneIndex: number; column: number };

const stepMeta = processSteps.reduce<Record<string, StepMeta>>((acc, step) => {
  acc[step.id] = {
    laneIndex: laneIndex[step.lane],
    column: step.column,
  };
  return acc;
}, {});

const handlePositions = [
  Position.Top,
  Position.Right,
  Position.Bottom,
  Position.Left,
] as const;

const handleTransforms: Record<Position, string> = {
  [Position.Top]: "translate(-50%, -50%)",
  [Position.Right]: "translate(50%, -50%)",
  [Position.Bottom]: "translate(-50%, 50%)",
  [Position.Left]: "translate(-50%, -50%)",
};

const getHandleStyle = (
  position: Position,
  accent: string,
  surface: string,
) => ({
  /* width: 12,
  height: 12, */
  borderRadius: "50%",
  border: `2px solid ${accent}`,
  backgroundColor: surface,
  boxShadow: `0 0 0 2px ${surface}`,
  pointerEvents: "none" as const,
  transform: handleTransforms[position],
});

const NodeHandles = ({
  accent,
  surface,
}: {
  accent: string;
  surface: string;
}) => (
  <>
    {handlePositions.map((position) => (
      <div key={position}>
        <Handle
          id={`source-${position}`}
          type="source"
          position={position}
          isConnectable={false}
          style={getHandleStyle(position, accent, surface)}
        />
        <Handle
          id={`target-${position}`}
          type="target"
          position={position}
          isConnectable={false}
          style={getHandleStyle(position, accent, surface)}
        />
      </div>
    ))}
  </>
);

type HandleSelection = {
  sourceHandle?: string;
  targetHandle?: string;
};

const determineEdgeHandles = (
  source?: StepMeta,
  target?: StepMeta,
): HandleSelection => {
  if (!source || !target) return {};
  if (source.laneIndex === target.laneIndex) {
    if (source.column <= target.column) {
      return { sourceHandle: "source-right", targetHandle: "target-left" };
    }
    return { sourceHandle: "source-left", targetHandle: "target-right" };
  }
  if (source.laneIndex < target.laneIndex) {
    return { sourceHandle: "source-bottom", targetHandle: "target-top" };
  }
  return { sourceHandle: "source-top", targetHandle: "target-bottom" };
};

const buildNodes = (completedStepIds: Set<string>) => {
  const nodes: Node[] = laneConfig.map((lane) => ({
    id: `lane-${lane.id}`,
    type: "lane",
    position: { x: 0, y: laneIndex[lane.id] * LANE_SPACING },
    data: { label: lane.label, accent: lane.accent },
    draggable: false,
    selectable: false,
  }));

  processSteps.forEach((step) => {
    const type =
      step.kind === "circle"
        ? "circle"
        : step.kind === "diamond"
          ? "diamond"
          : "process";
    const accent = laneColorMap[step.lane];

    if (type === "process") {
      nodes.push({
        id: step.id,
        type,
        position: {
          x: LANE_LABEL_WIDTH + step.column * COLUMN_SPACING,
          y: laneIndex[step.lane] * LANE_SPACING,
        },
        data: {
          title: step.title,
          subtitle: step.subtitle,
          accent,
          variant:
            completedStepIds.has(step.id) || step.emphasis === "solid"
              ? "solid"
              : "outlined",
          width: (step.span ?? 1) * COLUMN_SPACING - 36,
        },
        draggable: false,
        selectable: false,
      });
      return;
    }

    if (type === "circle") {
      nodes.push({
        id: step.id,
        type,
        position: {
          x: LANE_LABEL_WIDTH + step.column * COLUMN_SPACING + 100,
          y: laneIndex[step.lane] * LANE_SPACING + 27,
        },
        data: {
          circleLabel: step.circleLabel,
          accent,
        },
        draggable: false,
        selectable: false,
      });
      return;
    }

    nodes.push({
      id: step.id,
      type,
      position: {
        x: LANE_LABEL_WIDTH + step.column * COLUMN_SPACING,
        y: laneIndex[step.lane] * LANE_SPACING,
      },
      data: {
        label: step.title,
        accent,
      },
      draggable: false,
      selectable: false,
    });
  });

  return nodes;
};

const LaneLabelNode = ({ data }: NodeProps<LaneNodeData>) => {
  const { theme } = useThemeConfig();
  return (
    <Box
      sx={{
        minWidth: LANE_LABEL_WIDTH - 12,
        minHeight: 110,
        borderRadius: 3,
        border: `1px solid ${theme.surfaces.border}`,
        borderLeft: `6px solid ${data.accent}`,
        backgroundColor: theme.surfaces.panel,
        color: theme.palette.textPrimary,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        fontWeight: 700,
        px: 1,
        fontSize: 25,
      }}
    >
      {data.label}
    </Box>
  );
};

const ProcessNode = ({ data }: NodeProps<ProcessNodeData>) => {
  const { theme } = useThemeConfig();
  return (
    <Box
      sx={{
        minHeight: 110,
        width: data.width,
        borderRadius: 3,
        border: `2px solid ${data.accent}`,
        backgroundColor: data.variant === "outlined" ? "transparent" : "red", //theme.surfaces.card,
        boxShadow:
          data.variant === "outlined" ? "none" : theme.overlays.cardShadow,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        px: 1.5,
        color: theme.palette.textPrimary,
        position: "relative",
      }}
    >
      <NodeHandles accent={data.accent} surface={theme.surfaces.panel} />
      <Stack spacing={0.5}>
        {data.title && (
          <Typography variant="body1" sx={{ fontWeight: 600, fontSize: 22 }}>
            {data.title}
          </Typography>
        )}
        {data.subtitle && (
          <Typography
            variant="body2"
            sx={{ color: theme.palette.textSecondary, fontSize: 18 }}
          >
            {data.subtitle}
          </Typography>
        )}
      </Stack>
    </Box>
  );
};

const CircleNode = ({ data }: NodeProps<CircleNodeData>) => {
  const { theme } = useThemeConfig();
  return (
    <Box
      sx={{
        width: 56,
        height: 56,
        borderRadius: "50%",
        backgroundColor: data.accent,
        color: "#fff",
        display: "grid",
        placeItems: "center",
        fontWeight: 700,
        letterSpacing: 1,
        boxShadow: "0 10px 20px rgba(15,23,42,0.35)",
        position: "relative",
        fontSize: 24,
      }}
    >
      <NodeHandles accent={data.accent} surface={theme.surfaces.panel} />
      {data.circleLabel ?? ""}
    </Box>
  );
};

const DiamondNode = ({ data }: NodeProps<DiamondNodeData>) => {
  const { theme } = useThemeConfig();
  return (
    <Box
      sx={{
        width: 120,
        height: 120,
        border: `3px solid ${data.accent}`,
        backgroundColor: theme.surfaces.card,
        //clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
        display: "grid",
        placeItems: "center",
        fontWeight: 700,
        textTransform: "uppercase",
        color: theme.palette.textPrimary,
        position: "relative",
        fontSize: 24,
      }}
    >
      <NodeHandles accent={data.accent} surface={theme.surfaces.panel} />
      {data.label}
    </Box>
  );
};

const nodeTypes = {
  lane: LaneLabelNode,
  process: ProcessNode,
  circle: CircleNode,
  diamond: DiamondNode,
};

const decisionMap: Record<string, string[]> = {
  LOGISTICA_PENDIENTE_DE_CONFIRMACION_INGRESO: [
    "supplier-arrive",
    "security-create-progress",
  ],
  LOGISTICA_PENDIENTE_DE_AUTORIZACION: ["logistics-pending-authorization"],
  CALIDAD_PROCESANDO: ["logistics-authorized", "quality-pending-test"],
};

interface Props {
  receptionProcess: ReceptionProcess;
}

const ProcessFlow = ({ receptionProcess: { events } }: Props) => {
  const lastStatus = React.useMemo(() => {
    return events[events.length - 1].status;
  }, [events]);

  const completedStepIds = React.useMemo(
    () => new Set(decisionMap[lastStatus] ?? []),
    [lastStatus],
  );

  const { theme } = useThemeConfig();
  const nodes = React.useMemo<Node[]>(
    () => buildNodes(completedStepIds),
    [completedStepIds],
  );
  const connectionColor = theme.name === "light" ? "#1c5cb6" : "#7fc0ff";

  const edges = React.useMemo<Edge[]>(
    () =>
      processConnections.map((edge) => {
        const handleMap = determineEdgeHandles(
          stepMeta[edge.source],
          stepMeta[edge.target],
        );
        return {
          id: edge.id,
          source: edge.source,
          target: edge.target,
          type: "smoothstep",
          label: edge.label,
          animated: false,
          sourceHandle: edge.sourceHandle ?? handleMap.sourceHandle,
          targetHandle: edge.targetHandle ?? handleMap.targetHandle,
          style: {
            stroke: connectionColor,
            strokeWidth: 2,
            strokeDasharray:
              edge.dashed && !completedStepIds.has(edge.target)
                ? "6 4"
                : undefined,
          },
          labelStyle: {
            fill: connectionColor,
            fontSize: 28,
            fontWeight: 600,
          },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: connectionColor,
            width: 16,
            height: 16,
          },
        };
      }),
    [completedStepIds, connectionColor],
  );

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        height: { xs: 540, md: 620 },
        "& .react-flow__attribution": { display: "none" },
      }}
    >
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          zIndex: 1,
        }}
      >
        {laneConfig.map((lane, idx) => (
          <Box
            key={lane.id}
            sx={{
              position: "absolute",
              left: LANE_LABEL_WIDTH - 20,
              right: 12,
              top: idx * LANE_SPACING + LANE_SPACING / 2,
              borderTop: `1px solid ${theme.surfaces.border}`,
            }}
          />
        ))}
      </Box>

      <Box sx={{ position: "relative", zIndex: 2, height: "100%" }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          fitView
          panOnScroll={false}
          zoomOnScroll={false}
          zoomOnPinch={false}
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable={false}
          proOptions={{ hideAttribution: true }}
          style={{ background: theme.surfaces.panel }}
          fitViewOptions={{ padding: 0.2 }}
        >
          <Background color={theme.surfaces.border} gap={48} size={2} />
          <Controls showInteractive={false} position="bottom-right" />
        </ReactFlow>
      </Box>
    </Box>
  );
};

export default ProcessFlow;
