/**
 * @file tasks/task/TaskDateTime.tsx
 * @description Component for selecting due date and time.
 */

import React from "react";

/**
 * Properties for the TaskDateTime component.
 *
 * @interface TaskDateTimeProps
 * @property {string} dueDate - The currently selected due date string.
 * @property {(val: string) => void} setDueDate - Callback function to update the due date value.
 * @property {string} dueTime - The currently selected due time string.
 * @property {(val: string) => void} setDueTime - Callback function to update the due time value.
 * @property {string} todayString - The minimum selectable date string (today's date).
 */
interface TaskDateTimeProps {
  dueDate: string;
  setDueDate: (val: string) => void;
  dueTime: string;
  setDueTime: (val: string) => void;
  todayString: string;
}

/**
 * Renders date and time input selection controls for managing task deadlines.
 *
 * @param {TaskDateTimeProps} props - The component props.
 * @returns {JSX.Element} The rendered task date and time component.
 */
export default function TaskDateTime({
  dueDate,
  setDueDate,
  dueTime,
  setDueTime,
  todayString,
}: TaskDateTimeProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-border/60">
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-foreground-muted">
          Due Date *
        </label>
        <input
          type="date"
          required
          min={todayString}
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 cursor-pointer"
        />
      </div>

      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-foreground-muted">
          Due Time *
        </label>
        <select
          required
          value={dueTime}
          onChange={(e) => setDueTime(e.target.value)}
          className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 cursor-pointer"
        >
          <option value="08:00">08:00</option>
          <option value="09:00">09:00</option>
          <option value="10:00">10:00</option>
          <option value="11:00">11:00</option>
          <option value="12:00">12:00 (Noon)</option>
          <option value="13:00">13:00</option>
          <option value="14:00">14:00</option>
          <option value="15:00">15:00</option>
          <option value="16:00">16:00</option>
          <option value="17:00">17:00 (End of workday)</option>
          <option value="18:00">18:00</option>
          <option value="20:00">20:00</option>
          <option value="23:59">23:59 (End of day)</option>
        </select>
      </div>
    </div>
  );
}
