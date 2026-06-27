const { StateGraph, Annotation, START, END } = require("@langchain/langgraph");
const { ChatGroq } = require("@langchain/groq");
const { ChatPromptTemplate } = require("@langchain/core/prompts");
const { JsonOutputParser, StringOutputParser } = require("@langchain/core/output_parsers");
const dotenv = require("dotenv");
dotenv.config();

// ── LangChain LLM ────────────────────────────────────────────────────────────
const { customFetch } = require("./fetchUtils");
const llm = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY,
  model: "llama-3.1-8b-instant",
  temperature: 0.1,
  fetch: customFetch,
});

const jsonParser = new JsonOutputParser();
const strParser  = new StringOutputParser();

// ── LCEL Chains (one per graph node) ─────────────────────────────────────────

// Chain 1: Ticker Extraction
const tickerChain = ChatPromptTemplate.fromMessages([
  ["system", "You are an expert financial data resolver. Always respond with valid JSON only — no markdown, no commentary."],
  ["human", "Identify the stock ticker, company name, sector, and industry for: \"{company}\". Respond ONLY with: {{\"ticker\":\"\",\"name\":\"\",\"sector\":\"\",\"industry\":\"\"}}"],
]).pipe(llm).pipe(jsonParser);

// Chain 2: Financial Analysis
const financialsChain = ChatPromptTemplate.fromMessages([
  ["system", "You are a financial analyst. Always respond with valid JSON only — no markdown, no commentary."],
  ["human", "Provide realistic financials for ticker \"{ticker}\" ({name}). Respond ONLY with: {{\"price\":\"\",\"targetPrice\":\"\",\"metrics\":[{{\"label\":\"\",\"val\":\"\"}}],\"chartData\":[{{\"year\":\"\",\"revenue\":0,\"netIncome\":0}}]}}. Include 8 metrics and 4 years of chart data."],
]).pipe(llm).pipe(jsonParser);

// Chain 3: Sentiment Analysis
const sentimentChain = ChatPromptTemplate.fromMessages([
  ["system", "You are a financial news analyst. Always respond with valid JSON only — no markdown, no commentary."],
  ["human", "Generate 3 recent financial news items for \"{name}\" ({ticker}). Respond ONLY with: {{\"score\":75,\"label\":\"Bullish\",\"news\":[{{\"title\":\"\",\"source\":\"\",\"time\":\"\",\"sentiment\":\"bullish\",\"summary\":\"\"}}]}}"],
]).pipe(llm).pipe(jsonParser);

// Chain 4: Competitor Benchmarking
const competitorChain = ChatPromptTemplate.fromMessages([
  ["system", "You are a market research analyst. Always respond with valid JSON only — no markdown, no commentary."],
  ["human", "List \"{ticker}\" ({name}, sector: {sector}) and its 2 closest competitors. Respond ONLY with: {{\"competitors\":[{{\"ticker\":\"\",\"name\":\"\",\"cap\":\"\",\"pe\":\"\",\"margin\":\"\",\"growth\":\"\",\"score\":\"\"}}]}}"],
]).pipe(llm).pipe(jsonParser);

// Chain 5: Decision Engine
const decisionChain = ChatPromptTemplate.fromMessages([
  ["system", "You are a senior equity analyst. Always respond with valid JSON only — no markdown, no commentary."],
  ["human", "Evaluate \"{name}\" ({ticker}). Sector: {sector}. Price: {price}. Target: {targetPrice}. Sentiment: {sentimentScore}%. Output INVEST or PASS. Respond ONLY with: {{\"verdict\":\"INVEST\",\"conviction\":85,\"thesis\":\"\",\"swot\":{{\"strengths\":[],\"weaknesses\":[],\"opportunities\":[],\"threats\":[]}}}}"],
]).pipe(llm).pipe(jsonParser);

