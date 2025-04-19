const Manuals = ({
  covered = false,
  currentManual,
  openManuals,
}: {
  covered: boolean;
  currentManual: string | null;
  openManuals: Map<string, string>;
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
          currentManual ? "" : "bg-[url(/images/web-background.jpg)]"
        }`}
      >
        {openManualsList.length > 0 &&
          openManualsList.map(([name, manual]) => (
            <ManualIframe
              key={name}
              name={name}
              manual={manual}
              isCurrentManual={currentManual === name}
            />
          ))}
      </div>
    </>
  );
};

const ManualIframe = ({
  manual,
  isCurrentManual,
}: {
  name: string;
  manual: string;
  isCurrentManual: boolean;
}) => {
  return (
    <iframe
      src={manual}
      className={isCurrentManual ? "w-full h-full" : "hidden"}
    ></iframe>
  );
};

export default Manuals;
