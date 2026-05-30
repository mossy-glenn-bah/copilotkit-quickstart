"use client";

/**
 * Chat Suggestions Component
 * 
 * Note: The useCopilotChatSuggestions hook requires CopilotKit v2 agent mode.
 * Since this app uses v1 components with direct OpenAI adapter (no agents),
 * suggestions are not currently supported.
 * 
 * To enable suggestions, you would need to:
 * 1. Upgrade to CopilotKit v2 components (CopilotSidebar instead of CopilotChat)
 * 2. Configure BuiltInAgent in the API route
 * 3. Use useConfigureSuggestions from @copilotkit/react-core/v2
 * 
 * For now, this component is disabled to prevent abort errors.
 */
export default function ChatSuggestions() {
  // Disabled - requires v2 agent mode
  return null;
}
