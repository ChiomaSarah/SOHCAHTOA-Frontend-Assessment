"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { clearCredentials } from "@/app/appStore/authSlice";

const INACTIVITY_TIMEOUT = 15 * 60 * 1000;
const REFRESH_INTERVAL = 10 * 60 * 1000;
const WARNING_BEFORE = 60 * 1000;

export function useSessionManager() {
  const dispatch = useDispatch();
  const inactivityTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const warningTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const refreshInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  const [showWarning, setShowWarning] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(60);
  const isWarningShown = useRef(false);

  const logout = useCallback(async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    dispatch(clearCredentials());
    window.location.href = "/login";
  }, [dispatch]);

  const refreshToken = useCallback(async () => {
    const res = await fetch("/api/auth/refresh", { method: "POST" });
    if (!res.ok) await logout();
  }, [logout]);

  const clearTimers = useCallback(() => {
    if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
    if (warningTimer.current) clearTimeout(warningTimer.current);
  }, []);

  const resetTimers = useCallback(() => {
    clearTimers();
    isWarningShown.current = false;

    warningTimer.current = setTimeout(() => {
      isWarningShown.current = true;
      setShowWarning(true);
      setSecondsLeft(60);
    }, INACTIVITY_TIMEOUT - WARNING_BEFORE);

    inactivityTimer.current = setTimeout(() => {
      logout();
    }, INACTIVITY_TIMEOUT);
  }, [clearTimers, logout]);

  const handleKeepSessionActive = useCallback(() => {
    setShowWarning(false);
    resetTimers();
  }, [resetTimers]);

  useEffect(() => {
    const events = ["mousemove", "keydown", "click", "scroll", "touchstart"];

    const handleActivity = () => {
      if (!isWarningShown.current) {
        resetTimers();
      }
    };

    events.forEach((e) => window.addEventListener(e, handleActivity));
    resetTimers();
    refreshInterval.current = setInterval(refreshToken, REFRESH_INTERVAL);

    return () => {
      events.forEach((e) => window.removeEventListener(e, handleActivity));
      clearTimers();
      if (refreshInterval.current) clearInterval(refreshInterval.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!showWarning) return;
    const interval = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(interval);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [showWarning]);

  return { showWarning, secondsLeft, handleKeepSessionActive };
}
