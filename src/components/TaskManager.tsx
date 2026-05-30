"use client";

import { useState } from "react";
import { useCopilotReadable } from "@copilotkit/react-core";

export interface Task {
  id: string;
  title: string;
  description: string;
  status: "pending" | "in-progress" | "completed" | "failed";
  result?: string;
  error?: string;
  progress?: number;
  createdAt: Date;
  completedAt?: Date;
}

/**
 * Custom Task Management Component
 * 
 * Manages multi-step AI tasks with progress tracking.
 * Works with local LM Studio - no agent dependencies!
 */
export function TaskManager() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  // Share task state with AI so it can reference tasks
  useCopilotReadable({
    description: "Current tasks and their status",
    value: JSON.stringify(tasks.map(t => ({
      title: t.title,
      status: t.status,
      progress: t.progress,
    }))),
  });

  const createTask = async (title: string, description: string) => {
    const newTask: Task = {
      id: Date.now().toString(),
      title,
      description,
      status: "pending",
      progress: 0,
      createdAt: new Date(),
    };

    setTasks((prev) => [...prev, newTask]);
    
    // Auto-start task
    await executeTask(newTask.id, description);
  };

  const executeTask = async (taskId: string, instructions: string) => {
    setIsProcessing(true);
    
    // Update to in-progress
    updateTaskStatus(taskId, "in-progress", 10);

    try {
      // Call our API route which proxies to LM Studio (avoids CORS)
      const response = await fetch("/api/tasks/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          instructions,
        }),
      });

      updateTaskStatus(taskId, "in-progress", 50);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `API error: ${response.status}`);
      }

      const data = await response.json();
      const result = data.result;

      updateTaskStatus(taskId, "in-progress", 90);

      // Simulate processing time
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Mark complete
      setTasks((prev) =>
        prev.map((task) =>
          task.id === taskId
            ? {
                ...task,
                status: "completed",
                progress: 100,
                result,
                completedAt: new Date(),
              }
            : task
        )
      );
    } catch (error: any) {
      setTasks((prev) =>
        prev.map((task) =>
          task.id === taskId
            ? {
                ...task,
                status: "failed",
                error: error.message,
              }
            : task
        )
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const updateTaskStatus = (
    taskId: string,
    status: Task["status"],
    progress?: number
  ) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, status, progress } : task
      )
    );
  };

  const deleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== taskId));
  };

  const clearCompleted = () => {
    setTasks((prev) => prev.filter((task) => task.status !== "completed"));
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4">AI Task Manager</h2>
        
        <TaskCreator onCreate={createTask} disabled={isProcessing} />
      </div>

      <div className="space-y-4">
        {tasks.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            No tasks yet. Create one above!
          </div>
        ) : (
          <>
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onDelete={() => deleteTask(task.id)}
              />
            ))}
            
            {tasks.some((t) => t.status === "completed") && (
              <button
                onClick={clearCompleted}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Clear completed tasks
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function TaskCreator({
  onCreate,
  disabled,
}: {
  onCreate: (title: string, description: string) => void;
  disabled: boolean;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() && description.trim()) {
      onCreate(title, description);
      setTitle("");
      setDescription("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-gray-100 p-5 rounded-lg border-2 border-gray-300">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Task title (e.g., 'Analyze sales data')"
        className="w-full px-4 py-3 border-2 border-gray-400 rounded-md text-base text-gray-900 placeholder-gray-600 font-medium"
        disabled={disabled}
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Task instructions (e.g., 'Analyze the Q4 sales data and identify top 3 trends')"
        className="w-full px-4 py-3 border-2 border-gray-400 rounded-md text-base text-gray-900 placeholder-gray-600 font-medium leading-relaxed"
        rows={4}
        disabled={disabled}
      />
      <button
        type="submit"
        disabled={disabled || !title.trim() || !description.trim()}
        className="px-6 py-3 bg-blue-600 text-white text-base font-bold rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
      >
        {disabled ? "Processing..." : "Create Task"}
      </button>
    </form>
  );
}

function TaskCard({ task, onDelete }: { task: Task; onDelete: () => void }) {
  const statusColors = {
    pending: "bg-gray-200 text-gray-900",
    "in-progress": "bg-blue-100 text-blue-900",
    completed: "bg-green-100 text-green-900",
    failed: "bg-red-100 text-red-900",
  };

  const statusIcons = {
    pending: "⏳",
    "in-progress": "🔄",
    completed: "✅",
    failed: "❌",
  };

  return (
    <div className="border-2 border-gray-300 rounded-lg p-5 bg-white shadow-md">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-bold text-xl text-gray-900">{task.title}</h3>
          <p className="text-base text-gray-800 mt-2 leading-relaxed">{task.description}</p>
        </div>
        <div className="flex items-center gap-3">
          <span
            className={`px-4 py-2 rounded-full text-sm font-bold ${
              statusColors[task.status]
            }`}
          >
            {statusIcons[task.status]} {task.status}
          </span>
          <button
            onClick={onDelete}
            className="text-gray-500 hover:text-red-600 text-lg font-bold"
          >
            ✕
          </button>
        </div>
      </div>

      {task.status === "in-progress" && task.progress !== undefined && (
        <div className="mt-4">
          <div className="w-full bg-gray-300 rounded-full h-3">
            <div
              className="bg-blue-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${task.progress}%` }}
            />
          </div>
          <p className="text-sm text-gray-800 font-semibold mt-2">{task.progress}% complete</p>
        </div>
      )}

      {task.result && (
        <div className="mt-4 p-4 bg-green-50 rounded-lg border-2 border-green-300">
          <p className="text-base font-bold text-green-900 mb-2">Result:</p>
          <p className="text-base text-gray-900 whitespace-pre-wrap leading-relaxed">{task.result}</p>
        </div>
      )}

      {task.error && (
        <div className="mt-4 p-4 bg-red-50 rounded-lg border-2 border-red-300">
          <p className="text-base font-bold text-red-900 mb-2">Error:</p>
          <p className="text-base text-gray-900">{task.error}</p>
        </div>
      )}

      <div className="mt-4 text-sm text-gray-700 font-medium">
        Created: {task.createdAt.toLocaleTimeString()}
        {task.completedAt && (
          <span className="ml-3">
            • Completed: {task.completedAt.toLocaleTimeString()}
          </span>
        )}
      </div>
    </div>
  );
}
