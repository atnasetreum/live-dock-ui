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
    title: "Se presenta en caseta 2",
  },
  {
    id: "security-review",
    lane: "security",
    column: 1,
    /* span: 2, */
    title: "Revisa documentos, cumplimiento SST",
    subtitle: "Entrega tickets de pesaje",
  },
  {
    id: "supplier-weigh-in",
    lane: "supplier",
    column: 2,
    title: "Realiza pesaje y llena los datos del ticket",
  },
  {
    id: "security-allow-entry",
    lane: "security",
    column: 2,
    title: "Permite ingreso seguro",
  },
  {
    id: "logistics-verify",
    lane: "logistics",
    column: 2,
    title: "Verifica datos y da ingreso a descarga",
  },
  {
    id: "production-purge",
    lane: "production",
    column: 2,
    title: "En conjunto con Calidad realiza purga",
  },
  {
    id: "quality-sample",
    lane: "quality",
    column: 2,
    title: "Toma muestra y verifica estado de las mangueras",
  },
  {
    id: "decision-ok",
    lane: "quality",
    column: 3,
    kind: "diamond",
    title: "OK",
  },
  {
    id: "quality-inform",
    lane: "quality",
    column: 4,
    title: "Informa a producción, proveedor, compras y logística",
    subtitle: "Si el resultado no es OK",
    emphasis: "outlined",
  },
  {
    id: "production-discharge",
    lane: "production",
    column: 3,
    title: "Realiza descarga segura",
  },
  {
    id: "logistics-proof",
    lane: "logistics",
    column: 3,
    title: "Recibe evidencia de descarga",
  },
  {
    id: "security-exit",
    lane: "security",
    column: 3,
    title: "Permite salida segura",
  },
  {
    id: "supplier-weigh-out",
    lane: "supplier",
    column: 4,
    title: "Realiza pesaje y llena los datos del ticket",
  },
  {
    id: "security-access",
    lane: "security",
    column: 5,
    title: "Permite acceso peatonal",
  },
  {
    id: "supplier-ticket",
    lane: "supplier",
    column: 5,
    title: "Entrega pesaje a logística para des tara",
  },
  {
    id: "logistics-sap",
    lane: "logistics",
    column: 5,
    title: "Captura peso en SAP para su ingreso",
  },
  {
    id: "quality-release",
    lane: "quality",
    column: 5,
    title: "Realiza liberación en SAP",
  },
  {
    id: "production-available",
    lane: "production",
    column: 5,
    title: "Puede hacer uso del alcohol",
  },
  {
    id: "production-end",
    lane: "production",
    column: 6,
    kind: "circle",
    circleLabel: "F",
  },
  {
    id: "security-allow-exit",
    lane: "security",
    column: 4,
    title: "Procesa la salida segura del proveedor",
  },
  /*
  
  {
    id: "supplier-end",
    lane: "supplier",
    column: 6,
    kind: "circle",
    circleLabel: "F",
  },
   */
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
  },
  {
    id: "edge-arrive-review",
    source: "supplier-arrive",
    target: "security-review",
  },
  {
    id: "edge-review-weigh",
    source: "security-review",
    target: "supplier-weigh-in",
    sourceHandle: "source-right",
    targetHandle: "target-left",
  },
  {
    id: "edge-weigh-entry",
    source: "supplier-weigh-in",
    target: "security-allow-entry",
  },
  {
    id: "edge-entry-logistics",
    source: "security-allow-entry",
    target: "logistics-verify",
  },
  {
    id: "edge-logistics-purge",
    source: "logistics-verify",
    target: "production-purge",
  },
  {
    id: "edge-purge-sample",
    source: "production-purge",
    target: "quality-sample",
  },
  {
    id: "edge-sample-decision",
    source: "quality-sample",
    target: "decision-ok",
  },
  {
    id: "edge-decision-discharge",
    source: "decision-ok",
    target: "production-discharge",
    label: "Sí",
    sourceHandle: "source-right",
  },
  {
    id: "edge-decision-inform",
    source: "decision-ok",
    target: "quality-inform",
    label: "No",
    sourceHandle: "source-bottom",
    targetHandle: "target-bottom",
  },
  {
    id: "edge-discharge-proof",
    source: "production-discharge",
    target: "logistics-proof",
  },
  { id: "edge-proof-exit", source: "logistics-proof", target: "security-exit" },
  {
    id: "edge-exit-weighout",
    source: "security-exit",
    target: "supplier-weigh-out",
    targetHandle: "target-left",
  },
  {
    id: "edge-weighout-access",
    source: "supplier-weigh-out",
    target: "security-access",
    sourceHandle: "source-right",
    targetHandle: "target-bottom",
  },
  {
    id: "edge-access-ticket",
    source: "security-access",
    target: "supplier-ticket",
  },
  {
    id: "edge-ticket-sap",
    source: "supplier-ticket",
    target: "logistics-sap",
    sourceHandle: "source-right",
    targetHandle: "target-right",
  },
  {
    id: "edge-sap-release",
    source: "logistics-sap",
    target: "quality-release",
    sourceHandle: "source-left",
    targetHandle: "target-left",
  },
  {
    id: "edge-release-available",
    source: "quality-release",
    target: "production-available",
  },
  {
    id: "edge-available-production-end",
    source: "production-available",
    target: "production-end",
  },
  {
    id: "edge-inform-exit",
    source: "quality-inform",
    target: "security-allow-exit",
  },
  {
    id: "edge-allowexit-weighout",
    source: "security-allow-exit",
    target: "production-end",
    sourceHandle: "source-top",
    targetHandle: "target-top",
  },
  /*
  
  {
    id: "edge-weighout-allow",
    source: "supplier-weigh-out",
    target: "security-allow-exit",
  },
  {
    id: "edge-allow-access",
    source: "security-allow-exit",
    target: "security-access",
  },
  {
    id: "edge-access-ticket",
    source: "security-access",
    target: "supplier-ticket",
  },
  { id: "edge-ticket-sap", source: "supplier-ticket", target: "logistics-sap" },
  {
    id: "edge-sap-release",
    source: "logistics-sap",
    target: "quality-release",
  },
  {
    id: "edge-release-available",
    source: "quality-release",
    target: "production-available",
  },
  
  {
    id: "edge-exit-supplier-end",
    source: "security-exit",
    target: "supplier-end",
    dashed: true,
  }, */
];

export const COLUMN_SPACING = 300;
export const LANE_SPACING = 180;
export const LANE_LABEL_WIDTH = 300;
