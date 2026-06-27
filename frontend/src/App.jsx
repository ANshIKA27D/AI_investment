import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, Sparkles, Terminal, TrendingUp, TrendingDown, 
  Newspaper, Percent, Layers, ShieldAlert, FileDown, 
  Clock, ArrowRight, CheckCircle2, Activity, ChevronRight, 
  HelpCircle, ThumbsUp, ThumbsDown, Info, MessageSquare, Send, X,
  ArrowLeftRight, Bell
} from 'lucide-react';
import './App.css';

// Dynamic API Base URL depending on local development or deployed production server
const API_BASE = typeof window !== 'undefined' && window.location.port === '5173' 
  ? 'http://localhost:3001' 
  : '';

// Rich Mock Database for popular stocks to ensure robust Simulated Mode
const MOCK_STOCKS = {
  AAPL: {
    ticker: 'AAPL',
    name: 'Apple Inc.',
    sector: 'Technology',
    industry: 'Consumer Electronics',
    price: '$214.32',
    targetPrice: '$260.00',
    verdict: 'INVEST',
    conviction: 88,
    thesis: 'Apple is positioned to capture massive value through its "Apple Intelligence" AI integration across its install base of over 2 billion active devices. High consumer loyalty, robust hardware-software integration, and a high-margin services segment provide strong downside protection, making it an excellent long-term investment despite short-term hardware cycles.',
    financials: {
      metrics: [
        { label: 'Market Cap', val: '$3.28T' },
        { label: 'P/E Ratio', val: '31.2' },
        { label: 'ROE', val: '154.3%' },
        { label: 'Gross Margin', val: '46.2%' },
        { label: 'Operating Margin', val: '30.7%' },
        { label: 'Debt to Equity', val: '1.45' },
        { label: 'Revenue Growth', val: '+6.1% YoY' },
        { label: 'Free Cash Flow', val: '$104.3B' }
      ],
      chartData: [
        { year: '2021', revenue: 365.8, netIncome: 94.6 },
        { year: '2022', revenue: 394.3, netIncome: 99.8 },
        { year: '2023', revenue: 383.2, netIncome: 96.9 },
        { year: '2024', revenue: 391.0, netIncome: 101.9 }
      ]
    },
    sentiment: {
      score: 82,
      label: 'Strongly Bullish',
      news: [
        {
          title: 'Apple Intelligence rollout expected to spark massive upgrade cycle in Q4',
          source: 'Bloomberg',
          time: '2 hours ago',
          sentiment: 'bullish',
          summary: 'Wall Street analysts are raising target prices as survey data indicates higher-than-expected consumer intent to upgrade to iPhone 16 models for AI features.'
        },
        {
          title: 'EU regulators fine Apple over App Store anti-steering practices',
          source: 'Reuters',
          time: '1 day ago',
          sentiment: 'bearish',
          summary: 'The European Commission announced a new antitrust fine. While financially negligible, it highlights ongoing regulatory headwind in Europe.'
        },
        {
          title: 'Services revenue grows 12%, offsetting minor iPad hardware declines',
          source: 'Wall Street Journal',
          time: '3 days ago',
          sentiment: 'bullish',
          summary: 'App Store subscriptions, Apple Pay, and iCloud storage demand continue to surge, driving consolidated gross margin to record highs.'
        }
      ]
    },
    competitors: [
      { ticker: 'AAPL', name: 'Apple Inc.', cap: '$3.28T', pe: '31.2', margin: '46.2%', growth: '6.1%', score: '88' },
      { ticker: 'MSFT', name: 'Microsoft Corp.', cap: '$3.15T', pe: '34.8', margin: '44.6%', growth: '11.8%', score: '90' },
      { ticker: 'GOOGL', name: 'Alphabet Inc.', cap: '$2.11T', pe: '22.4', margin: '57.4%', growth: '14.2%', score: '85' }
    ],
    swot: {
      strengths: ['Unrivaled consumer brand loyalty and ecosystem lock-in.', 'High-margin, recurring Services division growth.', 'Stellar balance sheet with over $100B in annual free cash flow.'],
      weaknesses: ['Heavy reliance on the iPhone (approx. 50% of total revenue).', 'Slowing growth in key hardware markets like China.'],
      opportunities: ['On-device AI integration (Apple Intelligence) driving a multi-year hardware upgrade supercycle.', 'Expansion into augmented reality (Vision Pro) and health-tech.'],
      threats: ['Aggressive global regulatory scrutiny (EU DMA, US DOJ antitrust).', 'Geopolitical supply chain risks, specifically relations around Taiwan and China assembly operations.']
    },
    logs: [
      'Initializing AURA Research Agent for company: Apple Inc.',
      'Configuring nodes and loading ticker RESOLUTION map...',
      'Node [Ticker Extraction]: Found AAPL listed on NASDAQ.',
      'Node [Ticker Extraction]: Successfully pulled company metadata. Industry: Consumer Electronics. Sector: Technology.',
      'Node [Financial Statement Analysis]: Querying 10-K and 10-Q reports for 2021-2024...',
      'Node [Financial Statement Analysis]: Revenue analysis: CAGR of +2.2% over last 3 years. Margin expansion verified (+140 bps).',
      'Node [Financial Statement Analysis]: Net Debt check: $65B. Free Cash Flow coverage is outstanding at 1.6x debt.',
      'Node [Sentiment Scraper]: Scraping Google News & RSS financial feeds for "AAPL" / "Apple Intelligence"...',
      'Node [Sentiment Scraper]: Processed 15 articles. Sentiment Index: 82% Bullish. Key driver: On-device AI upgrades.',
      'Node [Competitor Benchmarking]: Comparing AAPL against MSFT, GOOGL...',
      'Node [Competitor Benchmarking]: P/E premium is 12% above 5-year average, but justified by services growth.',
      'Node [Decision Engine]: Analyzing SWOT risks. Weighted regulatory threats against AI potential.',
      'Node [Decision Engine]: Final synthesis complete. Action recommendation: INVEST. Conviction: 88%.'
    ]
  },
  TSLA: {
    ticker: 'TSLA',
    name: 'Tesla Inc.',
    sector: 'Consumer Cyclical',
    industry: 'Auto Manufacturers',
    price: '$187.44',
    targetPrice: '$165.00',
    verdict: 'PASS',
    conviction: 58,
    thesis: 'Tesla is currently facing a period of margin compression and slowing EV adoption worldwide. While its autonomous driving (FSD) and energy storage businesses hold immense long-term value, the automotive core is being commoditized by low-cost Chinese competitors (BYD, Xiaomi). Valuation remains priced as a hyper-growth tech firm, creating an unfavorable risk-reward profile at current prices.',
    financials: {
      metrics: [
        { label: 'Market Cap', val: '$598B' },
        { label: 'P/E Ratio', val: '56.4' },
        { label: 'ROE', val: '18.2%' },
        { label: 'Gross Margin', val: '17.4%' },
        { label: 'Operating Margin', val: '5.6%' },
        { label: 'Debt to Equity', val: '0.08' },
        { label: 'Revenue Growth', val: '-1.8% YoY' },
        { label: 'Free Cash Flow', val: '$1.2B' }
      ],
      chartData: [
        { year: '2021', revenue: 53.8, netIncome: 5.6 },
        { year: '2022', revenue: 81.5, netIncome: 12.6 },
        { year: '2023', revenue: 96.8, netIncome: 15.0 },
        { year: '2024', revenue: 95.1, netIncome: 9.8 }
      ]
    },
    sentiment: {
      score: 46,
      label: 'Slightly Bearish',
      news: [
        {
          title: 'Tesla EV deliveries miss quarterly targets amid weak European demand',
          source: 'Reuters',
          time: '3 hours ago',
          sentiment: 'bearish',
          summary: 'Global vehicle deliveries dropped 4.8% YoY, signaling domestic and international headwind in EV consumer interest.'
        },
        {
          title: 'Energy storage deployments hit record 9.4 GWh in recent quarter',
          source: 'TechCrunch',
          time: '12 hours ago',
          sentiment: 'bullish',
          summary: 'Tesla Megapack and Powerwall sales continue to grow exponentially, serving as a bright spot in the consolidated financials.'
        },
        {
          title: 'Automotive gross margin drops below 15% excluding regulatory credits',
          source: 'MarketWatch',
          time: '2 days ago',
          sentiment: 'bearish',
          summary: 'Repeated price cuts across Model Y and Model 3 have severely eroded automotive margins, raising questions on long-term profitability.'
        }
      ]
    },
    competitors: [
      { ticker: 'TSLA', name: 'Tesla Inc.', cap: '$598B', pe: '56.4', margin: '17.4%', growth: '-1.8%', score: '58' },
      { ticker: 'BYDDY', name: 'BYD Co. Ltd.', cap: '$89B', pe: '18.1', margin: '20.2%', growth: '22.4%', score: '82' },
      { ticker: 'TM', name: 'Toyota Motor', cap: '$240B', pe: '7.8', margin: '12.8%', growth: '14.1%', score: '74' }
    ],
    swot: {
      strengths: ['Undisputed global brand synonym for electric vehicles.', 'Industry-leading battery supply chain and manufacturing efficiency.', 'Rapidly growing energy storage division.'],
      weaknesses: ['Declining automotive profit margins due to price-war strategies.', 'Delayed roadmap on affordable vehicle models (Model 2).', 'Concentration of decision making and key-man risk around Elon Musk.'],
      opportunities: ['Full Self-Driving (FSD) software licensing to other auto companies.', 'Robotaxi fleet launch driving high-margin software revenues.'],
      threats: ['Intense pricing pressure from Chinese auto manufacturers.', 'Slowing global government subsidies and consumer pivot to hybrids.']
    },
    logs: [
      'Initializing AURA Research Agent for company: Tesla Inc.',
      'Configuring nodes and loading ticker RESOLUTION map...',
      'Node [Ticker Extraction]: Found TSLA listed on NASDAQ.',
      'Node [Ticker Extraction]: Successfully pulled company metadata. Industry: Auto Manufacturers. Sector: Consumer Cyclical.',
      'Node [Financial Statement Analysis]: Querying 10-K and 10-Q reports for 2021-2024...',
      'Node [Financial Statement Analysis]: Auto gross margin compression: dropped from 29% in 2021 to 17.4% in 2024.',
      'Node [Financial Statement Analysis]: Operating Cash flow is positive, but Capex spending has constrained free cash flow.',
      'Node [Sentiment Scraper]: Scraping Google News & RSS financial feeds for "TSLA" / "EV pricing"...',
      'Node [Sentiment Scraper]: Processed 22 articles. Sentiment Index: 46% Bearish. Drivers: Deliveries miss, margin erosion.',
      'Node [Competitor Benchmarking]: Comparing TSLA against BYD, Toyota...',
      'Node [Competitor Benchmarking]: P/E valuation at 56.4x is a severe premium relative to peers (BYD at 18x).',
      'Node [Decision Engine]: Analyzing SWOT risks. Weighting autonomous potential against near-term auto cash flow decline.',
      'Node [Decision Engine]: Final synthesis complete. Action recommendation: PASS. Conviction: 58%.'
    ]
  },
  NVDA: {
    ticker: 'NVDA',
    name: 'NVIDIA Corporation',
    sector: 'Technology',
    industry: 'Semiconductors',
    price: '$126.85',
    targetPrice: '$155.00',
    verdict: 'INVEST',
    conviction: 92,
    thesis: 'NVIDIA possesses a near-monopoly (~90% market share) in AI datacenter accelerators and has established a robust software moat with CUDA. With hyperscalers (Microsoft, Meta, Google, AWS) locked in an AI infrastructure arms race, demand for Blackwell and H200 chips remains supply-constrained rather than demand-constrained, leading to unprecedented operating margins and top-line growth.',
    financials: {
      metrics: [
        { label: 'Market Cap', val: '$3.11T' },
        { label: 'P/E Ratio', val: '64.2' },
        { label: 'ROE', val: '115.6%' },
        { label: 'Gross Margin', val: '75.1%' },
        { label: 'Operating Margin', val: '62.4%' },
        { label: 'Debt to Equity', val: '0.12' },
        { label: 'Revenue Growth', val: '+262% YoY' },
        { label: 'Free Cash Flow', val: '$39.2B' }
      ],
      chartData: [
        { year: '2021', revenue: 26.9, netIncome: 9.7 },
        { year: '2022', revenue: 27.0, netIncome: 4.4 },
        { year: '2023', revenue: 60.9, netIncome: 29.8 },
        { year: '2024', revenue: 96.3, netIncome: 53.0 }
      ]
    },
    sentiment: {
      score: 90,
      label: 'Extremely Bullish',
      news: [
        {
          title: 'Demand for new Blackwell chips "insane", says CEO Jensen Huang',
          source: 'CNBC',
          time: '5 hours ago',
          sentiment: 'bullish',
          summary: 'Blackwell production is fully booked for the next 12 months, signaling continued high revenues through 2025.'
        },
        {
          title: 'ASML shipments indicate solid bookings for advanced lithography machines',
          source: 'Financial Times',
          time: '1 day ago',
          sentiment: 'bullish',
          summary: 'Strong equipment spending by TSMC ensures Nvidia supply partner capacity continues to expand.'
        },
        {
          title: 'FTC opens preliminary antitrust inquiry into AI chip sales bundling',
          source: 'The Verge',
          time: '5 days ago',
          sentiment: 'neutral',
          summary: 'Regulators are looking into allegations that Nvidia bundles hardware and software to lock out AMD. Unlikely to impact near-term earnings.'
        }
      ]
    },
    competitors: [
      { ticker: 'NVDA', name: 'NVIDIA Corp.', cap: '$3.11T', pe: '64.2', margin: '75.1%', growth: '262%', score: '92' },
      { ticker: 'AMD', name: 'Advanced Micro Devices', cap: '$255B', pe: '124.5', margin: '46.8%', growth: '18.4%', score: '78' },
      { ticker: 'INTC', name: 'Intel Corporation', cap: '$85B', pe: '95.0', margin: '40.2%', growth: '-0.8%', score: '42' }
    ],
    swot: {
      strengths: ['Massive hardware leadership in AI/ML training & inference.', 'CUDA software environment locks in developers and limits AMD switching.', 'Industry-leading gross margin (>75%) providing superior profitability.'],
      weaknesses: ['Highly concentrated supply chain (reliance on TSMC foundry and packaging).', 'Revenue relies heavily on capital budgets of a few tech conglomerates.'],
      opportunities: ['Blackwell architectural launch driving higher average selling prices.', 'Expansion into proprietary cloud services (DGX Cloud) and robotics.'],
      threats: ['Hyperscalers designing custom silicon (TPUs, custom chips).', 'Export control restrictions on shipments to China and restricted markets.']
    },
    logs: [
      'Initializing AURA Research Agent for company: NVIDIA Corporation',
      'Configuring nodes and loading ticker RESOLUTION map...',
      'Node [Ticker Extraction]: Found NVDA listed on NASDAQ.',
      'Node [Ticker Extraction]: Successfully pulled company metadata. Industry: Semiconductors. Sector: Technology.',
      'Node [Financial Statement Analysis]: Querying 10-K and 10-Q reports for 2021-2024...',
      'Node [Financial Statement Analysis]: Revenue growth is extraordinary: +262% YoY. Operating margins hit a record 62.4%.',
      'Node [Financial Statement Analysis]: Net cash position is strong. High capital expenditure ROI.',
      'Node [Sentiment Scraper]: Scraping Google News & RSS financial feeds for "NVDA" / "Blackwell demand"...',
      'Node [Sentiment Scraper]: Processed 30 articles. Sentiment Index: 90% Bullish. Key driver: Jensen Huang comments on Blackwell.',
      'Node [Competitor Benchmarking]: Comparing NVDA against AMD, Intel...',
      'Node [Competitor Benchmarking]: NVDA enjoys superior return on capital and margins, commanding its premium P/E.',
      'Node [Decision Engine]: Analyzing SWOT risks. Balanced customer concentration against short-term demand durability.',
      'Node [Decision Engine]: Final synthesis complete. Action recommendation: INVEST. Conviction: 92%.'
    ]
  },
  MSFT: {
    ticker: 'MSFT',
    name: 'Microsoft Corporation',
    sector: 'Technology',
    industry: 'Software - Infrastructure',
    price: '$420.55',
    targetPrice: '$500.00',
    verdict: 'INVEST',
    conviction: 90,
    thesis: 'Microsoft represents the lowest-risk vehicle to capitalize on the enterprise AI transition. By combining its massive Office 365 and Windows user base with OpenAI models, Copilot features have immediately monetized AI. Concurrently, Azure Cloud continues to outpace rivals, securing multi-billion dollar enterprise migrations, forming a highly predictable high-margin business.',
    financials: {
      metrics: [
        { label: 'Market Cap', val: '$3.15T' },
        { label: 'P/E Ratio', val: '34.8' },
        { label: 'ROE', val: '38.4%' },
        { label: 'Gross Margin', val: '69.8%' },
        { label: 'Operating Margin', val: '44.6%' },
        { label: 'Debt to Equity', val: '0.42' },
        { label: 'Revenue Growth', val: '+11.8% YoY' },
        { label: 'Free Cash Flow', val: '$74.1B' }
      ],
      chartData: [
        { year: '2021', revenue: 168.1, netIncome: 61.3 },
        { year: '2022', revenue: 198.3, netIncome: 72.7 },
        { year: '2023', revenue: 211.9, netIncome: 72.4 },
        { year: '2024', revenue: 245.1, netIncome: 88.1 }
      ]
    },
    sentiment: {
      score: 86,
      label: 'Strongly Bullish',
      news: [
        {
          title: 'Azure growth outpaces AWS and Google Cloud in latest earnings report',
          source: 'Bloomberg',
          time: '4 hours ago',
          sentiment: 'bullish',
          summary: 'Azure revenue grew 29% CC, with 12 points attributed directly to enterprise demand for AI training and inference.'
        },
        {
          title: 'Microsoft Copilot pricing hikes boost Office ARPU by 15%',
          source: 'Wall Street Journal',
          time: '1 day ago',
          sentiment: 'bullish',
          summary: 'Corporate adoption of the $30/month Copilot add-on is driving average revenue per user higher across enterprise tiers.'
        },
        {
          title: 'Antitrust regulators investigate OpenAI partnership terms',
          source: 'FT',
          time: '3 days ago',
          sentiment: 'bearish',
          summary: 'The UK CMA and US FTC are examining whether Microsoft’s $13B investment in OpenAI functions as a de facto merger.'
        }
      ]
    },
    competitors: [
      { ticker: 'MSFT', name: 'Microsoft Corp.', cap: '$3.15T', pe: '34.8', margin: '44.6%', growth: '11.8%', score: '90' },
      { ticker: 'AAPL', name: 'Apple Inc.', cap: '$3.28T', pe: '31.2', margin: '46.2%', growth: '6.1%', score: '88' },
      { ticker: 'AMZN', name: 'Amazon.com Inc.', cap: '$1.92T', pe: '42.1', margin: '18.4%', growth: '12.5%', score: '84' }
    ],
    swot: {
      strengths: ['Massive enterprise footprint and distribution channels.', 'Azure cloud momentum powered by OpenAI infrastructure exclusivity.', 'Diversified portfolio (Cloud, Office, Gaming, LinkedIn).'],
      weaknesses: ['Extremely high capital expenditures ($50B+ annually) required to build AI data centers.', 'Complexity in integrating old software suites with new AI services.'],
      opportunities: ['Expansion of Copilot into small and medium businesses.', 'Gaming revenue integration following Activision Blizzard acquisition.'],
      threats: ['Antitrust challenges regarding AI exclusivity and cloud licenses.', 'Cybersecurity breaches targeting Azure active directory systems.']
    },
    logs: [
      'Initializing AURA Research Agent for company: Microsoft Corporation',
      'Configuring nodes and loading ticker RESOLUTION map...',
      'Node [Ticker Extraction]: Found MSFT listed on NASDAQ.',
      'Node [Ticker Extraction]: Successfully pulled company metadata. Industry: Software - Infrastructure. Sector: Technology.',
      'Node [Financial Statement Analysis]: Querying 10-K and 10-Q reports for 2021-2024...',
      'Node [Financial Statement Analysis]: Revenue analysis: stable double-digit growth. Operating margin holds steady at ~44.6%.',
      'Node [Financial Statement Analysis]: Capex run rate check: $14B this quarter. High, but supported by cloud backlogs.',
      'Node [Sentiment Scraper]: Scraping Google News & RSS financial feeds for "MSFT" / "Azure AI"...',
      'Node [Sentiment Scraper]: Processed 25 articles. Sentiment Index: 86% Bullish. Key driver: Azure outperforming AWS.',
      'Node [Competitor Benchmarking]: Comparing MSFT against AAPL, AMZN...',
      'Node [Competitor Benchmarking]: MSFT has higher operating cash flow stability than Apple, justifying higher multiple.',
      'Node [Decision Engine]: Analyzing SWOT risks. Weighting capital expenditure returns against monopoly headwinds.',
      'Node [Decision Engine]: Final synthesis complete. Action recommendation: INVEST. Conviction: 90%.'
    ]
  },
  NFLX: {
    ticker: 'NFLX',
    name: 'Netflix Inc.',
    sector: 'Services',
    industry: 'Entertainment',
    price: '$660.10',
    targetPrice: '$610.00',
    verdict: 'PASS',
    conviction: 62,
    thesis: 'Netflix has navigated the streaming wars effectively and is now generating positive free cash flow. However, domestic subscriber growth is plateauing and password-sharing monetization benefits have peaked. Trading at a premium multiple, the business faces massive pressure to spend heavily on live events (NFL, WWE) and gaming, which may compress margins and increase execution risk.',
    financials: {
      metrics: [
        { label: 'Market Cap', val: '$285B' },
        { label: 'P/E Ratio', val: '41.5' },
        { label: 'ROE', val: '28.6%' },
        { label: 'Gross Margin', val: '43.2%' },
        { label: 'Operating Margin', val: '22.1%' },
        { label: 'Debt to Equity', val: '0.68' },
        { label: 'Revenue Growth', val: '+15.2% YoY' },
        { label: 'Free Cash Flow', val: '$6.5B' }
      ],
      chartData: [
        { year: '2021', revenue: 29.7, netIncome: 5.1 },
        { year: '2022', revenue: 31.6, netIncome: 4.5 },
        { year: '2023', revenue: 33.7, netIncome: 5.4 },
        { year: '2024', revenue: 38.3, netIncome: 7.2 }
      ]
    },
    sentiment: {
      score: 55,
      label: 'Neutral / Mixed',
      news: [
        {
          title: 'Netflix expands ad-supported plan, hitting 40M active users',
          source: 'Variety',
          time: '6 hours ago',
          sentiment: 'bullish',
          summary: 'The cheaper ad-supported tier continues to capture price-sensitive subscribers, bolstering long-term advertising revenue.'
        },
        {
          title: 'Content budget to expand to $17B in 2025 as live programming scales',
          source: 'Hollywood Reporter',
          time: '1 day ago',
          sentiment: 'bearish',
          summary: 'Heavy cash commitments to secure live sports and events raise concerns about structural free cash flow expansion.'
        },
        {
          title: 'Analyst downgrades Netflix on limited password-sharing tailwinds',
          source: 'Seeking Alpha',
          time: '4 days ago',
          sentiment: 'bearish',
          summary: 'BofA analysts warned that the low-hanging fruit of account monetization has been harvested, risking slower growth.'
        }
      ]
    },
    competitors: [
      { ticker: 'NFLX', name: 'Netflix Inc.', cap: '$285B', pe: '41.5', margin: '43.2%', growth: '15.2%', score: '62' },
      { ticker: 'DIS', name: 'Walt Disney Co.', cap: '$178B', pe: '68.0', margin: '34.8%', growth: '5.4%', score: '70' },
      { ticker: 'WBD', name: 'Warner Bros. Discovery', cap: '$18B', pe: 'N/A', margin: '38.2%', growth: '-4.6%', score: '38' }
    ],
    swot: {
      strengths: ['Global scale advantage with 270M+ subscribers.', 'High engagement and culture-defining content production.', 'Transitioned successfully to positive free cash flow generation.'],
      weaknesses: ['Substantial cash outlay required for content production and licensing.', 'High dependency on subscription price increases to drive growth in mature markets.'],
      opportunities: ['Expansion into live sports (NFL, WWE Raw) and ad sales monetization.', 'Acquiring mobile gaming assets to boost subscriber retention.'],
      threats: ['Intense content bidding wars (Amazon, Apple, Disney).', 'Subscriber churn due to inflation and household budget constraints.']
    },
    logs: [
      'Initializing AURA Research Agent for company: Netflix Inc.',
      'Configuring nodes and loading ticker RESOLUTION map...',
      'Node [Ticker Extraction]: Found NFLX listed on NASDAQ.',
      'Node [Ticker Extraction]: Successfully pulled company metadata. Industry: Entertainment. Sector: Services.',
      'Node [Financial Statement Analysis]: Querying 10-K and 10-Q reports for 2021-2024...',
      'Node [Financial Statement Analysis]: Revenue growth accelerated via ad tiers, but margins are under pressure due to sports spending.',
      'Node [Financial Statement Analysis]: Debt levels: $14B. Free Cash Flow coverage is stable at 0.45x debt.',
      'Node [Sentiment Scraper]: Scraping Google News & RSS financial feeds for "NFLX" / "Ad-tier growth"...',
      'Node [Sentiment Scraper]: Processed 18 articles. Sentiment Index: 55% Neutral. Driver: password crackdown peaking.',
      'Node [Competitor Benchmarking]: Comparing NFLX against DIS, WBD...',
      'Node [Competitor Benchmarking]: Netflix commands a severe premium over Disney on ROIC metrics, but P/E of 41.5x leaves little margin for error.',
      'Node [Decision Engine]: Analyzing SWOT risks. Weighting live-event margins against ad-supported growth tailwinds.',
      'Node [Decision Engine]: Final synthesis complete. Action recommendation: PASS. Conviction: 62.'
    ]
  }
};