// ── Fallback Database ─────────────────────────────────────────────────────────
const FALLBACK = {
  AAPL: {
    ticker:"AAPL",name:"Apple Inc.",sector:"Technology",industry:"Consumer Electronics",
    price:"$214.32",targetPrice:"$260.00",verdict:"INVEST",conviction:88,
    thesis:"Apple is positioned to capture massive value through its Apple Intelligence AI integration across 2 billion active devices.",
    financials:{
      metrics:[
        {label:"Market Cap",val:"$3.28T"},{label:"P/E Ratio",val:"31.2"},
        {label:"ROE",val:"154.3%"},{label:"Gross Margin",val:"46.2%"},
        {label:"Operating Margin",val:"30.7%"},{label:"Debt to Equity",val:"1.45"},
        {label:"Revenue Growth",val:"+6.1% YoY"},{label:"Free Cash Flow",val:"$104.3B"}
      ],
      chartData:[
        {year:"2021",revenue:365.8,netIncome:94.6},{year:"2022",revenue:394.3,netIncome:99.8},
        {year:"2023",revenue:383.2,netIncome:96.9},{year:"2024",revenue:391.0,netIncome:101.9}
      ]
    },
    sentiment:{score:82,label:"Strongly Bullish",news:[
      {title:"Apple Intelligence rollout expected to spark massive upgrade cycle",source:"Bloomberg",time:"2 hours ago",sentiment:"bullish",summary:"Analysts raising targets as consumers plan to upgrade for AI features."},
      {title:"EU regulators fine Apple over App Store practices",source:"Reuters",time:"1 day ago",sentiment:"bearish",summary:"New antitrust fine highlights ongoing regulatory headwind in Europe."},
      {title:"Services revenue grows 12%, offsetting minor iPad declines",source:"WSJ",time:"3 days ago",sentiment:"bullish",summary:"App Store and iCloud demand surge, driving gross margin to record highs."}
    ]},
    competitors:[
      {ticker:"AAPL",name:"Apple Inc.",cap:"$3.28T",pe:"31.2",margin:"46.2%",growth:"6.1%",score:"88"},
      {ticker:"MSFT",name:"Microsoft Corp.",cap:"$3.15T",pe:"34.8",margin:"44.6%",growth:"11.8%",score:"90"},
      {ticker:"GOOGL",name:"Alphabet Inc.",cap:"$2.11T",pe:"22.4",margin:"57.4%",growth:"14.2%",score:"85"}
    ],
    swot:{
      strengths:["Unrivaled consumer brand loyalty and ecosystem lock-in.","High-margin recurring Services division."],
      weaknesses:["Heavy reliance on iPhone (~50% of revenue).","Slowing growth in China hardware markets."],
      opportunities:["Apple Intelligence driving multi-year upgrade supercycle.","Vision Pro and health-tech expansion."],
      threats:["EU DMA and US DOJ antitrust scrutiny.","Geopolitical supply chain risks around Taiwan."]
    },
    logs:[
      "Node [Ticker Extraction]: Resolving AAPL on NASDAQ. Sector: Technology.",
      "Node [Financial Analysis]: Revenue CAGR +2.2%. FCF coverage outstanding.",
      "Node [Sentiment Scraper]: Sentiment Index: 82% Bullish.",
      "Node [Competitor Benchmarking]: Comparing AAPL vs MSFT, GOOGL.",
      "Node [Decision Engine]: Recommendation: INVEST. Conviction: 88%."
    ]
  },
  TSLA: {
    ticker:"TSLA",name:"Tesla Inc.",sector:"Consumer Cyclical",industry:"Auto Manufacturers",
    price:"$187.44",targetPrice:"$165.00",verdict:"PASS",conviction:58,
    thesis:"Tesla faces margin compression and slowing EV adoption. Chinese competition is commoditizing the core automotive business.",
    financials:{
      metrics:[
        {label:"Market Cap",val:"$598B"},{label:"P/E Ratio",val:"56.4"},
        {label:"ROE",val:"18.2%"},{label:"Gross Margin",val:"17.4%"},
        {label:"Operating Margin",val:"5.6%"},{label:"Debt to Equity",val:"0.08"},
        {label:"Revenue Growth",val:"-1.8% YoY"},{label:"Free Cash Flow",val:"$1.2B"}
      ],
      chartData:[
        {year:"2021",revenue:53.8,netIncome:5.6},{year:"2022",revenue:81.5,netIncome:12.6},
        {year:"2023",revenue:96.8,netIncome:15.0},{year:"2024",revenue:95.1,netIncome:9.8}
      ]
    },
    sentiment:{score:46,label:"Slightly Bearish",news:[
      {title:"Tesla EV deliveries miss quarterly targets",source:"Reuters",time:"3 hours ago",sentiment:"bearish",summary:"Global deliveries dropped 4.8% YoY."},
      {title:"Energy storage deployments hit record 9.4 GWh",source:"TechCrunch",time:"12 hours ago",sentiment:"bullish",summary:"Megapack and Powerwall sales continue to grow."},
      {title:"Automotive gross margin drops below 15%",source:"MarketWatch",time:"2 days ago",sentiment:"bearish",summary:"Repeated price cuts have severely eroded margins."}
    ]},
    competitors:[
      {ticker:"TSLA",name:"Tesla Inc.",cap:"$598B",pe:"56.4",margin:"17.4%",growth:"-1.8%",score:"58"},
      {ticker:"BYDDY",name:"BYD Co. Ltd.",cap:"$89B",pe:"18.1",margin:"20.2%",growth:"22.4%",score:"82"},
      {ticker:"TM",name:"Toyota Motor",cap:"$240B",pe:"7.8",margin:"12.8%",growth:"14.1%",score:"74"}
    ],
    swot:{
      strengths:["Undisputed EV brand recognition.","Industry-leading battery supply chain."],
      weaknesses:["Declining automotive profit margins.","Key-man risk around Elon Musk."],
      opportunities:["FSD software licensing to other OEMs.","Robotaxi fleet driving high-margin revenues."],
      threats:["Intense pricing pressure from Chinese manufacturers.","Slowing global EV subsidies."]
    },
    logs:[
      "Node [Ticker Extraction]: Resolving TSLA on NASDAQ. Sector: Consumer Cyclical.",
      "Node [Financial Analysis]: Auto gross margin dropped from 29% to 17.4%.",
      "Node [Sentiment Scraper]: Sentiment Index: 46% Bearish.",
      "Node [Competitor Benchmarking]: P/E at 56.4x vs BYD at 18x.",
      "Node [Decision Engine]: Recommendation: PASS. Conviction: 58%."
    ]
  },
  MSFT: {
    ticker:"MSFT",name:"Microsoft Corporation",sector:"Technology",industry:"Software - Infrastructure",
    price:"$420.55",targetPrice:"$500.00",verdict:"INVEST",conviction:90,
    thesis:"Microsoft is the lowest-risk vehicle to capitalize on enterprise AI via Copilot and Azure OpenAI partnerships.",
    financials:{
      metrics:[
        {label:"Market Cap",val:"$3.15T"},{label:"P/E Ratio",val:"34.8"},
        {label:"ROE",val:"38.4%"},{label:"Gross Margin",val:"69.8%"},
        {label:"Operating Margin",val:"44.6%"},{label:"Debt to Equity",val:"0.42"},
        {label:"Revenue Growth",val:"+11.8% YoY"},{label:"Free Cash Flow",val:"$74.1B"}
      ],
      chartData:[
        {year:"2021",revenue:168.1,netIncome:61.3},{year:"2022",revenue:198.3,netIncome:72.7},
        {year:"2023",revenue:211.9,netIncome:72.4},{year:"2024",revenue:245.1,netIncome:88.1}
      ]
    },
    sentiment:{score:86,label:"Strongly Bullish",news:[
      {title:"Azure growth outpaces AWS and Google Cloud",source:"Bloomberg",time:"4 hours ago",sentiment:"bullish",summary:"Azure grew 29% CC with 12 points from AI demand."},
      {title:"Microsoft Copilot pricing hikes boost Office ARPU by 15%",source:"WSJ",time:"1 day ago",sentiment:"bullish",summary:"$30/month Copilot add-on drives ARPU higher."},
      {title:"Antitrust regulators investigate OpenAI partnership",source:"FT",time:"3 days ago",sentiment:"bearish",summary:"UK CMA and US FTC examining $13B OpenAI investment."}
    ]},
    competitors:[
      {ticker:"MSFT",name:"Microsoft Corp.",cap:"$3.15T",pe:"34.8",margin:"44.6%",growth:"11.8%",score:"90"},
      {ticker:"AAPL",name:"Apple Inc.",cap:"$3.28T",pe:"31.2",margin:"46.2%",growth:"6.1%",score:"88"},
      {ticker:"AMZN",name:"Amazon.com Inc.",cap:"$1.92T",pe:"42.1",margin:"18.4%",growth:"12.5%",score:"84"}
    ],
    swot:{
      strengths:["Massive enterprise footprint.","Azure momentum via OpenAI exclusivity."],
      weaknesses:["High Capex ($50B+) for AI datacenters.","Legacy software integration complexity."],
      opportunities:["Copilot expansion into SMB market.","Gaming revenue from Activision acquisition."],
      threats:["Antitrust challenges on AI exclusivity.","Cybersecurity breaches targeting Azure."]
    },
    logs:[
      "Node [Ticker Extraction]: Resolving MSFT on NASDAQ. Sector: Technology.",
      "Node [Financial Analysis]: Double-digit revenue growth. Operating margin 44.6%.",
      "Node [Sentiment Scraper]: Sentiment Index: 86% Bullish.",
      "Node [Competitor Benchmarking]: Higher FCF stability than Apple.",
      "Node [Decision Engine]: Recommendation: INVEST. Conviction: 90%."
    ]
  },
  NVDA: {
    ticker:"NVDA",name:"NVIDIA Corporation",sector:"Technology",industry:"Semiconductors",
    price:"$126.85",targetPrice:"$155.00",verdict:"INVEST",conviction:92,
    thesis:"NVIDIA has a near-monopoly in AI datacenter accelerators with a deep CUDA software moat.",
    financials:{
      metrics:[
        {label:"Market Cap",val:"$3.11T"},{label:"P/E Ratio",val:"64.2"},
        {label:"ROE",val:"115.6%"},{label:"Gross Margin",val:"75.1%"},
        {label:"Operating Margin",val:"62.4%"},{label:"Debt to Equity",val:"0.12"},
        {label:"Revenue Growth",val:"+262% YoY"},{label:"Free Cash Flow",val:"$39.2B"}
      ],
      chartData:[
        {year:"2021",revenue:26.9,netIncome:9.7},{year:"2022",revenue:27.0,netIncome:4.4},
        {year:"2023",revenue:60.9,netIncome:29.8},{year:"2024",revenue:96.3,netIncome:53.0}
      ]
    },
    sentiment:{score:90,label:"Extremely Bullish",news:[
      {title:"Demand for Blackwell chips 'insane', says Jensen Huang",source:"CNBC",time:"5 hours ago",sentiment:"bullish",summary:"Blackwell production fully booked for 12 months."},
      {title:"ASML bookings indicate solid capacity expansion",source:"Financial Times",time:"1 day ago",sentiment:"bullish",summary:"Strong TSMC spending ensures Nvidia supply expands."},
      {title:"FTC opens preliminary antitrust inquiry into AI chip bundling",source:"The Verge",time:"5 days ago",sentiment:"neutral",summary:"Unlikely to impact near-term earnings."}
    ]},
    competitors:[
      {ticker:"NVDA",name:"NVIDIA Corp.",cap:"$3.11T",pe:"64.2",margin:"75.1%",growth:"262%",score:"92"},
      {ticker:"AMD",name:"Advanced Micro Devices",cap:"$255B",pe:"124.5",margin:"46.8%",growth:"18.4%",score:"78"},
      {ticker:"INTC",name:"Intel Corporation",cap:"$85B",pe:"95.0",margin:"40.2%",growth:"-0.8%",score:"42"}
    ],
    swot:{
      strengths:["~90% AI accelerator market share.","CUDA ecosystem locks in developers."],
      weaknesses:["Concentrated supply chain on TSMC.","Revenue depends on few hyperscalers."],
      opportunities:["Blackwell driving higher ASPs.","DGX Cloud and robotics expansion."],
      threats:["Hyperscalers building custom silicon.","China export control restrictions."]
    },
    logs:[
      "Node [Ticker Extraction]: Resolving NVDA on NASDAQ. Sector: Technology.",
      "Node [Financial Analysis]: Revenue +262% YoY. Operating margin 62.4%.",
      "Node [Sentiment Scraper]: Sentiment Index: 90% Bullish.",
      "Node [Competitor Benchmarking]: NVDA superior ROIC vs AMD and Intel.",
      "Node [Decision Engine]: Recommendation: INVEST. Conviction: 92%."
    ]
  }
};

