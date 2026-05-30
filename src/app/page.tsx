"use client";

import { CopilotSidebar } from "@copilotkit/react-core/v2";
import ChatSuggestions from "@/components/ChatSuggestions";

export default function Page() {
  return (
    <>
      <main className="flex-1 p-8">
        <h1 className="text-2xl font-bold">Your App with LM Studio</h1>
        <p className="mt-4 text-gray-600">Chat with your local AI assistant powered by Gemma 3 27B.</p>
        <div className="mt-6 text-sm text-gray-500 space-y-2">
          <p>✅ Local LM Studio connection</p>
          <p>✅ Model: gemma-3-27b-it</p>
          <p>✅ No cloud dependencies</p>
          <p>✅ CopilotKit v2 UI</p>
        </div>
        
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-3">Try Custom Features:</h2>
          <div className="space-y-2">
            <a
              href="/tasks"
              className="block px-4 py-3 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors"
            >
              <div className="font-medium text-blue-900">🎯 AI Task Manager</div>
              <div className="text-sm text-blue-700">Create and track multi-step AI tasks with progress monitoring</div>
            </a>
          </div>
        </div>
      </main>
      <ChatSuggestions />
      <CopilotSidebar
        defaultOpen={true}
        labels={{
          title: "Local AI Assistant",
          initial: "Hello! I'm running locally on your machine via LM Studio. How can I help you today?",
        }}
      />
    </>
  );
}