const ANALYST_ALERTS = [
  { ticker: 'NVDA', analyst: 'Goldman Sachs', action: 'UPGRADE', rating: 'Buy', target: '$150', date: 'Just now', color: 'green' },
  { ticker: 'AAPL', analyst: 'Morgan Stanley', action: 'TARGET HIKE', rating: 'Overweight', target: '$260', date: '2 hrs ago', color: 'cyan' },
  { ticker: 'TSLA', analyst: 'Barclays', action: 'DOWNGRADE', rating: 'Underweight', target: '$180', date: '5 hrs ago', color: 'rose' },
  { ticker: 'MSFT', analyst: 'JPMorgan', action: 'REITERATE', rating: 'Overweight', target: '$500', date: '1 day ago', color: 'amber' },
];

function App() {
  const [query, setQuery] = useState('');
  const [deepResearch, setDeepResearch] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  const [consoleLogs, setConsoleLogs] = useState([]);
  const [result, setResult] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [history, setHistory] = useState([
    { ticker: 'AAPL', name: 'Apple Inc.', verdict: 'INVEST' },
    { ticker: 'TSLA', name: 'Tesla Inc.', verdict: 'PASS' },
    { ticker: 'NVDA', name: 'NVIDIA Corporation', verdict: 'INVEST' }
  ]);
  
  const consoleEndRef = useRef(null);
  const chatEndRef = useRef(null);

  // Chatbot states
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', text: "Hello! I'm AURA, your AI investment assistant. Ask me anything about our analysis, SWOT quadrants, financials, or valuation ratios!" }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [compareStock, setCompareStock] = useState('');

  // Auto-scroll the log console to bottom when logs update
  useEffect(() => {
    if (consoleEndRef.current) {
      consoleEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [consoleLogs]);

  // Auto-scroll chat history to bottom
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, chatLoading, chatOpen]);

  // Send message to chatbot endpoint
  const handleSendMessage = async (textToSend = chatInput) => {
    const text = (textToSend || '').trim();
    if (!text) return;

    setChatInput('');
    setMessages(prev => [...prev, { role: 'user', text }]);
    setChatLoading(true);

    try {
      const response = await fetch(`${API_BASE}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          currentStockData: result
        })
      });

      if (!response.ok) {
        throw new Error('Chat API returned error');
      }

      const data = await response.json();
      setMessages(prev => [...prev, { role: 'assistant', text: data.reply }]);
    } catch (err) {
      console.error('Chatbot error:', err);
      setMessages(prev => [...prev, { role: 'assistant', text: "Sorry, I couldn't reach the AI assistant. Please check if the backend server is running on port 3001." }]);
    } finally {
      setChatLoading(false);
    }
  };

  // Handle Tag click helper
  const handleTagClick = (ticker) => {
    setQuery(ticker);
    startAnalysis(ticker);
  };

  // Run the analysis process
  const startAnalysis = async (searchQuery = query) => {
    const targetQuery = (searchQuery || '').trim();
    if (!targetQuery) return;

    setLoading(true);
    setResult(null);
    setCurrentStepIndex(0);
    setConsoleLogs([]);
    setActiveTab('overview');

    // Steps to process
    const steps = [
      { label: 'Ticker Resolution', duration: 1200 },
      { label: 'Financial Deep Dive', duration: 1600 },
      { label: 'Sentiment Scraping', duration: 1800 },
      { label: 'Competitor Matrix', duration: 1200 },
      { label: 'Decision Node', duration: 1400 }
    ];

    // Determine target ticker
    const upperQuery = targetQuery.toUpperCase();
    let matchedTicker = '';
    
    if (MOCK_STOCKS[upperQuery]) {
      matchedTicker = upperQuery;
    } else {
      // Fuzzy search mock database
      const found = Object.keys(MOCK_STOCKS).find(
        k => MOCK_STOCKS[k].name.toUpperCase().includes(upperQuery)
      );
      matchedTicker = found || 'AAPL'; // Default to AAPL if completely unknown for simulated purposes
    }

    const stockData = MOCK_STOCKS[matchedTicker];
    const customizedLogs = stockData.logs;

    if (deepResearch) {
      // Dispatch API request in parallel
      const apiPromise = fetch(`${API_BASE}/api/research?company=${encodeURIComponent(targetQuery)}`)
        .then(async (res) => {
          if (!res.ok) {
            throw new Error('Backend failed or not running.');
          }
          return res.json();
        });

      try {
        addLogLine('[SYSTEM] Connecting to backend Express research server...', 'system');
        
        // Animate the pipeline steps in parallel
        for (let i = 0; i < steps.length; i++) {
          setCurrentStepIndex(i);
          
          if (i === 0) {
            addLogLine(`[TICKER] Initiating ticker resolution for query: "${targetQuery}"`);
          } else if (i === 1) {
            addLogLine(`[FINANCIALS] Scanning SEC filing structures...`);
          } else if (i === 2) {
            addLogLine(`[SENTIMENT] Crawling news channels & social boards...`);
          } else if (i === 3) {
            addLogLine(`[COMPETITORS] Assembling industry peers benchmarking matrix...`);
          } else if (i === 4) {
            addLogLine(`[DECISION] Synthesizing SWOT risks & final decision...`);
          }
          
          await new Promise(r => setTimeout(r, steps[i].duration));
        }
        
        addLogLine('[DECISION] Retrieving final synthesized AI data...', 'system');
        const data = await apiPromise;
        
        // Populate any extra backend logs if available
        if (data.logs && data.logs.length > 0) {
          data.logs.forEach(log => {
            if (!consoleLogs.some(existing => existing.text === log)) {
              addLogLine(log);
            }
          });
        }
        
        addLogLine('[SUCCESS] Analysis completed successfully!', 'success');
        setResult(data);
        updateHistory(data.ticker, data.name, data.verdict);
        setLoading(false);
      } catch (err) {
        addLogLine(`[WARNING] ${err.message}`, 'system');
        addLogLine('[SYSTEM] Launching High-Fidelity Local simulation...', 'system');
        runLocalSimulation(stockData, steps, matchedTicker);
      }
    } else {
      // Simulated Mode
      runLocalSimulation(stockData, steps, matchedTicker);
    }
  };

  const runLocalSimulation = async (stockData, steps, matchedTicker) => {
    let logCounter = 0;
    
    for (let i = 0; i < steps.length; i++) {
      setCurrentStepIndex(i);
      
      // Feed logs for this node
      const logsForStep = Math.ceil(stockData.logs.length / steps.length);
      for (let j = 0; j < logsForStep; j++) {
        if (logCounter < stockData.logs.length) {
          addLogLine(stockData.logs[logCounter]);
          logCounter++;
        }
      }
      
      await new Promise(r => setTimeout(r, steps[i].duration));
    }

    // Add extra dynamic log lines for unique/unknown queries to make it feel extremely alive!
    const queryUpper = query.toUpperCase();
    if (!MOCK_STOCKS[queryUpper] && queryUpper !== '') {
      addLogLine(`[DECISION] Fictional/Uncached ticker generated: Resolving metrics for ${queryUpper}...`);
      addLogLine(`[DECISION] Synthesized balance sheet analysis for ${queryUpper} Corp. Recommendation: INVEST.`);
    }

    addLogLine('[SUCCESS] Research synthesis finished. Loading Dashboard.', 'success');
    
    // If it's a completely custom stock name, construct a dynamically generated profile
    if (!MOCK_STOCKS[queryUpper] && queryUpper !== '') {
      const generatedStock = generateDynamicStock(query);
      setResult(generatedStock);
      updateHistory(generatedStock.ticker, generatedStock.name, generatedStock.verdict);
    } else {
      setResult(stockData);
      updateHistory(stockData.ticker, stockData.name, stockData.verdict);
    }
    
    setLoading(false);
  };

  // Helper to generate generic company if user searches anything else
  const generateDynamicStock = (name) => {
    const cleanName = name.trim();
    const ticker = cleanName.substring(0, 4).toUpperCase();
    const isTech = cleanName.length % 2 === 0;
    const verdict = isTech ? 'INVEST' : 'PASS';
    const conviction = 60 + (cleanName.length * 3) % 36;
    const targetVal = isTech ? 240 : 85;

    return {
      ticker: ticker,
      name: cleanName.includes(' ') ? cleanName : `${cleanName} Technologies`,
      sector: isTech ? 'Technology' : 'Industrial Goods',
      industry: isTech ? 'Software Application' : 'Manufacturing',
      price: `$${targetVal - 15}.50`,
      targetPrice: `$${targetVal}.00`,
      verdict: verdict,
      conviction: conviction,
      thesis: `${cleanName} exhibits strong product indicators in its core sector. Our synthesis shows ${verdict === 'INVEST' ? 'favorable growth tailwinds and strong operating cashflow margins' : 'high execution headwinds and overvalued metrics relative to peers'}. We recommend a ${verdict === 'INVEST' ? 'Buy stance with moderate capital deployment' : 'Hold or Pass stance until current valuation multiple contracts'}.`,
      financials: {
        metrics: [
          { label: 'Market Cap', val: `$${(conviction * 2.1).toFixed(1)}B` },
          { label: 'P/E Ratio', val: isTech ? '34.2' : '15.6' },
          { label: 'ROE', val: '24.1%' },
          { label: 'Gross Margin', val: isTech ? '62.4%' : '31.2%' },
          { label: 'Operating Margin', val: isTech ? '22.8%' : '8.9%' },
          { label: 'Debt to Equity', val: '0.34' },
          { label: 'Revenue Growth', val: isTech ? '+14.2% YoY' : '+3.1% YoY' },
          { label: 'Free Cash Flow', val: `$${(conviction / 10).toFixed(1)}B` }
        ],
        chartData: [
          { year: '2021', revenue: 10.5, netIncome: 1.2 },
          { year: '2022', revenue: 12.8, netIncome: 1.5 },
          { year: '2023', revenue: 16.2, netIncome: 2.1 },
          { year: '2024', revenue: 18.5, netIncome: 2.6 }
        ]
      },
      sentiment: {
        score: conviction,
        label: conviction > 75 ? 'Strongly Bullish' : conviction > 50 ? 'Neutral / Positive' : 'Bearish',
        news: [
          {
            title: `${cleanName} expands market footprint with new commercial pilot contracts`,
            source: 'Reuters',
            time: '4 hours ago',
            sentiment: 'bullish',
            summary: 'The new multi-year enterprise contracts validate product-market fit and ensure revenue predictability next year.'
          },
          {
            title: `Industry supply headwinds raise cost concerns for ${cleanName}`,
            source: 'Bloomberg',
            time: '1 day ago',
            sentiment: 'bearish',
            summary: 'Logistical bottlenecks and pricing constraints could temporarily compress gross margin expansion.'
          }
        ]
      },
      competitors: [
        { ticker: ticker, name: cleanName, cap: `$${(conviction * 2.1).toFixed(1)}B`, pe: isTech ? '34.2' : '15.6', margin: isTech ? '62.4%' : '31.2%', growth: isTech ? '14.2%' : '3.1%', score: conviction },
        { ticker: 'COMP1', name: 'Apex Peer Corp', cap: `$${(conviction * 1.8).toFixed(1)}B`, pe: isTech ? '41.1' : '18.2', margin: '42.1%', growth: '8.4%', score: '72' },
        { ticker: 'COMP2', name: 'Nova Global', cap: `$${(conviction * 2.5).toFixed(1)}B`, pe: isTech ? '28.5' : '14.0', margin: '38.4%', growth: '11.0%', score: '68' }
      ],
      swot: {
        strengths: [`Agile business layout and high product customizability.`, `Low debt leverage and high liquidity coverage.`],
        weaknesses: [`High marketing burn rates to acquire regional accounts.`, `Limited proprietary patent protection compared to legacy giants.`],
        opportunities: [`Expansion into European and Asian distribution channels.`, `Leveraging modern automated operations to reduce administrative costs.`],
        threats: [`Rapid technical obsolescence in core service features.`, `Aggressive entry of consolidated peers offering bundled services.`]
      },
      logs: []
    };
  };

  // ── Markdown renderer for chatbot messages ────────────────────────────
  const renderMarkdown = (text) => {
    if (!text) return null;
    const lines = text.split('\n');
    return lines.map((line, i) => {
      // Parse inline: **bold** and *italic*
      const renderInline = (str) => {
        const parts = str.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
        return parts.map((part, j) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={j} style={{ color: '#fff', fontWeight: 700 }}>{part.slice(2, -2)}</strong>;
          }
          if (part.startsWith('*') && part.endsWith('*')) {
            return <em key={j} style={{ color: 'var(--neon-cyan)' }}>{part.slice(1, -1)}</em>;
          }
          return <span key={j}>{part}</span>;
        });
      };

      if (line.startsWith('### ')) {
        return <div key={i} style={{ fontWeight: 700, fontSize: '12.5px', color: 'var(--neon-cyan)', marginBottom: '6px', marginTop: i > 0 ? '10px' : 0, letterSpacing: '0.3px' }}>{renderInline(line.slice(4))}</div>;
      }
      if (line.startsWith('## ')) {
        return <div key={i} style={{ fontWeight: 700, fontSize: '13px', color: '#fff', marginBottom: '6px', marginTop: i > 0 ? '10px' : 0 }}>{renderInline(line.slice(3))}</div>;
      }
      if (line.startsWith('# ')) {
        return <div key={i} style={{ fontWeight: 800, fontSize: '14px', color: '#fff', marginBottom: '8px', marginTop: i > 0 ? '12px' : 0 }}>{renderInline(line.slice(2))}</div>;
      }
      if (/^\d+\.\s/.test(line)) {
        return <div key={i} style={{ display: 'flex', gap: '6px', marginBottom: '4px', paddingLeft: '2px' }}><span style={{ color: 'var(--neon-cyan)', fontWeight: 700, flexShrink: 0 }}>{line.match(/^\d+/)[0]}.</span><span>{renderInline(line.replace(/^\d+\.\s/, ''))}</span></div>;
      }
      if (line.startsWith('- ') || line.startsWith('• ')) {
        return <div key={i} style={{ display: 'flex', gap: '6px', marginBottom: '4px', paddingLeft: '2px' }}><span style={{ color: 'var(--neon-cyan)', flexShrink: 0 }}>•</span><span>{renderInline(line.replace(/^[-•]\s/, ''))}</span></div>;
      }
      if (line.trim() === '') {
        return <div key={i} style={{ height: '6px' }} />;
      }
      return <div key={i} style={{ marginBottom: '2px', lineHeight: 1.5 }}>{renderInline(line)}</div>;
    });
  };

  const addLogLine = (text, type = 'normal') => {
    const timestamp = new Date().toLocaleTimeString();
    setConsoleLogs(prev => [...prev, { time: timestamp, text, type }]);
  };

  const updateHistory = (ticker, name, verdict) => {
    setHistory(prev => {
      // Avoid duplicate tickers
      const filtered = prev.filter(item => item.ticker !== ticker);
      return [{ ticker, name, verdict }, ...filtered].slice(0, 7);
    });
  };

  // Helper to draw clean SVG charts for 100% React 19 compatibility
  const renderSVGChart = (chartData) => {
    if (!chartData || chartData.length === 0) return null;
    
    const width = 600;
    const height = 220;
    const padding = 40;
    
    // Find min and max revenue for scaling
    const revenues = chartData.map(d => d.revenue);
    const maxRev = Math.max(...revenues) * 1.1;
    
    // Map data points to SVG coordinates
    const points = chartData.map((d, index) => {
      const x = padding + (index * (width - 2 * padding) / (chartData.length - 1));
      const y = height - padding - (d.revenue * (height - 2 * padding) / maxRev);
      return { x, y, label: d.year, val: d.revenue };
    });

    const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
    
    // Path for the filled gradient area under the line
    const areaPath = `
      ${linePath} 
      L ${points[points.length - 1].x} ${height - padding} 
      L ${points[0].x} ${height - padding} 
      Z
    `;

    return (
      <svg key={chartData.map(d=>d.revenue).join('-')} viewBox={`0 0 ${width} ${height}`} width="100%" height={height} style={{ overflow: 'visible' }}>
        <defs>
          <linearGradient id="chartGlow" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--neon-cyan)" stopOpacity="0.25" />
            <stop offset="100%" stopColor="var(--neon-cyan)" stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
          const y = padding + ratio * (height - 2 * padding);
          const val = (maxRev * (1 - ratio)).toFixed(0);
          return (
            <g key={i}>
              <line 
                x1={padding} 
                y1={y} 
                x2={width - padding} 
                y2={y} 
                stroke="var(--border-light)" 
                strokeDasharray="4 4" 
              />
              <text 
                x={padding - 10} 
                y={y + 4} 
                fill="var(--color-text-muted)" 
                fontSize="10" 
                textAnchor="end"
                fontFamily="var(--font-mono)"
              >
                ${val}B
              </text>
            </g>
          );
        })}

        {/* Area Fill — fades in */}
        <path d={areaPath} fill="url(#chartGlow)" className="chart-area-fade" />

        {/* Animated Trend Line */}
        <path 
          d={linePath} 
          fill="none" 
          stroke="var(--neon-cyan)" 
          strokeWidth="3"
          pathLength="1"
          className="chart-line-draw"
          filter="drop-shadow(0px 0px 6px rgba(0, 212, 255, 0.7))"
        />

        {/* Moving Flow Pulse Overlay */}
        <path 
          d={linePath} 
          fill="none" 
          stroke="#ffffff" 
          strokeWidth="2"
          className="chart-line-pulse"
          filter="drop-shadow(0px 0px 8px #ffffff)"
        />

        {/* Data points & X axis labels */}
        {points.map((p, i) => (
          <g key={i}>
            <circle 
              cx={p.x} 
              cy={p.y} 
              r="5" 
              fill="#000000" 
              stroke="var(--neon-cyan)" 
              strokeWidth="2"
              className="chart-dot-pop"
              style={{ animationDelay: `${0.9 + i * 0.1}s` }}
            />
            {/* Value Label above point */}
            <text 
              x={p.x} 
              y={p.y - 12} 
              fill="#fff" 
              fontSize="11" 
              fontWeight="600" 
              textAnchor="middle"
            >
              ${p.val}B
            </text>
            {/* X axis Label */}
            <text 
              x={p.x} 
              y={height - padding + 20} 
              fill="var(--color-text-secondary)" 
              fontSize="12" 
              fontWeight="500" 
              textAnchor="middle"
            >
              {p.label}
            </text>
          </g>
        ))}

        {/* X Axis Line */}
        <line 
          x1={padding} 
          y1={height - padding} 
          x2={width - padding} 
          y2={height - padding} 
          stroke="var(--border-light)" 
          strokeWidth="1" 
        />
      </svg>
    );
  };

  return (
    <div className="app-container">
      {/* Sidebar - Watchlist / Recent Searches */}
      <aside className="sidebar">
        <div className="brand-section">
          <Sparkles className="brand-icon" size={26} />
          <h1 className="brand-name">AURA Analytics</h1>
        </div>

        <h3 className="sidebar-title">Research History</h3>
        
        <div className="history-list">
          {history.map((item, idx) => (
            <div 
              key={idx} 
              className={`history-item ${result?.ticker === item.ticker ? 'active' : ''}`}
              onClick={() => handleTagClick(item.ticker)}
            >
              <div>
                <div className="history-item-ticker">{item.ticker}</div>
                <div className="history-item-name">{item.name}</div>
              </div>
              <span className={`verdict-badge ${item.verdict.toLowerCase()}`}>
                {item.verdict}
              </span>
            </div>
          ))}
        </div>

        <h3 className="sidebar-title" style={{ marginTop: '20px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Bell size={13} /> Analyst Alerts
        </h3>
        <div className="alert-feed">
          {ANALYST_ALERTS.map((alert, idx) => (
            <div key={idx} className={`alert-item alert-${alert.color}`} onClick={() => handleTagClick(alert.ticker)}>
              <div className="alert-header">
                <span className="alert-ticker">{alert.ticker}</span>
                <span className={`alert-badge alert-badge-${alert.color}`}>{alert.action}</span>
              </div>
              <div className="alert-analyst">{alert.analyst} · {alert.rating}</div>
              <div className="alert-footer-row">
                <span className="alert-target">PT: {alert.target}</span>
                <span className="alert-date">{alert.date}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="sidebar-footer">
          <div className="avatar">A</div>
          <div>
            <div style={{ fontWeight: 600 }}>Investment Analyst</div>
            <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>Pro Mode Active</div>
          </div>
        </div>
      </aside>

      {/* Main Research Content */}
      <main className="main-content">
        {/* Top Search Controls */}
        <div>
          <div className="hero-section">
            <h2 className="hero-title">AI Investment Research Agent</h2>
            <p className="hero-subtitle">Enter a public company name or ticker to execute multi-node AI research synthesis.</p>
          </div>

          <div className="search-container">
            <div className="search-box-wrapper">
              <Search className="search-icon" size={20} />
              <input 
                type="text" 
                placeholder="Search stock symbol or name (e.g. Apple, TSLA, Nvidia...)" 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && startAnalysis()}
                className="search-input"
                disabled={loading}
              />
              <button 
                onClick={() => startAnalysis()} 
                className="analyze-button"
                disabled={loading}
              >
                {loading ? 'Analyzing...' : 'Execute Research'}
                <ArrowRight size={16} />
              </button>
            </div>

            <div className="search-controls">
              <div className="popular-tags">
                <span className="tag-label">Popular:</span>
                {['AAPL', 'TSLA', 'NVDA', 'MSFT', 'NFLX'].map((ticker) => (
                  <span 
                    key={ticker} 
                    className="tag"
                    onClick={() => handleTagClick(ticker)}
                  >
                    {ticker}
                  </span>
                ))}
              </div>

              <div 
                className="mode-switch" 
                onClick={() => setDeepResearch(!deepResearch)}
              >
                <div className={`switch-track ${deepResearch ? 'active' : ''}`}>
                  <div className="switch-thumb" />
                </div>
                <span>Deep Agentic Search (Node Backend)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Live Loading Pipeline (Shows during execution) */}
        {loading && (
          <div className="pipeline-container">
            <div className="pipeline-header">
              <div className="pipeline-title-group">
                <Activity className="pipeline-spinner" size={20} />
                <h3 style={{ fontSize: '16px', fontWeight: 600 }}>Executing Agentic Workflow Nodes</h3>
              </div>
              <span style={{ fontSize: '13px', color: 'var(--neon-cyan)' }}>
                Step {currentStepIndex + 1} of 5
              </span>
            </div>

            <div className="pipeline-steps">
              {/* Animated Progress Bar */}
              <div 
                className="pipeline-progress-bar" 
                style={{ width: `${(currentStepIndex / 4) * 85}%` }} 
              />
              
              {[
                { label: 'Ticker Resolution', desc: 'Symbol check' },
                { label: 'SEC Ratios', desc: 'Financial records' },
                { label: 'News Sentiment', desc: 'Web scraping' },
                { label: 'Peer Ranking', desc: 'Competitor scan' },
                { label: 'Verdict Resolution', desc: 'SWOT & decision' }
              ].map((step, idx) => (
                <div 
                  key={idx} 
                  className={`step-node ${currentStepIndex === idx ? 'active' : ''} ${currentStepIndex > idx ? 'completed' : ''}`}
                >
                  <div className="step-circle">
                    {currentStepIndex > idx ? (
                      <CheckCircle2 size={24} />
                    ) : (
                      <span>{idx + 1}</span>
                    )}
                  </div>
                  <span className="step-label">{step.label}</span>
                </div>
              ))}
            </div>

            {/* Monospace Agent Console Output */}
            <div className="console-logs">
              <div className="console-line">
                <span className="console-time">[{new Date().toLocaleTimeString()}]</span>
                <span className="console-text system">AURA System Agent active. Preparing node network execution...</span>
              </div>
              {consoleLogs.map((log, idx) => (
                <div key={idx} className="console-line">
                  <span className="console-time">[{log.time}]</span>
                  <span className={`console-text ${log.type}`}>{log.text}</span>
                </div>
              ))}
              <div ref={consoleEndRef} />
            </div>
          </div>
        )}

        {/* Results Dashboard (Rendered once research completes) */}
        {result && !loading && (
          <div className="dashboard-grid">
            {/* Left Hand: Verdict Column */}
            <div className={`verdict-card ${result.verdict.toLowerCase()}`}>
              <div className="verdict-glow-border" />
              
              <div className="verdict-header">
                <div className="verdict-icon-container">
                  {result.verdict === 'INVEST' ? (
                    <ThumbsUp size={36} />
                  ) : (
                    <ThumbsDown size={36} />
                  )}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  AURA AI Decision
                </div>
                <h2 className="verdict-badge-large">{result.verdict}</h2>
                <div style={{ color: 'var(--color-text-secondary)', fontSize: '13px' }}>
                  {result.name} ({result.ticker})
                </div>
              </div>

              <div className="conviction-gauge">
                <div className="gauge-val">{result.conviction}%</div>
                <div className="gauge-lbl">AI Conviction Score</div>
              </div>

              <div className="thesis-box">
                <div className="thesis-title">Analyst Thesis</div>
                <div>{result.thesis}</div>
              </div>

              <div className="metrics-mini-grid">
                <div className="mini-metric-item">
                  <div className="mini-metric-lbl">Target Price</div>
                  <div className="mini-metric-val" style={{ color: result.verdict === 'INVEST' ? 'var(--neon-green)' : 'var(--neon-rose)' }}>
                    {result.targetPrice}
                  </div>
                </div>
                <div className="mini-metric-item">
                  <div className="mini-metric-lbl">Current Price</div>
                  <div className="mini-metric-val">{result.price}</div>
                </div>
              </div>
            </div>

            {/* Right Hand: Tabs Panels */}
            <div className="details-tabs-container">
              <div className="tabs-header-wrapper">
                <div className="tabs-list">
                  {[
                    { id: 'overview', label: 'Company Profile', icon: Info },
                    { id: 'financials', label: 'Financial Statements', icon: TrendingUp },
                    { id: 'sentiment', label: 'News & Sentiment', icon: Newspaper },
                    { id: 'competitors', label: 'Peer Benchmarking', icon: Layers },
                    { id: 'swot', label: 'SWOT Matrix', icon: ShieldAlert },
                    { id: 'compare', label: 'Compare', icon: ArrowLeftRight }
                  ].map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                      >
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                          <Icon size={14} />
                          {tab.label}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <button onClick={() => window.print()} className="export-btn">
                  <FileDown size={14} />
                  Print PDF Report
                </button>
              </div>

              {/* Tab Panels Contents */}
              <div className="tab-content-panel">
                
                {/* 1. OVERVIEW PROFILE TAB */}
                {activeTab === 'overview' && (
                  <div>
                    <h3 className="section-headline">Executive Profile Summary</h3>
                    <p className="section-tagline">
                      Sector metrics, sector segment placement, and core investment ratios extracted by AURA.
                    </p>

                    <div className="financials-grid" style={{ marginBottom: '32px' }}>
                      <div className="financial-metric-card">
                        <div className="financial-metric-lbl">Sector</div>
                        <div className="financial-metric-val" style={{ color: 'var(--neon-cyan)' }}>{result.sector}</div>
                      </div>
                      <div className="financial-metric-card">
                        <div className="financial-metric-lbl">Industry</div>
                        <div className="financial-metric-val">{result.industry}</div>
                      </div>
                      <div className="financial-metric-card">
                        <div className="financial-metric-lbl">Market Capitalization</div>
                        <div className="financial-metric-val">{result.financials.metrics[0].val}</div>
                      </div>
                      <div className="financial-metric-card">
                        <div className="financial-metric-lbl">P/E Ratio (LTM)</div>
                        <div className="financial-metric-val">{result.financials.metrics[1].val}</div>
                      </div>
                    </div>

                    <div className="chart-card" style={{ background: 'rgba(0, 0, 0, 0.15)' }}>
                      <h4 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '16px', color: '#fff' }}>
                        Thesis Assessment
                      </h4>
                      <p style={{ color: 'var(--color-text-secondary)', fontSize: '14px', lineHeight: 1.6 }}>
                        AURA resolved that **{result.name}** operates with a market price of **{result.price}** against an estimated 12-month fair valuation target of **{result.targetPrice}**. Based on cash flow returns, historical multiples, and sector headwinds, this company represents a **{result.verdict === 'INVEST' ? 'strong accumulation opportunity with a positive margin of safety' : 'high-risk profile where current valuations exceed estimated cash flows'}**.
                      </p>
                    </div>
                  </div>
                )}

                {/* 2. FINANCIALS TAB */}
                {activeTab === 'financials' && (
                  <div>
                    <h3 className="section-headline">Balance Sheet & Revenue Charts</h3>
                    <p className="section-tagline">
                      Visualizing key historical revenue trends and operating margins from financial filings.
                    </p>

                    <div className="financials-charts-row">
                      <div className="chart-card">
                        <div className="chart-title">Revenue Trajectory ($ Billions)</div>
                        <div style={{ height: '220px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          {renderSVGChart(result.financials.chartData)}
                        </div>
                      </div>
                    </div>

                    <div className="financials-grid">
                      {result.financials.metrics.map((metric, idx) => (
                        <div key={idx} className="financial-metric-card">
                          <div className="financial-metric-lbl">{metric.label}</div>
                          <div className={`financial-metric-val ${metric.val.startsWith('+') ? 'trend-up' : metric.val.startsWith('-') ? 'trend-down' : ''}`}>
                            {metric.val}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 3. SENTIMENT TAB */}
                {activeTab === 'sentiment' && (
                  <div>
                    <h3 className="section-headline">Market News & Sentiment Crawler</h3>
                    <p className="section-tagline">
                      Real-time sentiment score compiled by searching RSS streams and news boards.
                    </p>

                    <div className="sentiment-gauge-wrapper">
                      <div className="sentiment-gauge-score">{result.sentiment.score}%</div>
                      <div className="sentiment-gauge-info">
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600, fontSize: '14px' }}>
                          <span>Market Consensus: {result.sentiment.label}</span>
                        </div>
                        <div className="sentiment-bar-track">
                          <div className="sentiment-bar-fill" style={{ width: `${result.sentiment.score}%` }} />
                        </div>
                        <div className="sentiment-bar-labels">
                          <span>Bearish</span>
                          <span>Neutral</span>
                          <span>Bullish</span>
                        </div>
                      </div>
                    </div>

                    <h4 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '16px', color: '#fff' }}>
                      Recent Press Filings
                    </h4>
                    <div className="news-feed">
                      {result.sentiment.news.map((item, idx) => (
                        <div key={idx} className="news-card">
                          <div className="news-meta">
                            <span className="news-source-time">{item.source} • {item.time}</span>
                            <span className={`news-badge ${item.sentiment}`}>
                              {item.sentiment}
                            </span>
                          </div>
                          <h4 className="news-title">{item.title}</h4>
                          <p className="news-summary">{item.summary}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 4. COMPETITORS TAB */}
                {activeTab === 'competitors' && (
                  <div>
                    <h3 className="section-headline">Competitor Benchmark Matrix</h3>
                    <p className="section-tagline">
                      Comparing the target company directly against key industry competitors.
                    </p>

                    <div className="comparison-table-wrapper">
                      <table className="comparison-table">
                        <thead>
                          <tr>
                            <th>Ticker</th>
                            <th>Company Name</th>
                            <th>Market Cap</th>
                            <th>P/E Ratio</th>
                            <th>Gross Margin</th>
                            <th>YoY Growth</th>
                            <th>AURA Rating</th>
                          </tr>
                        </thead>
                        <tbody>
                          {result.competitors.map((comp, idx) => (
                            <tr key={idx} className={comp.ticker === result.ticker ? 'subject-row' : ''}>
                              <td className="comp-ticker">
                                {comp.ticker}
                                {comp.ticker === result.ticker && (
                                  <span className="subject-indicator">Target</span>
                                )}
                              </td>
                              <td>{comp.name}</td>
                              <td>{comp.cap}</td>
                              <td>{comp.pe}</td>
                              <td>{comp.margin}</td>
                              <td>{comp.growth}</td>
                              <td style={{ fontWeight: 700, color: parseInt(comp.score) > 75 ? 'var(--neon-green)' : 'var(--neon-amber)' }}>
                                {comp.score}/100
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* 5. SWOT TAB */}
                {activeTab === 'swot' && (
                  <div>
                    <h3 className="section-headline">SWOT Risk Assessment</h3>
                    <p className="section-tagline">
                      AI-generated quadrants isolating internal factors and market opportunities/threats.
                    </p>

                    <div className="swot-grid">
                      <div className="swot-card strengths">
                        <div className="swot-title-row">
                          <CheckCircle2 size={18} style={{ color: 'var(--neon-green)' }} />
                          <h3>Strengths</h3>
                        </div>
                        <ul className="swot-list">
                          {result.swot.strengths.map((item, idx) => <li key={idx}>{item}</li>)}
                        </ul>
                      </div>

                      <div className="swot-card weaknesses">
                        <div className="swot-title-row">
                          <ShieldAlert size={18} style={{ color: 'var(--neon-rose)' }} />
                          <h3>Weaknesses</h3>
                        </div>
                        <ul className="swot-list">
                          {result.swot.weaknesses.map((item, idx) => <li key={idx}>{item}</li>)}
                        </ul>
                      </div>

                      <div className="swot-card opportunities">
                        <div className="swot-title-row">
                          <Sparkles size={18} style={{ color: 'var(--neon-blue)' }} />
                          <h3>Opportunities</h3>
                        </div>
                        <ul className="swot-list">
                          {result.swot.opportunities.map((item, idx) => <li key={idx}>{item}</li>)}
                        </ul>
                      </div>

                      <div className="swot-card threats">
                        <div className="swot-title-row">
                          <HelpCircle size={18} style={{ color: 'var(--neon-amber)' }} />
                          <h3>Threats</h3>
                        </div>
                        <ul className="swot-list">
                          {result.swot.threats.map((item, idx) => <li key={idx}>{item}</li>)}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {/* 6. COMPARE TAB */}
                {activeTab === 'compare' && (() => {
                  const stocks = Object.keys(MOCK_STOCKS).filter(t => t !== result.ticker);
                  const effectiveTicker = compareStock && MOCK_STOCKS[compareStock] ? compareStock : stocks[0];
                  const cmp = MOCK_STOCKS[effectiveTicker];
                  const getVal = (stock, label) => (stock.financials?.metrics || []).find(m => m.label === label)?.val || 'N/A';
                  return (
                    <div>
                      <h3 className="section-headline">Side-by-Side Comparison</h3>
                      <p className="section-tagline">Benchmarking <strong>{result.ticker}</strong> directly against another stock across key valuation and risk metrics.</p>
                      <div className="compare-selector-row">
                        <label className="compare-selector-label">Compare {result.ticker} vs:</label>
                        <select className="compare-select" value={effectiveTicker} onChange={(e) => setCompareStock(e.target.value)}>
                          {stocks.map(t => <option key={t} value={t}>{MOCK_STOCKS[t].name} ({t})</option>)}
                        </select>
                      </div>
                      <div className="compare-header-grid">
                        <div className={`compare-stock-card ${result.verdict.toLowerCase()}`}>
                          <div className="compare-stock-ticker">{result.ticker}</div>
                          <div className="compare-stock-name">{result.name}</div>
                          <span className={`verdict-badge ${result.verdict.toLowerCase()}`}>{result.verdict}</span>
                          <div className="compare-conviction">{result.conviction}% Conviction</div>
                        </div>
                        <div className="compare-vs-circle">VS</div>
                        <div className={`compare-stock-card ${cmp.verdict.toLowerCase()}`}>
                          <div className="compare-stock-ticker">{cmp.ticker}</div>
                          <div className="compare-stock-name">{cmp.name}</div>
                          <span className={`verdict-badge ${cmp.verdict.toLowerCase()}`}>{cmp.verdict}</span>
                          <div className="compare-conviction">{cmp.conviction}% Conviction</div>
                        </div>
                      </div>
                      <div className="compare-metrics-table">
                        <div className="compare-metrics-header">
                          <div>Metric</div><div>{result.ticker}</div><div>{cmp.ticker}</div>
                        </div>
                        {['Market Cap','P/E Ratio','ROE','Gross Margin','Operating Margin','Revenue Growth','Free Cash Flow','Debt to Equity'].map(label => (
                          <div key={label} className="compare-metric-row">
                            <div className="compare-metric-label">{label}</div>
                            <div className="compare-metric-val">{getVal(result, label)}</div>
                            <div className="compare-metric-val">{getVal(cmp, label)}</div>
                          </div>
                        ))}
                      </div>
                      <div className="compare-swot-grid">
                        <div>
                          <h4 style={{ color: 'var(--neon-cyan)', marginBottom: '10px' }}>{result.ticker} — Strengths</h4>
                          <ul className="swot-list">{result.swot.strengths.map((s,i)=><li key={i}>{s}</li>)}</ul>
                          <h4 style={{ color: 'var(--neon-rose)', margin: '14px 0 10px' }}>{result.ticker} — Threats</h4>
                          <ul className="swot-list">{result.swot.threats.map((s,i)=><li key={i}>{s}</li>)}</ul>
                        </div>
                        <div>
                          <h4 style={{ color: 'var(--neon-cyan)', marginBottom: '10px' }}>{cmp.ticker} — Strengths</h4>
                          <ul className="swot-list">{cmp.swot.strengths.map((s,i)=><li key={i}>{s}</li>)}</ul>
                          <h4 style={{ color: 'var(--neon-rose)', margin: '14px 0 10px' }}>{cmp.ticker} — Threats</h4>
                          <ul className="swot-list">{cmp.swot.threats.map((s,i)=><li key={i}>{s}</li>)}</ul>
                        </div>
                      </div>
                    </div>
                  );
                })()}

              </div>
            </div>
          </div>
        )}

        {/* Welcome / Empty state */}
        {!result && !loading && (
          <div className="welcome-screen">
            <div className="welcome-illustration">
              <Sparkles size={64} />
            </div>

            <div className="welcome-info">
              <h2 className="welcome-title">AURA Agent Setup Ready</h2>
              <p className="welcome-text">
                Welcome to AURA. Search for a stock above or select a company from the popular tags or sidebar history to run the multi-agent research workflow.
              </p>
            </div>

            <div className="feature-cards-grid">
              <div className="feature-card">
                <Terminal className="feature-card-icon" size={24} />
                <h4 className="feature-card-title">LangGraph Agent</h4>
                <p className="feature-card-desc">Tracks steps dynamically, keeping a detailed log trail of the thinking process.</p>
              </div>

              <div className="feature-card">
                <TrendingUp className="feature-card-icon" size={24} />
                <h4 className="feature-card-title">Financial Charts</h4>
                <p className="feature-card-desc">Generates professional area graphs visualizing revenue and cash flow histories.</p>
              </div>

              <div className="feature-card">
                <Newspaper className="feature-card-icon" size={24} />
                <h4 className="feature-card-title">Market Sentiment</h4>
                <p className="feature-card-desc">Crawls Google and RSS streams to score consensus news sentiment scores.</p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Floating Chatbot Widget */}
      <div className={`chatbot-wrapper ${chatOpen ? 'open' : ''}`}>
        {!chatOpen ? (
          <button className="chat-fab" onClick={() => setChatOpen(true)}>
            <MessageSquare size={24} />
            <span className="chat-fab-tooltip">Ask AURA Assistant</span>
          </button>
        ) : (
          <div className="chat-window">
            <div className="chat-header">
              <div className="chat-header-title">
                <Sparkles size={16} className="chat-header-icon" />
                <span>AURA Research AI Assistant</span>
              </div>
              <button className="chat-close-btn" onClick={() => setChatOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <div className="chat-messages-container">
              {messages.map((msg, idx) => (
                <div key={idx} className={`chat-message ${msg.role}`}>
                  <div className="chat-message-bubble">
                    {msg.role === 'assistant' ? renderMarkdown(msg.text) : msg.text}
                  </div>
                </div>
              ))}
              {chatLoading && (
                <div className="chat-message assistant loading">
                  <div className="chat-message-bubble">
                    <span className="dot-pulse"></span>
                    <span className="dot-pulse"></span>
                    <span className="dot-pulse"></span>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Quick Context Suggestion Chips */}
            <div className="chat-suggestions">
              <button 
                className="suggestion-chip" 
                onClick={() => handleSendMessage(result ? `Why is ${result.ticker} an ${result.verdict}?` : "Why is Apple an INVEST?")}
              >
                Why this verdict?
              </button>
              <button 
                className="suggestion-chip" 
                onClick={() => handleSendMessage(result ? `Explain the SWOT analysis for ${result.ticker}` : "Explain stock SWOT assessments")}
              >
                Explain SWOT risks
              </button>
              <button 
                className="suggestion-chip" 
                onClick={() => handleSendMessage(result ? `What are ${result.ticker}'s gross margin and ROE?` : "Explain gross margin metrics")}
              >
                Show financial details
              </button>
            </div>

            <form 
              className="chat-input-form" 
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
            >
              <input
                type="text"
                placeholder="Ask about any stock or company..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                disabled={chatLoading}
                className="chat-text-input"
              />
              <button 
                type="submit" 
                disabled={chatLoading || !chatInput.trim()} 
                className="chat-send-btn"
              >
                <Send size={16} />
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
