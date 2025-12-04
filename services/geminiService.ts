
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const MODEL_NAME = 'gemini-3-pro-preview';

const SYSTEM_PROMPT = `
You are an expert Swift developer and the creator of "DebugKit", a SwiftUI library for adding developer toolbars to macOS applications.

Your task is to take a natural language description of a debugging need and convert it into Swift code using the DebugKit API.

The DebugKit API looks like this:

\`\`\`swift
import DebugKit
import SwiftUI

struct ContentView: View {
    var body: some View {
        MainView()
            .overlay(
                DebugToolbar(
                    sections: [
                        DebugSection("ENV", [("API", "Staging"), ("Build", "1.0.0")])
                    ],
                    actions: [
                        DebugAction("Clear Cache", icon: "trash", destructive: true) { ... }
                    ]
                )
            )
    }
}
\`\`\`

Rules:
1. ONLY return the Swift code.
2. Ensure the code is syntactically correct Swift.
3. Use a nice layout.
4. Do not wrap in markdown code blocks.
5. Be concise.
`;

export const generateSwiftWorkflow = async (prompt: string): Promise<string> => {
  if (!process.env.API_KEY) {
    return `// Error: API Key is missing.\n// Please configure process.env.API_KEY to use the AI generator.`;
  }

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        temperature: 0.2, // Low temperature for code consistency
      }
    });

    let code = response.text || "";
    // Clean up markdown if present
    code = code.replace(/```swift/g, '').replace(/```/g, '').trim();
    return code;

  } catch (error) {
    console.error("Gemini API Error:", error);
    return `// Error generating code. \n// ${error instanceof Error ? error.message : 'Unknown error'}`;
  }
};