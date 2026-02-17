export const laneConfig = [
  { id: "supplier", label: "Proveedor", accent: "#BB86FC" },
  { id: "security", label: "Vigilancia", accent: "#1d4ed8" },
  { id: "logistics", label: "Logística", accent: "#f97316" },
  { id: "production", label: "Producción", accent: "#16a34a" },
  { id: "quality", label: "Calidad", accent: "#0ea5e9" },
] as const;

export type LaneId = (typeof laneConfig)[number]["id"];

export type ProcessFlowStep = {
  id: string;
  lane: LaneId;
  column: number;
  span?: number;
  title?: string;
  subtitle?: string;
  kind?: "process" | "circle" | "diamond";
  circleLabel?: string;
  emphasis?: "solid" | "outlined";
};

export const processSteps: ProcessFlowStep[] = [
  {
    id: "supplier-start",
    lane: "supplier",
    column: 0,
    kind: "circle",
    circleLabel: "I",
  },
  {
    id: "supplier-arrive",
    lane: "supplier",
    column: 1,
    title: "Se presenta en caseta",
    //subtitle: "✅",
    emphasis: "solid",
  },
  {
    id: "security-create-progress",
    lane: "security",
    column: 1,
    title: "Registro ingreso",
    emphasis: "outlined",
  },
  {
    id: "logistics-pending-authorization",
    lane: "logistics",
    column: 1,
    title: "Pendiente de autorización",
    emphasis: "outlined",
  },
  {
    id: "logistics-authorized",
    lane: "logistics",
    column: 2,
    title: "Autorizado",
    emphasis: "outlined",
  },
  {
    id: "quality-pending-test",
    lane: "quality",
    column: 2,
    emphasis: "outlined",
    title: "Pendiente de pruebas",
  },

  {
    id: "decision-ok",
    lane: "quality",
    column: 3,
    kind: "diamond",
    title: "Test",
  },
  {
    id: "production-pending-download",
    lane: "production",
    column: 4,
    emphasis: "outlined",
    title: "Material pendiente de descarga",
  },
  {
    id: "production-downloading",
    lane: "production",
    column: 5,
    emphasis: "outlined",
    title: "Descargando material",
  },
  {
    id: "production-downloaded",
    lane: "production",
    column: 6,
    emphasis: "outlined",
    title: "Material descargado",
  },
  {
    id: "logistics-pending-sap",
    lane: "logistics",
    column: 6,
    title: "Pendiente captura de peso en SAP",
    emphasis: "outlined",
  },
  {
    id: "logistics-captured-sap",
    lane: "logistics",
    column: 7,
    title: "Peso capturado en SAP",
    emphasis: "outlined",
  },
  {
    id: "quality-pending-release",
    lane: "quality",
    column: 7,
    title: "Pendiente de liberación en SAP",
    emphasis: "outlined",
  },
  {
    id: "quality-release",
    lane: "quality",
    column: 8,
    title: "Material liberado en SAP",
    emphasis: "outlined",
  },
  {
    id: "production-end",
    lane: "supplier",
    column: 8,
    kind: "circle",
    circleLabel: "F",
  },
];

export type ProcessFlowEdge = {
  id: string;
  source: string;
  target: string;
  label?: string;
  dashed?: boolean;
  sourceHandle?: string;
  targetHandle?: string;
};

export const processConnections: ProcessFlowEdge[] = [
  {
    id: "edge-start-arrive",
    source: "supplier-start",
    target: "supplier-arrive",
    dashed: true,
  },
  {
    id: "edge-arrive-review",
    source: "supplier-arrive",
    target: "security-create-progress",
    dashed: true,
  },
  {
    id: "edge-review-logistics",
    source: "security-create-progress",
    target: "logistics-pending-authorization",
    dashed: true,
  },
  {
    id: "edge-logistics-authorize",
    source: "logistics-pending-authorization",
    target: "logistics-authorized",
    dashed: true,
  },
  {
    id: "edge-authorize-quality",
    source: "logistics-authorized",
    target: "quality-pending-test",
    dashed: true,
  },
  {
    id: "edge-test-decision",
    source: "quality-pending-test",
    target: "decision-ok",
    dashed: true,
  },
  {
    id: "edge-decision-download",
    source: "decision-ok",
    target: "production-pending-download",
    label: "Aprobado",
    sourceHandle: "source-right",
    targetHandle: "target-left",
    dashed: true,
  },
  {
    id: "edge-decision-inform",
    source: "decision-ok",
    target: "production-end",
    label: "Rechazado",
    sourceHandle: "source-top",
    targetHandle: "target-top",
    dashed: true,
  },
  {
    id: "edge-download-start",
    source: "production-pending-download",
    target: "production-downloading",
    dashed: true,
  },
  {
    id: "edge-download-complete",
    source: "production-downloading",
    target: "production-downloaded",
    dashed: true,
  },
  {
    id: "edge-sap-capture",
    source: "production-downloaded",
    target: "logistics-pending-sap",
    dashed: true,
  },
  {
    id: "edge-sap-captured",
    source: "logistics-pending-sap",
    target: "logistics-captured-sap",
    dashed: true,
  },
  {
    id: "edge-release-quality",
    source: "logistics-captured-sap",
    target: "quality-pending-release",
    dashed: true,
  },
  {
    id: "edge-quality-release",
    source: "quality-pending-release",
    target: "quality-release",
    dashed: true,
  },
  {
    id: "edge-inform-production",
    source: "quality-release",
    target: "production-end",
    dashed: true,
  },
];

export const COLUMN_SPACING = 300;
export const LANE_SPACING = 180;
export const LANE_LABEL_WIDTH = 300;
