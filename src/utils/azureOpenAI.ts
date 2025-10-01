export type AzureChatRole = 'system' | 'user' | 'assistant';

export interface AzureChatMessage {
  role: AzureChatRole;
  content: string;
}

interface ChatCompletionOptions {
  temperature?: number;
  maxTokens?: number;
}

interface AzureChatCompletionResponse {
  choices: Array<{
    message: {
      role: AzureChatRole;
      content?: string;
    };
  }>;
}

const DEFAULT_API_VERSION = '2024-02-15-preview';

const getAzureConfig = () => {
  const endpoint = import.meta.env.VITE_AZURE_OPENAI_ENDPOINT;
  const apiKey = import.meta.env.VITE_AZURE_OPENAI_KEY;
  const deployment = import.meta.env.VITE_AZURE_OPENAI_DEPLOYMENT;
  const apiVersion = import.meta.env.VITE_AZURE_OPENAI_API_VERSION || DEFAULT_API_VERSION;

  if (!endpoint || !apiKey || !deployment) {
    throw new Error('Azure OpenAI environment variables are not fully configured.');
  }

  return { endpoint, apiKey, deployment, apiVersion };
};

export const callAzureChatCompletion = async (
  messages: AzureChatMessage[],
  options: ChatCompletionOptions = {}
): Promise<string> => {
  const { endpoint, apiKey, deployment, apiVersion } = getAzureConfig();

  const response = await fetch(
    `${endpoint}/openai/deployments/${deployment}/chat/completions?api-version=${apiVersion}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': apiKey
      },
      body: JSON.stringify({
        messages,
        temperature: options.temperature ?? 0.2,
        max_tokens: options.maxTokens ?? 1200,
        top_p: 0.95
      })
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Azure OpenAI request failed: ${response.status} ${response.statusText} - ${errorText}`);
  }

  const data = (await response.json()) as AzureChatCompletionResponse;
  const content = data.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error('Azure OpenAI response did not include any content.');
  }

  return content.trim();
};

const stripCodeFences = (text: string) => {
  if (text.startsWith('```')) {
    const fenceMatch = text.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);
    if (fenceMatch) {
      return fenceMatch[1];
    }
  }
  return text;
};

export const extractJsonString = (text: string) => {
  const trimmed = stripCodeFences(text.trim());
  const firstBrace = trimmed.indexOf('{');
  const lastBrace = trimmed.lastIndexOf('}');

  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    return trimmed.slice(firstBrace, lastBrace + 1);
  }

  return trimmed;
};

export const parseAzureJSON = <T>(text: string): T => {
  const jsonString = extractJsonString(text);
  return JSON.parse(jsonString) as T;
};
