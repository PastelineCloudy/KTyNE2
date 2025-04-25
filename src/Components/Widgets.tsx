import { ReactNode } from "react";
import { Ind } from "../Utils/EdgeworkUtils";

export const SerialWidget = ({ sn: serial }: { sn: string }) => {
  return (
    <Widget className="!bg-[url(/images/SerialNumber.png)] !w-[100px] !text-[24px] !font-bold !pt-[18px] !pl-[11px] !font-[anonymouspro]">
      {serial.toUpperCase()}
    </Widget>
  );
};

export const IndWidget = ({ ind, lit }: { ind: Ind; lit: boolean }) => {
  return (
    <Widget
      className={`${
        bgImgMap[lit ? "lit" : "unlit"]
      } !w-[115px] !text-[30px] !pt-[2px] !pl-[50px] !text-white !font-[anonymouspro]`}
    >
      {ind.toUpperCase()}
    </Widget>
  );
};

export const BatteryWidget = ({ type }: { type: "aa" | "d" }) => {
  return <Widget className={`${bgImgMap[type]} !w-[90px]`} />;
};

export const PortPlateWidget = ({ ports }: { ports: string[] }) => {
  return (
    <Widget className="!w-[112px] !relative !bg-[url(/images/PortPlate.png)]">
      <>
        {ports.map((port: string) => {
          return (
            <span
              key={port}
              className={`${
                bgImgMap[port.toLowerCase()]
              } absolute top-0 left-0 w-full h-full bg-cover bg-center bg-no-repeat`}
            ></span>
          );
        })}
      </>
    </Widget>
  );
};

const Widget = ({
  className,
  children,
}: {
  className: string;
  children?: string | ReactNode;
}) => {
  return (
    <div
      className={`${className} h-[50px] inline-block mt-[12px] mb-[8px] bg-cover bg-center 
      bg-no-repeat relative`}
    >
      {children}
    </div>
  );
};

type BgImgMap = {
  [key: string]: string;
};
const bgImgMap: BgImgMap = {
  // Full strings for Tailwind to be able to parse the url
  dvi: "!bg-[url(/images/PortDVI.png)]",
  parallel: "!bg-[url(/images/PortParallel.png)]",
  ps2: "!bg-[url(/images/PortPS2.png)]",
  rca: "!bg-[url(/images/PortRCA.png)]",
  rj: "!bg-[url(/images/PortRJ.png)]",
  serial: "!bg-[url(/images/PortSerial.png)]",
  aa: "!bg-[url(/images/BatteryAA.png)]",
  d: "!bg-[url(/images/BatteryD.png)]",
  lit: "!bg-[url(/images/LitIndicator.png)]",
  unlit: "!bg-[url(/images/UnlitIndicator.png)]",
};
