# AI Task Manager Guide

## Overview

A custom task management system built for CopilotKit + LM Studio that tracks multi-step AI tasks with progress monitoring.

## Features

✅ **Create AI Tasks** - Define tasks with instructions for your local LLM
✅ **Progress Tracking** - Real-time progress bars (0-100%)
✅ **Status Management** - Pending → In Progress → Completed/Failed
✅ **Result Display** - View AI-generated results inline
✅ **Error Handling** - Graceful failure with error messages
✅ **Context Sharing** - AI assistant can see all tasks via `useCopilotReadable`

## How It Works

1. **User creates a task** with title and instructions
2. **Task sent to LM Studio** at http://127.0.0.1:1234
3. **Progress tracked** through multiple stages (10% → 50% → 90% → 100%)
4. **Results displayed** in the UI
5. **AI assistant aware** of all tasks and can reference them

## Usage

### Visit the Task Manager

Navigate to: **http://localhost:3111/tasks**

### Create a Task

**Example 1: Data Analysis**
- **Title**: "Analyze Sales Data"
- **Instructions**: "Analyze the Q4 2025 sales data and identify the top 3 trends"

**Example 2: Report Generation**
- **Title**: "Generate Summary Report"
- **Instructions**: "Create a summary report of our customer feedback from December"

**Example 3: Code Review**
- **Title**: "Review Code Quality"
- **Instructions**: "Review the authentication code and suggest improvements for security"

### Talk to AI About Tasks

The AI assistant (CopilotSidebar) can see all your tasks! Try asking:

- "What tasks are currently in progress?"
- "Summarize my completed tasks"
- "Create a task to analyze website traffic"
- "What's the status of the sales analysis?"

## Architecture

```
TaskManager Component
    ↓
Task State (React)
    ↓
useCopilotReadable (shares with AI)
    ↓
Direct LM Studio API Call
    ↓
Gemma 3 27B (local model)
```

## Code Structure

```
src/components/TaskManager.tsx    - Main component
src/app/tasks/page.tsx            - Demo page
```

## Key Components

### Task Interface
```typescript
interface Task {
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
```

### Main Functions

- `createTask()` - Create and auto-execute new task
- `executeTask()` - Send task to LM Studio
- `updateTaskStatus()` - Update progress
- `deleteTask()` - Remove task
- `clearCompleted()` - Clear finished tasks

## Benefits

1. **No Agent Dependency** - Works directly with LM Studio API
2. **Full Control** - Custom logic, no black boxes
3. **Progress Visibility** - See exactly what's happening
4. **AI Integration** - CopilotKit AI can reference tasks
5. **Error Resilient** - Handles failures gracefully

## Extending

### Add Task Types

```typescript
type TaskType = "analysis" | "generation" | "summary" | "review";

interface Task {
  // ... existing fields
  type: TaskType;
  metadata?: Record<string, any>;
}
```

### Add Task Templates

```typescript
const templates = {
  dataAnalysis: {
    title: "Data Analysis",
    description: "Analyze data and identify key insights",
  },
  reportGeneration: {
    title: "Generate Report",
    description: "Create a comprehensive report",
  },
};
```

### Add Streaming Support

```typescript
// Modify executeTask to handle streaming responses
const response = await fetch("...", {
  // ... config
  body: JSON.stringify({ stream: true }),
});

const reader = response.body.getReader();
// Process stream chunks and update progress
```

## Tips

1. **Be Specific** - Clear instructions get better results
2. **Monitor Progress** - Watch the progress bar for status
3. **Check Results** - Review AI output carefully
4. **Ask AI** - Use the sidebar to discuss tasks
5. **Retry Failed** - Copy failed task instructions and try again

## Troubleshooting

**Task stuck in "pending"?**
- Check LM Studio is running on port 1234
- Verify model is loaded

**Tasks failing immediately?**
- Check browser console for errors
- Verify LM Studio API endpoint is accessible
- Ensure gemma-3-27b-it model is running

**Progress not updating?**
- Normal - updates happen at specific stages
- Full cycle: 0% → 10% → 50% → 90% → 100%

## Next Steps

- Add task scheduling
- Add task dependencies
- Add parallel task execution
- Add task export/import
- Add task templates library
