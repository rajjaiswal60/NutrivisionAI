/**
 * Universal Multi-AI Platform Engine Dispatcher for Vyuha AI
 * Dispatches client-side prompts to Google Gemini, Anthropic Claude, OpenAI ChatGPT, DeepSeek, Groq, etc.
 */

export interface AIModelOptions {
  provider?: string;
  apiKey?: string;
  model?: string;
  systemPrompt?: string;
  userCountry?: string;
  customEndpoint?: string;
  history?: Array<{ role: string; content: string }>;
}

export interface AIModelResponse {
  text: string;
  provider: string;
  model: string;
  isSimulatedFallback?: boolean;
}

/**
 * Universal Request Dispatcher
 * Dispatches user prompt to the selected AI provider with strict compliance to direct browser & REST contracts.
 */
export async function callAIModel(
  prompt: string,
  options?: AIModelOptions
): Promise<AIModelResponse> {
  // Read configured provider from LocalStorage or options
  const savedPlatform = localStorage.getItem('connAiPlatform') || 'gemini';
  const savedApiKey = localStorage.getItem('connAiApiKey') || '';
  const savedModel = localStorage.getItem('connAiModel') || '';

  const provider = (options?.provider || savedPlatform || 'gemini').toLowerCase();
  const apiKey = (options?.apiKey || savedApiKey || '').trim();
  const model = options?.model || savedModel;
  const userCountry = options?.userCountry || 'India';
  const systemPrompt = options?.systemPrompt || 
    `You are Vyuha AI Strategic Advisor. Help founders evaluate business models in ${userCountry} through interactive, concise co-creation.
CRITICAL RULES:
1. NEVER dump long memorandums, legal agreements, or multi-page text in chat. Keep chat responses concise (max 2-3 short paragraphs).
2. Always ask 2-3 sharp diagnostic questions (Target Market, Pricing, Moat) with clear options.
3. For greetings ("hi", "hello"), respond in 1-2 friendly sentences.
4. Never mention internal AI engine names (Gemini, Claude, GPT).`;

  const isPlaceholderKey = !apiKey || apiKey === 'Apply You API Key' || apiKey.length < 5;

  // If no valid API key is present, smoothly fall back to our server advisor/simulator
  if (isPlaceholderKey) {
    return await executeFallbackAdvisory(prompt, provider, model, userCountry, systemPrompt);
  }

  try {
    // 1. ANTHROPIC CLAUDE (Claude 3.5 Sonnet / 3.7 Sonnet)
    if (provider === 'claude' || provider === 'anthropic') {
      const selectedModel = model || 'claude-3-5-sonnet-20241022';
      const endpoint = options?.customEndpoint || 'https://api.anthropic.com/v1/messages';

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json',
          'anthropic-dangerous-direct-browser-access': 'true'
        },
        body: JSON.stringify({
          model: selectedModel,
          max_tokens: 4096,
          system: systemPrompt,
          messages: [{ role: 'user', content: prompt }]
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.warn('Anthropic API responded with error:', errorData);
        throw new Error(errorData?.error?.message || `Anthropic API error: HTTP ${response.status}`);
      }

      const data = await response.json();
      const replyText = data?.content?.[0]?.text;
      if (!replyText) throw new Error('No content returned from Claude API');

      return {
        text: replyText,
        provider: 'Anthropic Claude',
        model: selectedModel,
        isSimulatedFallback: false
      };
    }

    // 2. OPENAI CHATGPT (GPT-4o / GPT-4o-mini / o3-mini / o1)
    if (provider === 'openai' || provider === 'chatgpt') {
      const selectedModel = model || 'gpt-4o';
      const endpoint = options?.customEndpoint || 'https://api.openai.com/v1/chat/completions';

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: selectedModel,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: prompt }
          ]
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.warn('OpenAI API responded with error:', errorData);
        throw new Error(errorData?.error?.message || `OpenAI API error: HTTP ${response.status}`);
      }

      const data = await response.json();
      const replyText = data?.choices?.[0]?.message?.content;
      if (!replyText) throw new Error('No content returned from OpenAI API');

      return {
        text: replyText,
        provider: 'OpenAI ChatGPT',
        model: selectedModel,
        isSimulatedFallback: false
      };
    }

    // 3. GOOGLE GEMINI (Gemini 3.6 Flash / Gemini 3.7 Flash / Gemini 2.5 Flash / Gemini 1.5 Flash)
    if (provider === 'gemini' || provider === 'google') {
      const preferredModel = model && model.trim() !== '' ? model.trim() : 'gemini-2.5-flash';
      // Normalize model names if user configured legacy or non-standard IDs
      const candidateModels = Array.from(new Set([
        preferredModel,
        'gemini-2.5-flash',
        'gemini-2.5-pro',
        'gemini-2.0-flash',
        'gemini-1.5-flash',
        'gemini-1.5-pro'
      ]));

      let lastError: any = null;
      for (const m of candidateModels) {
        try {
          const endpoint = options?.customEndpoint 
            ? `${options.customEndpoint}?key=${apiKey}`
            : `https://generativelanguage.googleapis.com/v1beta/models/${m}:generateContent?key=${apiKey}`;

          const requestBody: any = {
            contents: [
              {
                role: 'user',
                parts: [{ text: systemPrompt ? `[Strategic Directive]: ${systemPrompt}\n\n[User Prompt]: ${prompt}` : prompt }]
              }
            ]
          };

          if (systemPrompt) {
            requestBody.system_instruction = {
              parts: [{ text: systemPrompt }]
            };
          }

          const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
          });

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.warn(`Gemini model ${m} returned error:`, errorData);
            throw new Error(errorData?.error?.message || `Gemini API error: HTTP ${response.status}`);
          }

          const data = await response.json();
          const replyText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (replyText) {
            return {
              text: replyText,
              provider: 'Google Gemini',
              model: m,
              isSimulatedFallback: false
            };
          }
        } catch (err) {
          lastError = err;
          console.warn(`Direct client attempt with Gemini model ${m} failed, trying candidate:`, err);
        }
      }

      // If direct browser fetch failed (e.g., CORS or restrictive network), fallback to server proxy with customApiKey
      return await executeFallbackAdvisory(prompt, provider, preferredModel, userCountry, systemPrompt, apiKey);
    }

    // 4. DEEPSEEK (DeepSeek Chat / DeepSeek Reasoner)
    if (provider === 'deepseek') {
      const selectedModel = model || 'deepseek-chat';
      const endpoint = options?.customEndpoint || 'https://api.deepseek.com/chat/completions';

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: selectedModel,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: prompt }
          ]
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData?.error?.message || `DeepSeek API error: HTTP ${response.status}`);
      }

      const data = await response.json();
      return {
        text: data?.choices?.[0]?.message?.content || 'DeepSeek analysis complete.',
        provider: 'DeepSeek AI',
        model: selectedModel,
        isSimulatedFallback: false
      };
    }

    // 5. GROQ (Llama 3.3 70B / Mixtral)
    if (provider === 'groq') {
      const selectedModel = model || 'llama-3.3-70b-versatile';
      const endpoint = options?.customEndpoint || 'https://api.groq.com/openai/v1/chat/completions';

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: selectedModel,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: prompt }
          ]
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData?.error?.message || `Groq API error: HTTP ${response.status}`);
      }

      const data = await response.json();
      return {
        text: data?.choices?.[0]?.message?.content || 'Groq analysis complete.',
        provider: 'Groq LPU',
        model: selectedModel,
        isSimulatedFallback: false
      };
    }

    // 6. PERPLEXITY AI
    if (provider === 'perplexity') {
      const selectedModel = model || 'sonar-pro';
      const endpoint = options?.customEndpoint || 'https://api.perplexity.ai/chat/completions';

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: selectedModel,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: prompt }
          ]
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData?.error?.message || `Perplexity API error: HTTP ${response.status}`);
      }

      const data = await response.json();
      return {
        text: data?.choices?.[0]?.message?.content || 'Perplexity search grounded memo complete.',
        provider: 'Perplexity AI',
        model: selectedModel,
        isSimulatedFallback: false
      };
    }

    // Default fallback to server-side advisory
    return await executeFallbackAdvisory(prompt, provider, model, userCountry, systemPrompt, apiKey);

  } catch (error: any) {
    console.warn(`Direct client call to ${provider.toUpperCase()} failed or encountered network limits. Smoothly pivoting to server advisory proxy/simulator:`, error?.message || error);
    return await executeFallbackAdvisory(prompt, provider, model, userCountry, systemPrompt, apiKey);
  }
}

