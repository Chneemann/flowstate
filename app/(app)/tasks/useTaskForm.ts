/**
 * @file tasks/useTaskForm.ts
 * @description Custom hook managing state, validation, and submission logic for task creation and editing.
 */

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { TaskPriority, TaskStatus, DbTask } from "@/types/task";

/**
 * Custom React hook that encapsulates form state management, field updates, assignee toggling,
 * validation rules, and network submission logic for both task creation and editing workflows.
 *
 * @param {DbTask & { assignees?: { id: string }[] }} [initialData] - Initial task data loaded for editing workflows.
 * @param {string} [mode] - The current operating mode (e.g., "edit").
 * @param {TaskStatus} [defaultStatus] - The fallback status applied when creating new tasks.
 * @returns {Object} An object containing form state values, error states, and event handling functions.
 */
export function useTaskForm(
  initialData?: DbTask & { assignees?: { id: string }[] },
  mode?: string,
  defaultStatus?: TaskStatus,
) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const isEditMode = mode === "edit" && initialData;

  const todayString = new Date().toISOString().split("T")[0];
  const dueDateObj = initialData?.dueDate
    ? new Date(initialData.dueDate)
    : null;

  const [form, setForm] = useState({
    title: initialData?.title ?? "",
    description: initialData?.description ?? "",
    priority: (initialData?.priority ?? "medium") as TaskPriority,
    status: (initialData?.status ?? defaultStatus ?? "todo") as TaskStatus,
    assignees: initialData?.assignees?.map((a) => a.id) ?? [],
    dueDate: dueDateObj ? dueDateObj.toISOString().split("T")[0] : todayString,
    dueTime: dueDateObj ? dueDateObj.toTimeString().slice(0, 5) : "23:59",
  });

  const [error, setError] = useState<string | null>(null);

  /**
   * Updates a single property within the form state object.
   *
   * @param {string} field - The target field name to update.
   * @param {any} value - The new value for the field.
   */
  const updateField = (field: string, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  /**
   * Toggles the inclusion of a user ID within the assignees selection list.
   *
   * @param {string} userId - The unique identifier of the user to toggle.
   */
  const handleAssigneeToggle = (userId: string) => {
    const assignees = form.assignees.includes(userId)
      ? form.assignees.filter((id) => id !== userId)
      : [...form.assignees, userId];
    updateField("assignees", assignees);
  };

  /**
   * Validates form inputs, combines date and time values, and submits the payload
   * via API depending on whether the form is in create or edit mode.
   *
   * @async
   * @param {React.SubmitEvent} e - The form submission event.
   */
  const handleSubmit = (e: React.SubmitEvent) => {
    e.preventDefault();
    setError(null);

    if (!form.title.trim()) return;

    const finalDate = form.dueDate || todayString;
    const combinedDateTime = new Date(`${finalDate}T${form.dueTime}`);

    if (!isEditMode && combinedDateTime <= new Date()) {
      setError("The due date and time must be in the future.");
      return;
    }

    startTransition(async () => {
      try {
        const response = await fetch("/api/tasks", {
          method: isEditMode ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: initialData?.id,
            ...form,
            dueDate: combinedDateTime.toISOString(),
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(errorText || "Failed to save task.");
        }

        router.push("/dashboard");
        router.refresh();
      } catch (err: any) {
        console.error("Error submitting task:", err);
        setError(err.message || "Something went wrong. Please try again.");
      }
    });
  };

  return {
    form,
    error,
    isEditMode,
    todayString,
    updateField,
    handleAssigneeToggle,
    handleSubmit,
  };
}
