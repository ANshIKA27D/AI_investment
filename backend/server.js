// server.js - Express API for AI Investment Research Agent
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { researchAgent } = require('./agent');

// LangChain imports for the /api/chat endpoint
const { ChatGroq } = require('@langchain/groq');
const { ChatPromptTemplate } = require('@langchain/core/prompts');
const { StringOutputParser } = require('@langchain/core/output_parsers');


dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Configure CORS to accept requests from our Vite React frontend (port 5173 or others)
app.use(cors({
  origin: '*', // For local workspace testing flexibility
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));

app.use(express.json());

// API route to trigger company research synthesis
app.get('/api/research', async (req, res) => {
  const companyQuery = req.query.company;

  if (!companyQuery) {
    return res.status(400).json({ error: 'Missing required query parameter "company"' });
  }

  console.log(`[API] Received research request for: "${companyQuery}"`);

  try {
    // Invoke the LangGraph agent with initial state
    const result = await researchAgent.invoke({
      company: companyQuery
    });

    console.log(`[API] Research complete for ${result.ticker || companyQuery}. Verdict: ${result.verdict}`);

    // Respond with consolidated state values
    res.json({
      ticker: result.ticker,
      name: result.name,
      sector: result.sector,
      industry: result.industry,
      price: result.price,
      targetPrice: result.targetPrice,
      verdict: result.verdict,
      conviction: result.conviction,
      thesis: result.thesis,
      financials: result.financials,
      sentiment: result.sentiment,
      competitors: result.competitors,
      swot: result.swot,
      logs: result.logs
    });

  } catch (error) {
    console.error('[API] Error running research agent:', error);
    res.status(500).json({
      error: 'An error occurred during agent execution',
      details: error.message
    });
  }
});

// API route for Chatbot assistant
app.post('/api/chat', async (req, res) => {
  const { message, currentStockData } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Missing required body parameter "message"' });
  }

  console.log(`[API] Received chat message: "${message.substring(0, 60)}..."`);

  try {
    const hasApiKey = !!process.env.GROQ_API_KEY;
    let responseText = "";

    if (hasApiKey) {
      // Build stock context string
      let contextString = "";
      if (currentStockData && currentStockData.ticker) {
        contextString = [
          `Stock: ${currentStockData.name} (${currentStockData.ticker})`,
          `Sector/Industry: ${currentStockData.sector} / ${currentStockData.industry}`,
          `Price: ${currentStockData.price} | Target: ${currentStockData.targetPrice}`,
          `Verdict: ${currentStockData.verdict} (Conviction: ${currentStockData.conviction}%)`,
          `Thesis: ${currentStockData.thesis}`,
          `Strengths: ${(currentStockData.swot?.strengths || []).join('; ')}`,
          `Weaknesses: ${(currentStockData.swot?.weaknesses || []).join('; ')}`,
          `Opportunities: ${(currentStockData.swot?.opportunities || []).join('; ')}`,
          `Threats: ${(currentStockData.swot?.threats || []).join('; ')}`,
          `Metrics: ${(currentStockData.financials?.metrics || []).map(m => `${m.label}: ${m.val}`).join(' | ')}`,
        ].join('\n');
      }

      // ── LangChain LCEL Chat Chain ──────────────────────────────────────────
      const { customFetch } = require('./fetchUtils');
      const chatLLM = new ChatGroq({
        apiKey: process.env.GROQ_API_KEY,
        model: "llama-3.1-8b-instant",
        temperature: 0.2,
        fetch: customFetch,
      });

      const chatPrompt = ChatPromptTemplate.fromMessages([
        ["system", `You are AURA, an elite AI Investment Research Assistant with deep expertise in global equity markets, financial analysis, and investment strategy. You can answer questions about ANY publicly traded company, stock, financial concept, or investment topic.

Capabilities:
- Analyze any company's financials, valuation, business model, competitive position, and risks using your extensive training knowledge.
- If a specific stock has been researched (context provided below), use that data for precise answers.
- If the user asks about a DIFFERENT company not in context, answer using your general investment knowledge.
- Cover topics: P/E ratios, revenue growth, EBITDA, SWOT, DCF, sector analysis, macro trends, earnings, dividends, etc.

Response Style:
1. Use concise, analytical tone — suitable for institutional equity research.
2. Structure responses: use **bold** for key terms, numbered/bullet lists for multi-point answers, ### for section headers.
3. Keep responses under 4 paragraphs unless detailed breakdown is requested.
4. Always tie analysis back to investment implications (risk/reward, buy/hold/sell rationale).

Currently Analyzed Stock Context (if available):
{context}`],
        ["human", "{question}"],
      ]);

      const chatChain = chatPrompt.pipe(chatLLM).pipe(new StringOutputParser());

      console.log("[API] Invoking LangChain chatChain (ChatGroq → StringOutputParser)...");
      responseText = await chatChain.invoke({
        context: contextString || "No specific stock is currently analyzed. Answer based on general investment knowledge.",
        question: message,
      });


    } else {
      // Simulated fallback (no API key)
      const query = message.toLowerCase();
      const name = currentStockData?.name || "Apple Inc.";
      const ticker = currentStockData?.ticker || "AAPL";
      const verdict = currentStockData?.verdict || "INVEST";
      const conviction = currentStockData?.conviction || 88;
      const strengths = currentStockData?.swot?.strengths || ["ecosystem lock-in"];
      const weaknesses = currentStockData?.swot?.weaknesses || ["heavy product reliance"];
      const opportunities = currentStockData?.swot?.opportunities || ["AI integration cycles"];
      const threats = currentStockData?.swot?.threats || ["regulatory investigations"];

      if (query.includes("why") || query.includes("verdict") || query.includes("invest") || query.includes("pass")) {
        responseText = `### Verdict: **${verdict}** (${ticker}) — Conviction ${conviction}%\n\n1. **Strategic Moat**: "${strengths[0]}"\n2. **Key Risk**: "${weaknesses[0]}"\n3. **Growth Catalyst**: "${opportunities[0]}"\n\n**Conclusion**: Risk-reward supports **${verdict}**.`;
      } else if (query.includes("swot") || query.includes("strength") || query.includes("weakness") || query.includes("threat")) {
        responseText = `### SWOT — **${name}** (${ticker})\n\n💪 **Strengths**: ${strengths[0]}\n⚠️ **Weaknesses**: ${weaknesses[0]}\n🚀 **Opportunities**: ${opportunities[0]}\n⚡ **Threats**: ${threats[0]}`;
      } else if (query.includes("financial") || query.includes("margin") || query.includes("p/e") || query.includes("pe") || query.includes("metrics")) {
        const pe = (currentStockData?.financials?.metrics || []).find(m => m.label.includes("P/E"))?.val || "31.2";
        const margin = (currentStockData?.financials?.metrics || []).find(m => m.label.includes("Margin"))?.val || "46.2%";
        responseText = `### Key Metrics — **${ticker}**\n\n1. **P/E ${pe}x** — current valuation multiple\n2. **Gross Margin ${margin}** — pricing power and cost efficiency\n\nNavigate to the **Financial Statements** tab for full trend data.`;
      } else {
        responseText = `I am **AURA**. Ask me:\n- "Why did we recommend ${verdict} for ${ticker}?"\n- "Explain the SWOT analysis."\n- "Break down the valuation multiples."`;
      }
    }

    res.json({ reply: responseText });

  } catch (error) {
    console.error('[API] Error in chat assistant:', error);
    res.status(500).json({
      error: 'An error occurred during chat assistant execution',
      details: error.message
    });
  }
});

// Serve static files from the React frontend build folder
const path = require('path');
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// Fallback all other routes to index.html (useful for React Router / SPA fallback)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

// Export app for serverless deployment (Vercel)
module.exports = app;

// Start listening if run directly
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`=================================================`);
    console.log(`  AURA Research Backend running on port ${PORT}`);
    console.log(`  Real Groq mode: ${process.env.GROQ_API_KEY ? 'ACTIVE' : 'INACTIVE (Simulated fallback)'}`);
    console.log(`=================================================`);
  });
}
