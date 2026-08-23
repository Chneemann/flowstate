/**
 * @file app/(app)/dashboard/column/Column.tsx
 * @description Client component rendering a single column container supporting drag-and-drop drop targets, task lists, and dynamic updating/deleting states.
 */

"use client";

import { useState } from "react";
import Card from "../card/Card";
import ColumnHeader from "./ColumnHeader";
import ColumnEmptyState from "./ColumnEmptyState";
import { ColumnConfig, Task, TaskStatus } from "@/lib/types/task";

/**
 * Properties for the Column component.
 *
 * @interface ColumnProps
 * @property {number} count - The total count of tasks within this column.
 * @property {Task[]} tasks - The array of tasks belonging to this column.
 * @property {Set<string>} [updatingTaskIds] - A set of task IDs currently undergoing updates.
 * @property {(taskId: string, targetStatus: TaskStatus) => void} [onTaskMove] - Callback triggered when a task is moved to a new status column.
 * @property {(taskId: string) => void} [onTaskDelete] - Callback triggered when a task deletion is requested.
 */
export interface ColumnProps extends ColumnConfig {
  count: number;
  tasks: Task[];
  updatingTaskIds?: Set<string>;
  onTaskMove?: (taskId: string, targetStatus: TaskStatus) => void;
  onTaskDelete?: (taskId: string) => void;
}

/**
 * Renders an interactive board column supporting drag-over drop target indicators,
 * header info, and a mapped list of task cards with status change and deletion callbacks.
 *
 * @param {ColumnProps} props - The component props containing column metadata, task arrays, and handlers.
 * @returns {JSX.Element} The rendered column component.
 */
export default function Column(props: ColumnProps) {
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  /**
   * Handles the drag-over event to allow dropping tasks into the column.
   *
   * @param {React.DragEvent<HTMLDivElement>} e - The drag event object.
   */
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setIsDraggingOver(true);
  };

  /**
   * Resets the drag-over highlight state when a dragged element leaves the column area.
   */
  const handleDragLeave = () => {
    setIsDraggingOver(false);
  };

  /**
   * Handles dropping a task card onto the column, extracting task data and triggering the move handler.
   *
   * @param {React.DragEvent<HTMLDivElement>} e - The drop event object.
   */
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingOver(false);

    const taskId = e.dataTransfer.getData("text/plain");
    const sourceStatus = e.dataTransfer.getData("sourceStatus") as TaskStatus;

    if (!taskId || sourceStatus === props.id) return;

    props.onTaskMove?.(taskId, props.id);
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`w-full flex flex-col rounded-2xl p-4 transition-all duration-300 bg-background-muted/40 border ${
        isDraggingOver
          ? "border-primary/80 bg-primary/5 shadow-lg ring-4 ring-primary/10"
          : "border-border/60 shadow-sm"
      }`}
    >
      <ColumnHeader
        id={props.id}
        title={props.title}
        color={props.color}
        count={props.count}
      />

      <div className="flex flex-col gap-3">
        {props.tasks.length === 0 ? (
          <ColumnEmptyState />
        ) : (
          props.tasks.map((task) => (
            <Card
              key={task.id}
              task={task}
              isUpdating={props.updatingTaskIds?.has(task.id)}
              onStatusChange={props.onTaskMove}
              onDelete={props.onTaskDelete}
            />
          ))
        )}
      </div>
    </div>
  );
}
