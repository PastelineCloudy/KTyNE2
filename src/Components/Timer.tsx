import { useTimer } from "react-timer-hook";
import DraggableResizeable from "./DraggableResizeable";
import { SquarePlus, SquareX } from "lucide-react";
import { useState } from "react";
import audioSound from "./../alarm.mp3";

type TimerInfo = {
  id: string;
  expiryTimestamp: Date;
};

const timerAudio = new Audio(audioSound);

const TimerPopup = ({
  isOpen,
  setIframeCovered,
}: {
  isOpen: boolean;
  setIframeCovered: (val: boolean) => void;
}) => {
  const [timerInput, setTimerInput] = useState<string>();
  const [timers, setTimers] = useState<TimerInfo[]>([]);

  const cancelTimer = (timerIdToCancel: string) => {
    setTimers(timers.filter((timer) => timer.id !== timerIdToCancel));
  };

  return (
    <DraggableResizeable
      isOpen={isOpen}
      corner={"bottom-left"}
      setIframeCovered={setIframeCovered}
    >
      <div
        className={`bg-jet text-bg w-full h-full
        border-2 border-bg rounded-2 p-[10px] 
        place-items-center gap-2`}
      >
        <p>Set Timer</p>
        <div>
          <div className="flex gap-2 border-b-2 border-bg">
            <form action="#"></form>
            <input
              type="text"
              name="timer-input"
              id="timer-input"
              placeholder="5:00"
              value={timerInput}
              onChange={(e) => setTimerInput(e.target.value)}
              className="border-bg bg-bg text-jet cancel-drag w-16 mb-2 pl-1"
            />
            <SquarePlus
              className="hover:text-green-500 cancel-drag cursor-pointer"
              onClick={() => {
                setTimers([
                  ...timers,
                  {
                    id: crypto.randomUUID(),
                    expiryTimestamp: getExpiryTimestamp(timerInput || "5:00"),
                  },
                ]);
                setTimerInput("");
              }}
            />
          </div>
        </div>
        <div className="mt-2">
          {timers.map((timerInfo) => (
            <Timer
              key={timerInfo.id}
              expiryTimestamp={timerInfo.expiryTimestamp}
              expireCallback={() => {
                timerAudio.play();
                setTimeout(() => {
                  setTimers(
                    timers.filter((timer) => timer.id !== timerInfo.id)
                  );
                }, 5000);
              }}
              cancelTimer={() => cancelTimer(timerInfo.id)}
            />
          ))}
        </div>
      </div>
    </DraggableResizeable>
  );
};

const getExpiryTimestamp = (timerInput: string): Date => {
  const [minutes, seconds] = timerInput.split(":").slice(-2);
  let timerLenInSec = 0;
  if (!minutes && !seconds) timerLenInSec = 300;
  if (minutes) timerLenInSec = parseInt(minutes) * 60;
  if (seconds) timerLenInSec += parseInt(seconds);
  const time = new Date();
  time.setSeconds(time.getSeconds() + timerLenInSec);
  return time;
};

const Timer = ({
  expiryTimestamp,
  expireCallback,
  cancelTimer,
}: {
  expiryTimestamp: Date;
  expireCallback: () => void;
  cancelTimer: () => void;
}) => {
  const { seconds, minutes, hours } = useTimer({
    expiryTimestamp,
    onExpire: expireCallback,
  });
  return (
    <div className="flex gap-2">
      <input
        type="text"
        name="timer-input"
        id="timer-input"
        className={`border-bg text-bg cancel-drag w-16 pl-1 ${
          hours * 60 + minutes < 1 ? "text-red-500" : "text-bg"
        }`}
        disabled
        value={`${hours * 60 + minutes}:${String(seconds).padStart(2, "0")}`}
      />
      <SquareX
        className="hover:text-red-500 cancel-drag cursor-pointer"
        onClick={cancelTimer}
      />
    </div>
  );
};

export default TimerPopup;
