const API_URL = "http://localhost:5000/api/ai/generate-task-description";

function generateClientFallbackDescription(form) {
  const title = form.title || "Untitled task";
  const priority = form.priority || "Medium";
  const dueDate = form.dueDate || "not specified";

  return `Description:
This task focuses on completing "${title}" in a structured and measurable way. It supports the dissertation implementation by contributing to the AI-enhanced task dashboard and framework comparison work. The task is marked as ${priority} priority and has an expected due date of ${dueDate}.

Suggested Subtasks:
1. Define the expected outcome of the task.
2. Complete the required implementation or documentation work.
3. Review the result and record evidence for the dissertation.

Acceptance Criteria:
- The task outcome is clear and complete.
- The work supports the dissertation prototype or evaluation.
- Screenshots, code changes, or written evidence are recorded.

Estimated Effort:
Medium - the task requires planning, implementation, and review.

Potential Risk:
The main risk is incomplete evidence collection. This can be reduced by saving screenshots and committing progress to GitHub.`;
}

const aiService = {
  async generateTaskDescription(form) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 25000);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        signal: controller.signal,
        body: JSON.stringify({
          title: form.title,
          priority: form.priority,
          status: form.status,
          dueDate: form.dueDate,
          projectContext:
            "MSc dissertation project involving React, Angular, Vue.js, AI-enhanced task dashboard, secure backend API integration, and intelligent framework recommendation model."
        })
      });

      clearTimeout(timeoutId);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "AI generation failed.");
      }

      return data;
    } catch {
      clearTimeout(timeoutId);

      return {
        description: generateClientFallbackDescription(form),
        source: "vue-client-fallback",
        note:
          "The backend AI response took too long, so Vue generated a professional fallback description."
      };
    }
  }
};

export default aiService;