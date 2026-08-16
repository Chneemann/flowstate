/**
 * @file components/layout/MobileLegalMenu.tsx
 * @description Client component providing a mobile toggle menu for accessing legal links and copyright information in a slide-up overlay.
 */

"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { MoreHorizontal, X } from "lucide-react";
import { LEGAL_LINKS, COPYRIGHT_TEXT, ICON_MAP } from "@/utils/legal";

/**
 * Renders a mobile menu button and a slide-up modal overlay containing
 * links to legal documentation and copyright details.
 *
 * @returns {JSX.Element} The rendered mobile legal menu component.
 */
export default function MobileLegalMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const currentYear = new Date().getFullYear();
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    /**
     * Closes the menu overlay when a click or touch event occurs outside the menu or trigger button.
     *
     * @param {MouseEvent | TouchEvent} event - The pointer or touch event object.
     */
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node;
      if (
        menuRef.current &&
        !menuRef.current.contains(target) &&
        buttonRef.current &&
        !buttonRef.current.contains(target)
      ) {
        setIsOpen(false);
      }
    };

    /**
     * Closes the menu overlay when the Escape key is pressed.
     *
     * @param {KeyboardEvent} event - The keyboard event object.
     */
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <>
      {/* "More" Button */}
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className={`flex flex-col items-center justify-center gap-1 transition-colors cursor-pointer ${
          isOpen
            ? "text-primary font-semibold"
            : "text-foreground-muted hover:text-foreground"
        }`}
        aria-label={isOpen ? "Close menu" : "Open more menu"}
      >
        {isOpen ? (
          <X className="w-5 h-5" />
        ) : (
          <MoreHorizontal className="w-5 h-5" />
        )}
        <span className="text-xs font-medium">More</span>
      </button>

      {/* Slide-Up Overlay */}
      {isOpen && (
        <>
          {/* Backdrop Overlay */}
          <div
            className="fixed inset-0 bottom-16 z-40 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200 cursor-pointer"
            onClick={() => setIsOpen(false)}
          />

          {/* Menü-Card */}
          <div
            ref={menuRef}
            className="fixed bottom-16 left-0 right-0 z-40 bg-background-muted/95 backdrop-blur-xl border-t border-border p-3 rounded-t-2xl shadow-2xl space-y-4 animate-in slide-in-from-bottom duration-200 cursor-default"
          >
            {/* Header */}
            <div className="flex justify-between items-center border-b border-border pb-3">
              <span className="font-semibold text-xs tracking-wider uppercase text-foreground-muted">
                Legal & Info
              </span>
              <button
                onClick={() => setIsOpen(false)}
                className="text-foreground-muted hover:text-foreground p-1 rounded-lg hover:bg-foreground/5 transition-colors cursor-pointer"
                aria-label="Close menu"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Shared Links */}
            <div className="flex flex-col gap-1">
              {LEGAL_LINKS.map((link) => {
                const IconComponent = ICON_MAP[link.iconName];

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-foreground-muted hover:text-foreground hover:bg-foreground/5 transition-colors cursor-pointer"
                  >
                    <IconComponent className="w-4 h-4 text-primary" />
                    <span>{link.name}</span>
                  </Link>
                );
              })}
            </div>

            {/* Shared Copyright */}
            <p className="text-[11px] text-foreground-muted text-center pt-3 border-t border-border/60">
              {COPYRIGHT_TEXT(currentYear)}
            </p>
          </div>
        </>
      )}
    </>
  );
}
