//import ProcessFlowDesktop from "./ProcessFlowDesktop";
import TimeLineEvents from "./TimeLineEvents";
import { useMediaQuery } from "@mui/material";
import { ReceptionProcess } from "@/types";
import TimelineHorizontal from "./TimelineHorizontal";

interface Props {
  receptionProcess: ReceptionProcess;
  lastStatus: string;
}

const ProcessFlow = ({ receptionProcess, lastStatus }: Props) => {
  const isSmallScreen = useMediaQuery("(max-width:900px)");

  return (
    <>
      {isSmallScreen ? (
        <TimeLineEvents
          receptionProcess={receptionProcess}
          currentStatus={lastStatus}
        />
      ) : (
        <>
          <TimelineHorizontal receptionProcess={receptionProcess} />
          {/* <ProcessFlowDesktop
            receptionProcess={receptionProcess}
            lastStatus={lastStatus}
          /> */}
        </>
      )}
    </>
  );
};

export default ProcessFlow;
