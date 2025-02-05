import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod";

const GmailComposeSchema = z.object({
  to: z.array(z.string().email()).nullable(),
  bcc: z.array(z.string().email()).nullable(),
  cc: z.array(z.string().email()).nullable(),
  subject: z.string().nullable(),
  description: z.string().nullable(),
});

export async function generateJSON(promptInput: string) {
  
  const result = await new Promise((resolve) => {
    chrome.storage.local.get("apiKey", resolve);
  });

  //@ts-ignore
  const apiKey = result.apiKey;
  //@ts-ignore
  const openai = new OpenAI({ apiKey ,  dangerouslyAllowBrowser: true  });

  try {
    console.log("Sending request to OpenAI...");
    
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-2024-08-06",
      messages: [
        {
          role: "system",
          content: "You are an AI assistant specialized in composing professional Gmail emails. Your task is to generate a JSON object that represents the email in a structured format. The JSON object should include the following fields:\n\n- `to`: An array of email addresses for the primary recipients. If the user provides specific email addresses, use them directly. If not, use a placeholder like `boss@example.com`.\n- `bcc`: An array of email addresses for blind carbon copy recipients. If no BCC is specified, set this to `null`.\n- `cc`: An array of email addresses for carbon copy recipients. If no CC is specified, set this to `null`.\n- `subject`: A string representing the subject line of the email. If the user provides a subject, use it directly. If not, generate a relevant subject based on the context.\n- `description`: A string containing the body of the email. The content should be professional, clear, and tailored to the context provided by the user. If placeholders are used (e.g., for dates or names), ensure they are clearly marked.\n\n**Instructions:**\n\n1. If the user provides specific email addresses for `to`, `cc`, or `bcc`, use them directly in the JSON object.\n2. If the user does not provide specific email addresses, use appropriate placeholders.\n3. The `subject` should be concise and relevant to the email's purpose.\n4. The `description` should be well-structured, polite, and professional. Use placeholders for any unspecified details (e.g., dates, names).\n5. If the same prompt is repeated, generate a different email composition while maintaining the same structure and professionalism.\n\n**Example Input and Output:**\n\n**Input:**\n`Write a mail to my boss anish.gupta@gmail.com requesting for 10 days maternity leave.`\n\n**Output:**\n```json\n{\n  \"to\": [\"anish.gupta@gmail.com\"],\n  \"bcc\": null,\n  \"cc\": null,\n  \"subject\": \"Request for 10 Days Maternity Leave\",\n  \"description\": \"Dear Mr. Gupta,\\n\\nI hope this message finds you well. I am writing to formally request a period of 10 days of maternity leave starting from [start date] to [end date]. I have ensured that my current projects are up to date and I am coordinating with my colleagues to cover any immediate responsibilities during my absence.\\n\\nPlease let me know if you need any additional information or documentation to process my request.\\n\\nThank you for your understanding and support.\\n\\nBest regards,\\n[Your Name]\"\n}\n```\n\n**Note:** If the same prompt is repeated, generate a different email composition while maintaining the same structure and professionalism."
        },
        {
          role: "user",
          content: promptInput,
        },
      ],
      response_format: { type: "json_object" }
    });

    console.log("Received response from OpenAI");
    
    const responseText = completion.choices[0]?.message?.content;
    if (!responseText) {
      throw new Error("No response from OpenAI");
    }

    
    const parsedResponse = JSON.parse(responseText);
    const validatedResponse = GmailComposeSchema.parse(parsedResponse);
    
    console.log("Validated response:", validatedResponse);
    return validatedResponse;
  } catch (error) {
    console.error("Error details:", error);
    throw error;
  }
}

export type GmailComposeType = z.infer<typeof GmailComposeSchema>;