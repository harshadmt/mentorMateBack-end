const axios = require('axios');
require('dotenv').config();

const getDeepSeekResponse = async (messages, model = 'deepseek/deepseek-chat-v3-0324:free') => {
  try {
    if (!process.env.DEEPSEEK_API_KEY) {
      throw new Error('DEEPSEEK_API_KEY is not configured');
    }

    const resp = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model,
        messages,
        temperature: 0.7,
        max_tokens: 1000
      },
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.DEEPSEEK_API_KEY}`
        },
        timeout: 15000
      }
    );

    if (!resp.data?.choices?.[0]?.message?.content) {
      throw new Error('Invalid API response format');
    }

    return resp.data.choices[0].message.content;
  } catch (err) {
    console.error('[DeepSeek] API Error:', err.response?.data || err.message);
    const errorMessage = err.response?.data?.error?.message || err.message || 'Failed to get AI response';
    throw new Error(errorMessage);
  }
};

module.exports = { getDeepSeekResponse };
