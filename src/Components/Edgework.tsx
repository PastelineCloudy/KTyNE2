import { Ind, Port } from "../Utils/EdgeworkUtils";
import {
  BatteryWidget,
  IndWidget,
  PortPlateWidget,
  SerialWidget,
} from "./Widgets";

export type EdgeworkInfo = {
  batteries?: number;
  holders?: number;
  litInds?: Ind[];
  unlitInds?: Ind[];
  portPlates?: Port[][];
  serial: string;
};

let edgeworkKey = 0;
const Edgework = ({
  batteries = 0,
  holders = 0,
  litInds = [],
  unlitInds = [],
  portPlates = [],
  serial,
}: {
  batteries?: number;
  holders?: number;
  litInds?: Ind[];
  unlitInds?: Ind[];
  portPlates?: Port[][];
  serial: string;
}) => {
  const numOfAAPairs = batteries - holders > 0 ? batteries - holders : 0;
  const numOfD = batteries - 2 * numOfAAPairs;

  const edgeworkChildren = [];

  for (let aaPair = 0; aaPair < numOfAAPairs && aaPair < holders; aaPair++) {
    edgeworkChildren.push(<BatteryWidget key={edgeworkKey++} type="aa" />);
  }
  for (let dBatt = 0; dBatt < numOfD; dBatt++) {
    edgeworkChildren.push(<BatteryWidget key={edgeworkKey++} type="d" />);
  }

  litInds.forEach((litInd) => {
    edgeworkChildren.push(
      <IndWidget key={edgeworkKey++} ind={litInd} lit={true} />
    );
  });
  unlitInds.forEach((unlitInd) => {
    edgeworkChildren.push(
      <IndWidget key={edgeworkKey++} ind={unlitInd} lit={false} />
    );
  });

  portPlates.forEach((plate) => {
    edgeworkChildren.push(
      <PortPlateWidget key={edgeworkKey++} ports={plate} />
    );
  });

  if (serial)
    edgeworkChildren.push(
      <SerialWidget key={edgeworkKey++} sn={serial.toUpperCase()} />
    );

  return (
    <div className="flex bg-jet max-w-80vw flex-wrap justify-center">
      {edgeworkChildren}
    </div>
  );
};

export default Edgework;
