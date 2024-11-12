import React, { useState, useEffect, useRef } from "react";

const PomodoroTimer = () => {
  const [sessionLength, setSessionLength] = useState(25);
  const [breakLength, setBreakLength] = useState(5);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isSession, setIsSession] = useState(true);
  const [timerLabel, setTimerLabel] = useState("Session");
  const audioRef = useRef(null);
  const intervalRef = useRef(null);

  // Format time to mm:ss
  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  // Handle session timer logic
  const handleSessionTimer = () => {
    setTimeLeft((prevTime) => {
      if (prevTime === 0) {
        audioRef.current.play();
        setIsSession(false);
        setTimerLabel("Break");
        return breakLength * 60;
      }
      return prevTime - 1;
    });
  };

  // Handle break timer logic
  const handleBreakTimer = () => {
    setTimeLeft((prevTime) => {
      if (prevTime === 0) {
        audioRef.current.play();
        setIsSession(true);
        setTimerLabel("Session");
        return sessionLength * 60;
      }
      return prevTime - 1;
    });
  };

  // Handle timer logic
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        if (isSession) {
          handleSessionTimer();
        } else {
          handleBreakTimer();
        }
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning, breakLength, sessionLength, isSession]);

  // Handle increment/decrement
  const handleLengthChange = (type, change) => {
    if (isRunning) return;

    const setValue = type === "session" ? setSessionLength : setBreakLength;
    const currentValue = type === "session" ? sessionLength : breakLength;

    const newValue = currentValue + change;
    if (newValue > 0 && newValue <= 60) {
      setValue(newValue);
      if (type === "session" && isSession) {
        setTimeLeft(newValue * 60);
      } else if (type === "break" && !isSession) {
        setTimeLeft(newValue * 60);
      }
    }
  };

  // Handle start/stop
  const handleStartStop = () => {
    setIsRunning(!isRunning);
  };

  // Handle reset
  const handleReset = () => {
    clearInterval(intervalRef.current);
    setIsRunning(false);
    setSessionLength(25);
    setBreakLength(5);
    setTimeLeft(25 * 60);
    setIsSession(true);
    setTimerLabel("Session");
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
  };

  return (
    <div id="container">
      <div id="logo-title">
        <img
          src="https://cdn.pixabay.com/photo/2013/07/12/19/25/egg-timer-154763_1280.png"
          alt="logo"
        />
        <h2 id="title">Pomodoro Timer</h2>
      </div>

      <div id="break-session-container">
        <div id="break-container">
          <span id="break-label">Break Length</span>
          <div id="break-buttons">
            <button
              id="break-decrement"
              onClick={() => handleLengthChange("break", -1)}
            >
              -
            </button>
            <span id="break-length">{breakLength}</span>
            <button
              id="break-increment"
              onClick={() => handleLengthChange("break", 1)}
            >
              +
            </button>
          </div>
        </div>

        <div id="session-container">
          <span id="session-label">Session Length</span>
          <div id="session-buttons">
            <button
              id="session-decrement"
              onClick={() => handleLengthChange("session", -1)}
            >
              -
            </button>
            <span id="session-length">{sessionLength}</span>
            <button
              id="session-increment"
              onClick={() => handleLengthChange("session", 1)}
            >
              +
            </button>
          </div>
        </div>
      </div>

      <div id="timer-container">
        <span id="timer-label">{timerLabel}</span>
        <div id="time-left">
          <span>{formatTime(timeLeft)}</span>
        </div>

        <div id="timer-buttons">
          <button id="start_stop" onClick={handleStartStop}>
            {isRunning ? "Pause" : "Start"}
          </button>
          <button id="reset" onClick={handleReset}>
            Reset
          </button>
        </div>
      </div>

      <audio
        id="beep"
        ref={audioRef}
        src="https://cdn.freecodecamp.org/testable-projects-fcc/audio/BeepSound.wav"
      />
    </div>
  );
};

export default PomodoroTimer;
