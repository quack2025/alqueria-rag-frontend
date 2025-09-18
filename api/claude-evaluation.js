/**
 * Vercel Function: Claude API Proxy for SyntheticUsers Evaluation
 * Handles CORS and secures API keys on the server side
 */

export default async function handler(req, res) {
  // Enable CORS for your frontend
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      systemPrompt,
      userPrompt,
      messages,
      model = 'claude-4-sonnet-20250514', // Default model
      max_tokens = 600, // Support both naming conventions
      maxTokens = max_tokens,
      temperature = 0.8
    } = req.body;

    // Validate required fields
    if (!userPrompt && !messages) {
      return res.status(400).json({ error: 'Missing required prompt or messages' });
    }

    // Get API key from environment variable (secure)
    const claudeApiKey = process.env.CLAUDE_API_KEY;

    if (!claudeApiKey) {
      console.error('CLAUDE_API_KEY not configured in Vercel environment');
      return res.status(500).json({ error: 'API key not configured' });
    }

    // Prepare messages for Claude API
    let claudeMessages = messages || [
      {
        role: 'user',
        content: userPrompt
      }
    ];

    // Call Claude API
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': claudeApiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: model,
        max_tokens: Math.min(maxTokens, 32000), // Cap at max supported
        temperature: temperature,
        system: systemPrompt || 'You are a helpful assistant that provides detailed, thoughtful responses.',
        messages: claudeMessages
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Claude API error:', response.status, errorText);
      return res.status(response.status).json({
        error: 'Claude API error',
        details: errorText
      });
    }

    const data = await response.json();

    // Return the Claude response with full data structure
    res.status(200).json({
      content: data.content || [{text: ''}], // Maintain array structure
      message: data.content?.[0]?.text || '', // For backward compatibility
      response: data.content?.[0]?.text || '', // Alternative field
      usage: data.usage,
      model: data.model,
      stop_reason: data.stop_reason,
      stop_sequence: data.stop_sequence,
      // Flag if response was truncated
      truncated: data.stop_reason === 'max_tokens'
    });

  } catch (error) {
    console.error('Vercel function error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
}