import Anthropic from '@anthropic-ai/sdk';
import { GmailComposeSchema } from '../zod/zod';
import axios from 'axios';  

export async function generateclaudeJSON(promptInput: string) {
  const result = await new Promise((resolve) => {
    chrome.storage.local.get("apiKey", resolve);
  });

  //@ts-ignore
  const apiKey = result.apiKey;

  try {
    console.log("Sending request to proxy server..."); 

    const response = await axios.post('localhost:3000/api/generate', {
      prompt: promptInput,
      apiKey: apiKey
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.data) {
      throw new Error("No data received from server");
    }

    const validatedResponse = GmailComposeSchema.parse(response.data);
    console.log("Validated response:", validatedResponse);
    return validatedResponse;
    
  } catch (error) {
    console.error("Error in generateclaudeJSON:", error);
    if (axios.isAxiosError(error)) {
      console.error("Server response:", error.response?.data);
    }
    throw error; // Re-throw to handle in the component
  }
}

