import { useTimer } from "react-timer-hook";
import { Minus, Plus, SquarePlus, SquareX } from "lucide-react";
import { useEffect, useState } from "react";
import audioSound from "./../alarm.mp3";

type TimerInfo = {
  id: string;
  expiryTimestamp: Date;
};

const timerAudio = new Audio(audioSound);

// Global used so cancelled timers aren't re-added upon newer timer expiration
const discardedTimers: string[] = [];

const TimerPopup = () => {
  const [timerInput, setTimerInput] = useState<string>("");
  const [timers, setTimers] = useState<TimerInfo[]>([]);
  const [strikeCount, setStrikeCount] = useState<number>(0);

  const cancelTimer = (timerIdToCancel: string) => {
    discardedTimers.push(timerIdToCancel);
    setTimers(
      timers.filter(
        (timer) =>
          timer.id !== timerIdToCancel && !discardedTimers.includes(timer.id)
      )
    );
  };

  const createNewTimer = () => {
    const expiryTimestamp = getExpiryTimestamp(
      timerInput || "5:00",
      strikeCount
    );
    setTimers([
      ...timers,
      {
        id: crypto.randomUUID(),
        expiryTimestamp: expiryTimestamp,
      },
    ]);
    setTimerInput("");
  };

  const finishTimer = (timerId: string) => {
    timerAudio.play();
    discardedTimers.push(timerId);
    setTimeout(() => {
      setTimers(
        timers.filter(
          (timer) => timer.id !== timerId && !discardedTimers.includes(timer.id)
        )
      );
    }, 5000);
  };

  return (
    <div className={`w-full h-full place-items-center mt-4`}>
      <div>
        <p>Strikes</p>
        <p className="flex justify-around">
          {strikeCount >= 4 ? "4+" : strikeCount}
          <Minus
            size="16"
            className="hover:text-red-500 cursor-pointer"
            onClick={() =>
              setStrikeCount(strikeCount - 1 >= 0 ? strikeCount - 1 : 0)
            }
          />
          <Plus
            size="16"
            className="hover:text-red-500 cursor-pointer"
            onClick={() =>
              setStrikeCount(strikeCount + 1 > 4 ? 4 : strikeCount + 1)
            }
          />
        </p>
      </div>
      <p>Set Timer</p>
      <div>
        <div className="flex gap-2 border-b-2 border-bg">
          <input
            type="text"
            name="timer-input"
            id="timer-input"
            placeholder="5:00"
            value={timerInput}
            onChange={(e) => setTimerInput(e.target.value)}
            className="border-bg bg-bg text-jet cancel-drag w-16 mb-2 pl-1"
            onKeyDown={(e) => {
              if (e && e.key === "Enter") createNewTimer();
            }}
          />
          <SquarePlus
            className="hover:text-green-500 cancel-drag cursor-pointer"
            onClick={createNewTimer}
          />
        </div>
      </div>
      <div className="mt-2">
        {timers.map((timerInfo) => (
          <Timer
            key={timerInfo.id}
            expiryTimestamp={timerInfo.expiryTimestamp}
            expireCallback={() => finishTimer(timerInfo.id)}
            cancelTimer={() => cancelTimer(timerInfo.id)}
            strikeCount={strikeCount}
          />
        ))}
      </div>
    </div>
  );
};

const getExpiryTimestamp = (timerInput: string, strikeCount: number): Date => {
  const splitInput = timerInput.split(":");
  const [hours, minutes, seconds] =
    splitInput.length === 3
      ? splitInput.slice(-3)
      : ["0", ...splitInput.slice(-2)];
  let timerLenInSec = 0;
  if (!hours && !minutes && !seconds) timerLenInSec = 300;
  if (hours) timerLenInSec += parseInt(hours) * 60 * 60;
  if (minutes) timerLenInSec += parseInt(minutes) * 60;
  if (seconds) timerLenInSec += parseInt(seconds);
  const time = new Date();
  time.setSeconds(time.getSeconds() + timerLenInSec / (1 + strikeCount * 0.25));
  return time;
};

const Timer = ({
  expiryTimestamp,
  expireCallback,
  cancelTimer,
  strikeCount,
}: {
  expiryTimestamp: Date;
  expireCallback: () => void;
  cancelTimer: () => void;
  strikeCount: number;
}) => {
  const { seconds, totalSeconds, restart } = useTimer({
    expiryTimestamp,
    onExpire: expireCallback,
  });

  const [currentStrikeCount, setCurrentStrikeCount] =
    useState<number>(strikeCount);

  useEffect(() => {
    const newTime = new Date();
    if (currentStrikeCount !== strikeCount) {
      const originalTime = totalSeconds * (1 + currentStrikeCount * 0.25);
      setCurrentStrikeCount(strikeCount);
      newTime.setSeconds(
        newTime.getSeconds() + originalTime / (1 + strikeCount * 0.25)
      );
      restart(newTime);
    }
  }, [currentStrikeCount, restart, strikeCount, totalSeconds]);
  return (
    <div className="flex gap-2">
      <p
        className={`border-bg text-bg cancel-drag w-16 pl-1 ${
          totalSeconds < 60 ? "text-red-500" : "text-bg"
        }`}
      >{`${Math.floor(totalSeconds / 60)}:${String(seconds).padStart(
        2,
        "0"
      )}`}</p>
      <SquareX
        className="hover:text-red-500 cancel-drag cursor-pointer"
        onClick={cancelTimer}
      />
    </div>
  );
};

export default TimerPopup;
