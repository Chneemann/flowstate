/**
 * @file components/ErrorToast.tsx
 * @description Client component displaying a modern floating glassmorphism error notification with a pauseable countdown progress bar driven by requestAnimationFrame.
 */

"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useEffect, useState, useRef, useCallback } from "react";
import { AlertCircle, X } from "lucide-react";

const AUTO_DISMISS_TIME = 5000;

/**
 * Renders an optimized, pauseable error toast notification using requestAnimationFrame for smooth progress animations,
 * automatically dismissing itself or handling user-triggered closures.
 *
 * @returns {JSX.Element | null} The rendered error toast component or null if not visible.
 */
export default function ErrorToast() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const error = searchParams.get("error");

  const [isVisible, setIsVisible] = useState(false);
  const [progress, setProgress] = useState(100);
  const [isPaused, setIsPaused] = useState(false);

  const timeLeftRef = useRef(AUTO_DISMISS_TIME);
  const prevTimeRef = useRef<number | null>(null);
  const animFrameRef = useRef<number | null>(null);

  /**
   * Dismisses the toast notification and cleans up the URL error parameter while preserving the current pathname.
   */
  const dismissToast = useCallback(() => {
    setIsVisible(false);

    // Clean up query parameters without forcing a hard redirect to dashboard
    const params = new URLSearchParams(searchParams.toString());
    params.delete("error");
    const query = params.toString();
    const newPath = query ? `${pathname}?${query}` : pathname;

    router.replace(newPath, { scroll: false });
  }, [router, pathname, searchParams]);

  // Show a toast message when an error occurs and reset the timer
  useEffect(() => {
    if (error) {
      setIsVisible(true);
      setProgress(100);
      timeLeftRef.current = AUTO_DISMISS_TIME;
      prevTimeRef.current = null;
    } else {
      setIsVisible(false);
    }
  }, [error]);

  // RequestAnimationFrame loop for smooth, pausable progress
  useEffect(() => {
    if (!isVisible || isPaused) {
      prevTimeRef.current = null;
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      return;
    }

    /**
     * Updates the animation frame progress based on elapsed time.
     *
     * @param {number} now - Current timestamp provided by requestAnimationFrame.
     */
    const updateAnimation = (now: number) => {
      if (prevTimeRef.current === null) {
        prevTimeRef.current = now;
      }

      const elapsed = now - prevTimeRef.current;
      prevTimeRef.current = now;

      timeLeftRef.current = Math.max(0, timeLeftRef.current - elapsed);
      setProgress((timeLeftRef.current / AUTO_DISMISS_TIME) * 100);

      if (timeLeftRef.current <= 0) {
        dismissToast();
      } else {
        animFrameRef.current = requestAnimationFrame(updateAnimation);
      }
    };

    animFrameRef.current = requestAnimationFrame(updateAnimation);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isVisible, isPaused, dismissToast]);

  if (!isVisible || !error) return null;

  /**
   * Resolves the user-facing error title and detailed message based on the error query parameter.
   *
   * @returns {{ title: string; message: string }} An object containing the toast header title and body message.
   */
  const getErrorInfo = (): { title: string; message: string } => {
    switch (error) {
      case "unauthorized_edit":
        return {
          title: "Access Denied",
          message:
            "You cannot edit tasks that belong to others or are in the trash.",
        };
      case "task_not_found":
        return {
          title: "Task Not Found",
          message: "The requested task does not exist or has been deleted.",
        };
      case "member_not_found":
        return {
          title: "Member Not Found",
          message:
            "The requested team member does not exist or has been removed.",
        };
      default:
        return {
          title: "Error",
          message: "An unexpected error occurred.",
        };
    }
  };

  const { title, message } = getErrorInfo();

  return (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="fixed top-6 right-6 z-99 max-w-sm w-full overflow-hidden flex flex-col bg-background/80 dark:bg-zinc-950/80 backdrop-blur-xl border border-destructive/30 text-foreground rounded-2xl shadow-[0_12px_40px_-10px_hsl(0_84%_60%/0.15)] animate-in slide-in-from-top-4 fade-in duration-300 ease-out cursor-default select-none"
    >
      <div className="flex items-start gap-3.5 p-4 pb-3">
        <div className="bg-destructive/10 p-2 rounded-xl text-destructive shrink-0 animate-pulse">
          <AlertCircle size={20} />
        </div>

        <div className="flex flex-col flex-1">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold tracking-wider uppercase text-destructive text-sm">
              {title}
            </h4>
            <button
              onClick={dismissToast}
              className="text-foreground/40 hover:text-foreground transition-colors p-1 -mr-1 rounded-lg hover:bg-foreground/5 cursor-pointer"
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>
          <p className="text-sm text-foreground/70 leading-relaxed pr-2 mt-0.5">
            {message}
          </p>
        </div>
      </div>

      <div className="w-full bg-destructive/10 h-1">
        <div
          className="bg-destructive h-full transition-all duration-75 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
