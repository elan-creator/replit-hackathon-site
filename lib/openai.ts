let openai: any = null;

if (process.env.AI_INTEGRATIONS_OPENAI_API_KEY) {
  const OpenAI = require('openai').default;
  openai = new OpenAI({
    apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
    baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
  });
}

export default openai;