function lookupStock(query) {
  const upper = (query || "").toUpperCase().trim();
  if (FALLBACK[upper]) return FALLBACK[upper];
  const found = Object.keys(FALLBACK).find(k => FALLBACK[k].name.toUpperCase().includes(upper));
  return found ? FALLBACK[found] : null;
}

// ── LangGraph Nodes ───────────────────────────────────────────────────────────

async function nodeTickerExtractor(state) {
  const logs = [`[LANGCHAIN → tickerChain] Resolving ticker for: "${state.company}"`];
  try {
    if (!process.env.GROQ_API_KEY) throw new Error("No API key");
    const result = await tickerChain.invoke({ company: state.company });
    logs.push(`[LANGCHAIN → tickerChain] ✓ Resolved: ${result.ticker} (${result.name})`);
    return { ticker: result.ticker, name: result.name, sector: result.sector, industry: result.industry, logs };
  } catch (err) {
    console.error("[tickerChain] LangChain error, using fallback:", err.message);
    const stock = lookupStock(state.company) || FALLBACK.AAPL;
    logs.push(`[FALLBACK] Resolved: ${stock.ticker} (${stock.name})`);
    return { ticker: stock.ticker, name: stock.name, sector: stock.sector, industry: stock.industry, logs };
  }
}

async function nodeFinancialAnalyzer(state) {
  const logs = [`[LANGCHAIN → financialsChain] Scanning financials for ${state.ticker}...`];
  try {
    if (!process.env.GROQ_API_KEY) throw new Error("No API key");
    const result = await financialsChain.invoke({ ticker: state.ticker, name: state.name });
    logs.push(`[LANGCHAIN → financialsChain] ✓ Price: ${result.price}. Target: ${result.targetPrice}.`);
    return { price: result.price, targetPrice: result.targetPrice, financials: { metrics: result.metrics, chartData: result.chartData }, logs };
  } catch (err) {
    console.error("[financialsChain] LangChain error, using fallback:", err.message);
    const stock = lookupStock(state.ticker) || FALLBACK.AAPL;
    logs.push(`[FALLBACK] Operating margin: ${stock.financials.metrics[4].val}.`);
    return { price: stock.price, targetPrice: stock.targetPrice, financials: stock.financials, logs };
  }
}

