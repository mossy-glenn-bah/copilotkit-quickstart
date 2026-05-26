# LM Studio + CopilotKit Setup - Fixes Applied

This document summarizes all fixes performed to integrate CopilotKit with local LM Studio.

## Problems Encountered & Solutions

1. **OpenAI API Blocked by Corporate Proxy (Zscaler)**
   - **Problem**: Initial OpenAI configuration returned "Forbidden" errors
   - **Fix**: Pivoted to local LM Studio at `http://127.0.0.1:1234` to bypass network restrictions

2. **Model Name Parsing Error**
   - **Problem**: Using full .gguf file paths caused "Unknown provider" error
   - **Example Error**: `Unknown provider 'gemma-3-27b-it' in 'gemma-3-27b-it/gemma-3-27b-it-Q4_K_M.gguf'`
   - **Fix**: Used `curl http://127.0.0.1:1234/v1/models` to discover correct API model IDs
   - **Result**: Changed model names:
     - From: `gemma-3-27b-it/gemma-3-27b-it-Q4_K_M.gguf`
     - To: `gemma-3-27b-it`
     - From: `text-embedding-nomic-embed-text-v1.5-embedding/nomic-embed-text-v1.5.f16.gguf`
     - To: `text-embedding-nomic-embed-text-v1.5-embedding`

3. **BuiltInAgent v2 Incompatibility with OpenAI Adapter**
   - **Problem**: `Cannot read properties of undefined (reading 'specificationVersion')`
   - **Fix**: Removed BuiltInAgent v2, switched to direct OpenAIAdapter configuration
   - **Location**: `src/app/api/copilotkit/route.ts`

4. **Agent Mode "Forbidden" Errors**
   - **Problem**: CopilotSidebar v2 required agent configuration, causing "Forbidden" errors
   - **Fix**: Switched from `CopilotSidebar` (v2) to `CopilotChat` (v1)
   - **Location**: `src/app/page.tsx`

5. **Styling Incompatibility**
   - **Problem**: v2 styles loaded but v1 component used
   - **Fix**: Changed import from `@copilotkit/react-ui/v2/styles.css` to `@copilotkit/react-ui/styles.css`
   - **Location**: `src/app/layout.tsx`

6. **OpenAI Client Configuration**
   - **Problem**: Direct baseURL configuration wasn't working properly
   - **Fix**: Created explicit OpenAI client instance with LM Studio configuration
   - **Code**:
     ```typescript
     const openai = new OpenAI({
       baseURL: "http://127.0.0.1:1234/v1",
       apiKey: "lm-studio",
     });
     ```

7. **Client Component Hook Error**
   - **Problem**: `Cannot read properties of undefined (reading 'length')` from `useCopilotChat`
   - **Fix**: Removed `useCopilotChat` hook, simplified page to only use CopilotChat component
   - **Location**: `src/app/page.tsx`

8. **Package Version Downgrade Issue**
   - **Problem**: User ran `npm audit fix --force`, downgrading packages to incompatible versions
   - **Error**: `Element type is invalid: expected a string... but got: undefined`
   - **Fix**: Restored correct package versions:
     - `@copilotkit/react-ui`: `^0.2.0` → `^1.58.0`
     - `@copilotkit/runtime`: `^1.54.1` → `^1.58.0`
     - `next`: `^9.3.3` → `16.2.6`

9. **Cross-Origin Network Access Warnings**
   - **Problem**: Accessing via network IP (10.0.0.166) blocked HMR and fonts
   - **Fix**: Instructed to use `http://localhost:3111` instead of network IP

10. **Text Input Not Working on Main Page**
    - **Problem**: Chat input field not accepting input (likely due to network IP access)
    - **Fix**: Created fallback simple chat interface at `/simple-chat` that directly calls LM Studio API
    - **Location**: `src/app/simple-chat/page.tsx`

## Current Working Configuration

### Environment Variables (.env)
```
LM_STUDIO_URL=http://127.0.0.1:1234
LM_STUDIO_MODEL=gemma-3-27b-it
LM_STUDIO_EMBEDDING=text-embedding-nomic-embed-text-v1.5-embedding
NEXT_PUBLIC_APP_URL=http://localhost:3111
```

### API Route (src/app/api/copilotkit/route.ts)
- Uses OpenAI client with LM Studio baseURL
- OpenAIAdapter with model "gemma-3-27b-it"
- No agent configuration (direct service adapter)

### Frontend (src/app/page.tsx)
- Client component with CopilotChat from `@copilotkit/react-ui`
- Uses v1 styles, not v2
- No hook dependencies, simple component usage

### Backup Option
- Simple chat interface at `/simple-chat` 
- Direct fetch to LM Studio API
- Guaranteed to work without CopilotKit complexity

## Access URLs

- **Main App**: http://localhost:3111
- **Simple Chat**: http://localhost:3111/simple-chat
- **LM Studio API**: http://127.0.0.1:1234

## Key Lessons

1. Always use LM Studio's exposed model IDs, not file paths
2. CopilotKit v1 components work better with custom OpenAI-compatible adapters
3. Avoid mixing v1 and v2 CopilotKit APIs
4. Always access Next.js dev server via localhost, not network IP
5. Don't run `npm audit fix --force` - it can downgrade to incompatible versions
6. Keep a simple fallback option for complex integrations
