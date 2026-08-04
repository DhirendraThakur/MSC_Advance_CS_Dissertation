import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const hasOpenAIKey =
  process.env.OPENAI_API_KEY &&
  process.env.OPENAI_API_KEY.startsWith("sk-") &&
  !process.env.OPENAI_API_KEY.includes("your_api_key_here");

const client = hasOpenAIKey
  ? new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    })
  : null;

function generateFallbackDescription(taskData) {
  const title = taskData.title || "Untitled task";
  const priority = taskData.priority || "Medium";
  const dueDate = taskData.dueDate || "not specified";

  return `Description:
This task focuses on completing "${title}" in a structured and measurable way. It should be planned carefully, implemented according to the project requirements, and reviewed to ensure that the final output supports the dissertation objectives. The task has been marked as ${priority} priority, so it should be managed with appropriate attention and progress tracking. The expected due date is ${dueDate}.

Suggested Subtasks:
1. Define the main purpose and expected outcome of the task.
2. Break the work into smaller implementation or writing steps.
3. Complete the task using the agreed dissertation methodology and technical direction.
4. Review the output and record evidence for the dissertation report.

Acceptance Criteria:
- The task outcome is clear and complete.
- The work supports the AI-enhanced task dashboard and framework recommendation project.
- Any implementation or writing evidence is recorded for later evaluation.
- The final result can be reviewed by the supervisor or used in the dissertation document.

Estimated Effort:
Medium - the task requires planning, implementation, and review, but it can be completed with a clear step-by-step approach.

Potential Risk:
The main risk is incomplete documentation or weak evidence collection. This can be reduced by taking screenshots, recording implementation steps, and committing progress to GitHub.`;
}

app.get("/", (req, res) => {
  res.json({
    message: "AI Task Description API is running",
    openaiConfigured: hasOpenAIKey
  });
});

app.post("/api/ai/generate-task-description", async (req, res) => {
  const { title, priority, status, dueDate, projectContext } = req.body;

  if (!title || title.trim().length < 3) {
    return res.status(400).json({
      error: "Task title is required and must contain at least 3 characters."
    });
  }

  if (!client) {
    return res.json({
      description: generateFallbackDescription({
        title,
        priority,
        status,
        dueDate,
        projectContext
      }),
      source: "local-fallback",
      note: "OpenAI API key is not configured. A professional fallback description was generated locally."
    });
  }

  try {
    const prompt = `
You are a professional academic project planning assistant.

Generate a high-quality task description for an AI-enhanced task management dashboard used in an MSc dissertation.

Task details:
- Title: ${title}
- Priority: ${priority || "Not specified"}
- Status: ${status || "Not specified"}
- Due date: ${dueDate || "Not specified"}
- Project context: ${
      projectContext ||
      "MSc dissertation involving React, Angular, Vue.js, AI-enhanced web applications, secure backend API integration, and an intelligent framework recommendation model."
    }

Return the answer in this exact structure:

Description:
Write a professional task description in 3-4 sentences.

Suggested Subtasks:
1. Subtask one
2. Subtask two
3. Subtask three
4. Subtask four

Acceptance Criteria:
- Criterion one
- Criterion two
- Criterion three
- Criterion four

Estimated Effort:
Low, Medium, or High with one clear reason.

Potential Risk:
One realistic risk and one way to reduce it.
`;

    const response = await client.responses.create({
      model: process.env.OPENAI_MODEL || "gpt-5",
      input: prompt
    });

    return res.json({
      description: response.output_text,
      source: "openai"
    });
  } catch (error) {
    console.error("OpenAI API error:");
    console.error("Status:", error.status);
    console.error("Code:", error.code);
    console.error("Message:", error.message);

    return res.json({
      description: generateFallbackDescription({
        title,
        priority,
        status,
        dueDate,
        projectContext
      }),
      source: "local-fallback-after-openai-error",
      note:
        "OpenAI API call failed, so the backend returned a professional fallback description. Check backend terminal for exact OpenAI error."
    });
  }
});

app.listen(PORT, () => {
  console.log(`Backend API running on http://localhost:${PORT}`);
  console.log(`OpenAI configured: ${hasOpenAIKey}`);
});