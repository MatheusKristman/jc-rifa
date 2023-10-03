import { useState, useEffect } from "react";

import useTimerStore from "../stores/useTimerStore";

export default function useTimer() {
  const [status, setStatus] = useState("OFF");
  const [canClean, setCanClean] = useState(false);
  const [countdown, setCountdown] = useState({
    hrs: "00",
    mins: "00",
    secs: "00",
  });

  const { intervalId, setIntervalId } = useTimerStore();

  const start = (durationInSecs) => {
    console.log("intevalId: ", intervalId);
    if (status === "ON" || intervalId !== null) {
      clearInterval(intervalId);
      // throw new Error("Another timer already running.");
    }

    if (!durationInSecs) {
      throw new Error("Invalid Duration supplied.");
    }

    let thisId;

    try {
      let timer = durationInSecs;

      thisId = setInterval(() => {
        if (timer <= 0) {
          setCanClean(true);
        } else {
          const hrs = String(parseInt(timer / 3600, 10)).padStart(2, "0");
          const mins = String(parseInt(timer / 60, 10)).padStart(2, "0");
          const secs = String(parseInt(timer % 60, 10)).padStart(2, "0");

          setCountdown({ hrs, mins, secs });

          console.log(timer);
          --timer
        }
      }, 1000);

      setIntervalId(thisId);
      setStatus("ON");

      return { ok: true };
    } catch (error) {
      console.error(error);
      return { ok: false };
    }
  }

  const clear = (id) => {
    clearInterval(id);
    setStatus("OFF");
    setIntervalId(null);
    setCountdown({ hrs: "00", mins: "00", secs: "00" });
    setCanClean(false);
    return { ok: true };
  }

  useEffect(() => {
    if (canClean) {
      clear(intervalId);
    }
  }, [canClean, intervalId]);

  return { start, clear, countdown };
}
