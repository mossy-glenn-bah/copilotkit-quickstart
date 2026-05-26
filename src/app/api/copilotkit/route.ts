import {
  CopilotRuntime,
  copilotRuntimeNextJSAppRouterEndpoint,
  OpenAIAdapter,
} from "@copilotkit/runtime";
import { NextRequest } from "next/server";
import OpenAI from "openai";

export const POST = async (req: NextRequest) => {
  // Configure custom OpenAI client for LM Studio
  const openai = new OpenAI({
    baseURL: "http://127.0.0.1:1234/v1",
    apiKey: "lm-studio",
  });

  // Configure LM Studio adapter
  const serviceAdapter = new OpenAIAdapter({
    openai,
    model: "gemma-3-27b-it",
  });

  const runtime = new CopilotRuntime();

  const { handleRequest } = copilotRuntimeNextJSAppRouterEndpoint({
    runtime,
    serviceAdapter,
    endpoint: "/api/copilotkit",
  });

  return handleRequest(req);
};
