import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function generateFile(location: string, content: string) {
  console.log("generateFile", location, content);
}

// Define the tool for generating files
const generateFileTool = {
  type: "function",
  function: {
    name: "generate_file",
    parameters: {
      type: "object",
      properties: {
        location: { type: "string" },
        content: { type: "string" },
      },
      required: ["location", "content"],
    },
  },
};

let systemPrompt = `You are a helpful assistant that can help with software engineering tasks.`;

let additionalPrompt = `If it's not clear from the context what user wants, suppose he wants to create a new file with given task.`;

export async function sendToLlm(
  message: string,
  chatId: string,
  mainWindow: Electron.BrowserWindow
) {
  console.log("sendToLlm", message, chatId);

  try {
    const stream = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: additionalPrompt + message },
      ],
      stream: true,
      tools: [generateFileTool],
      tool_choice: "auto",
    });

    let toolCallFinal = "";

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || "";
      const toolCalls = chunk.choices[0]?.delta?.tool_calls;

      if (content) {
        mainWindow.webContents.send("agent-response", content);
      }

      if (toolCalls) {
        for (const toolCall of toolCalls) {
          toolCallFinal += toolCall.function?.arguments;

          if (toolCall.function?.name === "generate_file") {
            // Implement file generation logic here
            console.log(
              "File generation requested:",
              toolCall,
              toolCall.function.arguments
            );

            // You can add the actual file generation logic and send a response back to the frontend
          }
        }
      }
    }

    if (toolCallFinal) {
      mainWindow.webContents.send("agent-file-response", toolCallFinal);
    }

    mainWindow.webContents.send("agent-response-end");
  } catch (error: unknown) {
    console.error("Error in OpenAI chat:", error);
    if (error instanceof Error) {
      mainWindow.webContents.send("agent-error", error.message);
    } else {
      mainWindow.webContents.send("agent-error", "An unknown error occurred");
    }
  }
}
