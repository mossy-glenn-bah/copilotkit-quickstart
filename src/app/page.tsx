"use client";

import { CopilotChat } from "@copilotkit/react-ui";

export default function Page() {
  return (
    <main className="flex h-screen">
      <div className="flex-1 p-8">
        <h1 className="text-2xl font-bold">Your App with LM Studio</h1>
        <p className="mt-4 text-gray-600">Chat with your local AI assistant powered by Gemma 3 27B.</p>
        <div className="mt-6 text-sm text-gray-500 space-y-2">
          <p>✅ Local LM Studio connection</p>
          <p>✅ Model: gemma-3-27b-it</p>
          <p>✅ No cloud dependencies</p>
        </div>
      </div>
      <CopilotChat
        labels={{
          title: "Local AI Assistant",
          initial: "Hello! I'm running locally on your machine via LM Studio. How can I help you today?",
        }}
        makeSystemMessage={() => "You are a helpful AI assistant running locally via LM Studio."}
      />
    </main>
  );
}