async function nodeSentimentAnalyzer(state) {
  const logs = [`[LANGCHAIN → sentimentChain] Running news crawler for "${state.name}"...`];
  try {
    if (!process.env.GROQ_API_KEY) throw new Error("No API key");
    const result = await sentimentChain.invoke({ ticker: state.ticker, name: state.name });
    logs.push(`[LANGCHAIN → sentimentChain] ✓ Score: ${result.score}% (${result.label}).`);
    return { sentiment: result, logs };
  } catch (err) {
    console.error("[sentimentChain] LangChain error, using fallback:", err.message);
    const stock = lookupStock(state.ticker) || FALLBACK.AAPL;
    logs.push(`[FALLBACK] Score: ${stock.sentiment.score}% (${stock.sentiment.label}).`);
    return { sentiment: stock.sentiment, logs };
  }
}

async function nodeCompetitorBenchmarker(state) {
  const logs = [`[LANGCHAIN → competitorChain] Assembling peers in ${state.sector} sector...`];
  try {
    if (!process.env.GROQ_API_KEY) throw new Error("No API key");
    const result = await competitorChain.invoke({ ticker: state.ticker, name: state.name, sector: state.sector });
    logs.push(`[LANGCHAIN → competitorChain] ✓ Benchmarked ${state.ticker} against ${result.competitors.length - 1} peers.`);
    return { competitors: result.competitors, logs };
  } catch (err) {
    console.error("[competitorChain] LangChain error, using fallback:", err.message);
    const stock = lookupStock(state.ticker) || FALLBACK.AAPL;
    logs.push(`[FALLBACK] Competitor matrix loaded.`);
    return { competitors: stock.competitors, logs };
  }
}

