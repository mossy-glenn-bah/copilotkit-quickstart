import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req: NextRequest) {
  try {
    const { instructions } = await req.json();

    if (!instructions) {
      return NextResponse.json(
        { error: "Instructions are required" },
        { status: 400 }
      );
    }

    // Configure OpenAI client for LM Studio
    const openai = new OpenAI({
      baseURL: "http://127.0.0.1:1234/v1",
      apiKey: "lm-studio",
    });

    // Call LM Studio
    const completion = await openai.chat.completions.create({
      model: "gemma-3-27b-it",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant that processes tasks step by step. Be concise and actionable.",
        },
        {
          role: "user",
          content: instructions,
        },
      ],
      temperature: 0.7,
      max_tokens: 500,
      stream: false,
    });

    const result = completion.choices[0].message.content;

    return NextResponse.json({ result });
  } catch (error: any) {
    console.error("Task execution error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to execute task" },
      { status: 500 }
    );
  }
}
