"use client";

/**
 * Chat Suggestions Component
 * 
 * CONCLUSION: CopilotKit v2 suggestions (useConfigureSuggestions) are NOT compatible
 * with local LLM setups like LM Studio, even with LangChain integration.
 * 
 * The issue is architectural:
 * - v2 suggestions require BuiltInAgent
 * - BuiltInAgent expects specific OpenAI API response formats
 * - Local LLMs (LM Studio, Ollama) use simplified OpenAI-compatible responses
 * - Missing fields like 'specificationVersion' cause runtime errors
 * 
 * For local LLM setups, the best approach is:
 * - Use CopilotKit v2 UI components (CopilotSidebar) ✅
 * - Use direct OpenAIAdapter (no agents) ✅
 * - Skip v2 suggestions feature ✅
 * - Chat functionality works perfectly ✅
 */
export default function ChatSuggestions() {
  // Disabled - requires agent mode which is incompatible with LM Studio
  return null;
}