async function nodeDecisionEngine(state) {
  const logs = [`[LANGCHAIN → decisionChain] Synthesizing verdict for ${state.ticker}...`];
  try {
    if (!process.env.GROQ_API_KEY) throw new Error("No API key");
    const result = await decisionChain.invoke({
      ticker: state.ticker, name: state.name, sector: state.sector,
      price: state.price, targetPrice: state.targetPrice,
      sentimentScore: state.sentiment?.score ?? 50
    });
    logs.push(`[LANGCHAIN → decisionChain] ✓ Verdict: ${result.verdict}. Conviction: ${result.conviction}%.`);
    return { verdict: result.verdict, conviction: result.conviction, thesis: result.thesis, swot: result.swot, logs };
  } catch (err) {
    console.error("[decisionChain] LangChain error, using fallback:", err.message);
    const stock = lookupStock(state.ticker) || FALLBACK.AAPL;
    logs.push(`[FALLBACK] Verdict: ${stock.verdict}. Conviction: ${stock.conviction}%.`);
    return { verdict: stock.verdict, conviction: stock.conviction, thesis: stock.thesis, swot: stock.swot, logs };
  }
}

// ── LangGraph State + Graph ───────────────────────────────────────────────────
const ResearchState = Annotation.Root({
  company:     Annotation(),
  ticker:      Annotation(),
  name:        Annotation(),
  sector:      Annotation(),
  industry:    Annotation(),
  price:       Annotation(),
  targetPrice: Annotation(),
  verdict:     Annotation(),
  conviction:  Annotation(),
  thesis:      Annotation(),
  financials:  Annotation(),
  sentiment:   Annotation(),
  competitors: Annotation(),
  swot:        Annotation(),
  logs: Annotation({ reducer: (x, y) => (x || []).concat(y), default: () => [] })
});

const researchAgent = new StateGraph(ResearchState)
  .addNode("tickerExtractor",       nodeTickerExtractor)
  .addNode("financialAnalyzer",     nodeFinancialAnalyzer)
  .addNode("sentimentAnalyzer",     nodeSentimentAnalyzer)
  .addNode("competitorBenchmarker", nodeCompetitorBenchmarker)
  .addNode("decisionEngine",        nodeDecisionEngine)
  .addEdge(START,                    "tickerExtractor")
  .addEdge("tickerExtractor",        "financialAnalyzer")
  .addEdge("financialAnalyzer",      "sentimentAnalyzer")
  .addEdge("sentimentAnalyzer",      "competitorBenchmarker")
  .addEdge("competitorBenchmarker",  "decisionEngine")
  .addEdge("decisionEngine",         END)
  .compile();

module.exports = { researchAgent };
