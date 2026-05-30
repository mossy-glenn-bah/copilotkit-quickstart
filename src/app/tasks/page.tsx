"use client";

import { TaskManager } from "@/components/TaskManager";
import { CopilotSidebar } from "@copilotkit/react-core/v2";

/**
 * Task Management Demo Page
 * 
 * Shows how to use the custom TaskManager with CopilotKit.
 * The AI can see and reference all tasks via useCopilotReadable.
 */
export default function TasksPage() {
  return (
    <div className="flex h-screen">
      <main className="flex-1 overflow-auto bg-gray-50">
        <TaskManager />
      </main>

      <CopilotSidebar
        defaultOpen={true}
        labels={{
          title: "Task Assistant",
          initial: "I can help you create and track AI tasks! Try asking me to:\n\n• Create a task to analyze data\n• Summarize completed tasks\n• Suggest tasks based on your needs",
        }}
      />
    </div>
  );
}
