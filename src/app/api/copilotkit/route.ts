import {
  CopilotRuntime,
  copilotRuntimeNextJSAppRouterEndpoint,
  OpenAIAdapter,
} from "@copilotkit/runtime";
import { NextRequest } from "next/server";
import OpenAI from "openai";

export const POST = async (req: NextRequest) => {
  // Configure OpenAI client for LM Studio
  const openai = new OpenAI({
    baseURL: "http://127.0.0.1:1234/v1",
    apiKey: "lm-studio",
  });

  // Create OpenAI adapter for LM Studio
  const serviceAdapter = new OpenAIAdapter({
    openai,
    model: "gemma-3-27b-it",
  });

  // Direct runtime configuration - works reliably with LM Studio
  // Note: BuiltInAgent is incompatible with local LLM response formats
  const runtime = new CopilotRuntime();

  const { handleRequest } = copilotRuntimeNextJSAppRouterEndpoint({
    runtime,
    serviceAdapter,
    endpoint: "/api/copilotkit",
  });

  return handleRequest(req);
};
