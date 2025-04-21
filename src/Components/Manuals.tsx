import { OpenManual } from "../Utils/Types";

const Manuals = ({
  covered = false,
  currentManual,
  openManuals,
}: {
  covered: boolean;
  currentManual: string | null;
  openManuals: Map<string, OpenManual>;
}) => {
  const openManualsList = Array.from(openManuals);
  return (
    <>
      <div
        className={`absolute h-full w-full bg-transparent ${
          covered ? "" : "hidden"
        }`}
      ></div>
      <div
        className={`h-full min-w-[360px] ${
          currentManual ? "bg-white" : "bg-[url(/images/web-background.jpg)]"
        }`}
      >
        {openManualsList.length > 0 &&
          openManualsList.map(([name, manual]) => (
            <ManualIframe
              key={manual.id}
              name={name}
              manualUrl={manual.manualUrl}
              isCurrentManual={currentManual === name}
            />
          ))}
      </div>
    </>
  );
};

const ManualIframe = ({
  manualUrl,
  isCurrentManual,
}: {
  name: string;
  manualUrl: string;
  isCurrentManual: boolean;
}) => {
  return (
    <iframe
      src={manualUrl}
      className={isCurrentManual ? "w-full h-full" : "hidden"}
    ></iframe>
  );
};

export default Manuals;