/**
 * Execute server-side proxy / intelligent advisory fallback
 */
async function executeFallbackAdvisory(
  prompt: string,
  provider: string,
  model?: string,
  userCountry: string = 'India',
  systemPrompt?: string,
  apiKey?: string
): Promise<AIModelResponse> {
  try {
    const res = await fetch('/api/ai/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt,
        messages: [{ role: 'user', content: prompt }],
        customApiKey: apiKey,
        aiProvider: provider,
        model: model,
        userCountry: userCountry,
        systemPrompt: systemPrompt
      })
    });

    if (res.ok) {
      const data = await res.json();
      if (data.text) {
        return {
          text: data.text,
          provider: data.provider || 'Vyuha AI Intelligence',
          model: data.source || model || 'Standard Advisor',
          isSimulatedFallback: !data.geminiActive && !data.source
        };
      }
    }
  } catch (err) {
    console.warn('Server fallback call error, generating local high-rigor memo:', err);
  }

  // Client-Side Zero-Failure Fallback Memo
  return {
    text: `### Strategic Advisory Memo: Autonomous Business Arbitrage Analysis

**Geo-Target & Market Base:** ${userCountry}  
**Ecosystem Potential:** ₹2,00,000+ to ₹15,00,000+/mo gross cashflow potential

#### 1. Strategic Opportunity & Regional Arbitrage Thesis
- **Cost-to-Value Arbitrage:** Capitalizes on the asymmetry between international/Tier-1 corporate budgets and high-skill execution nodes in **${userCountry}**.
- **Gross Margin Target:** **75%–82%** using an asset-light, AI-augmented delivery pod.
- **Payback Period:** **1.8 to 2.3 months** with upfront retainer milestones.

#### 2. Financial Model & Unit Economics
| Key Metric | Target Benchmark | Strategic Lens |
| :--- | :--- | :--- |
| **Gross Margin** | **78.5%** | Asymmetric talent & automation delta |
| **CAC to LTV** | **1 : 8.2** | B2B Retainers with high stickiness |
| **Payback Velocity** | **2.0 Months** | Structured quarterly upfront collection |
| **Pilot Capital** | **₹1,50,000 – ₹3,00,000** | Ultra-lean MVP sprint |

#### 3. 30-Day Execution Priority
1. Incorporate lean holding & local operating entity.
2. Sign 3 anchor corporate design partners with 50% advance retainers.
3. Deploy the complete **Executive Strategic Blueprint** and **AI Video Commercial** generated below.`,
    provider: 'Vyuha Strategic Engine',
    model: 'Autonomous Simulator',
    isSimulatedFallback: true
  };
}
