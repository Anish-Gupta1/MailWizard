import express from "express";
import cors from "cors";
import { Anthropic } from "@anthropic-ai/sdk";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// Configure cors middleware properly
app.use(cors({
  origin: '*',  // In production, you should specify exact origins
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204
}));

// Using additional headers is redundant when cors middleware is configured properly
// But keeping it for extra certainty
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }
  next();
});

app.use(express.json());

app.post("/api/generate", async (req, res) => {
  try {
    const { prompt, apiKey } = req.body;

    if (!prompt || !apiKey) {
      return res.status(400).json({
        error: "Missing required fields",
      });
    }

    console.log("API Key format:", apiKey.substring(0, 10) + "...");

    const anthropic = new Anthropic({
      apiKey: apiKey,
    });

    if (!anthropic || !anthropic.messages) {
      throw new Error("Failed to initialize Anthropic client");
    }

    const msg = await anthropic.messages.create({
      model: "claude-3-sonnet-20240229",
      max_tokens: 1024,
      messages: [
        {
          role: "assistant",
          content: "You are an AI assistant specialized in composing professional Gmail emails...",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      response_format: { type: "json_object" },
    });

    if (!msg?.content?.[0]?.text) {
      throw new Error("Invalid response format from Anthropic");
    }

    const responseText = msg.content[0].text;
    const parsedResponse = JSON.parse(responseText);

    console.log("Successfully generated response");
    res.json(parsedResponse);
  } catch (error) {
    console.error("Detailed server error:", error);
    res.status(500).json({
      error: error.message,
      details: error.stack,
    });
  }
});

// ✅ Export the app as a Vercel serverless function
export default app;