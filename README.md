OVERVIEW


AI Investment Research Agent
The AI Investment Research Agent is an intelligent web application that helps users evaluate whether a company is a suitable investment opportunity. Instead of providing only basic financial information, the application performs AI-driven research, analyzes multiple aspects of a company, and generates a clear investment recommendation along with detailed reasoning.
Users simply enter the name of a company, and the system automatically gathers relevant information, including the company's business profile, financial performance, market position, recent news, and potential risks. This information is then processed by an AI agent built using LangGraph and LangChain, which reasons over the collected data and determines whether the company should be considered for investment.
Unlike traditional stock information websites that only display raw financial metrics, this project focuses on AI-assisted decision making. The agent explains why it recommends "Invest" or "Pass", highlights the company's strengths and weaknesses, assigns a confidence score, and presents the results in an easy-to-understand format.
The project follows a modern full-stack architecture using React for the frontend, Node.js and Express.js for the backend, and LangGraph for orchestrating the AI workflow. The AI reasoning is powered by a Large Language Model (LLM), enabling the agent to combine structured financial data with unstructured information such as recent news and company descriptions before making its recommendation.
This project demonstrates the practical application of Generative AI, Retrieval-Augmented Analysis, and intelligent agent workflows in solving a real-world financial decision-making problem. It showcases how modern AI frameworks can be integrated into a production-style web application to provide transparent, explainable, and user-friendly investment insights.

Project Objectives
The primary objectives of this project are:
•	Build an AI-powered investment research assistant capable of analyzing publicly available company information. 
•	Automate the research process by collecting financial and business-related information from multiple sources. 
•	Generate explainable investment recommendations instead of displaying only raw financial data. 
•	Demonstrate the use of LangGraph for multi-step AI agent orchestration. 
•	Build a responsive and user-friendly web application using React and Node.js. 
•	Showcase practical implementation of Large Language Models (LLMs) in financial research.

**********************************************************************************************************************************************************************************

How to Run the Project

The AI Investment Research Agent can be accessed either through the deployed web application or by running it locally. The following steps describe how to set up and execute the project on a local machine.
Prerequisites
Before running the application, ensure that the following software is installed:
Node.js (Version 18 or above)
npm (comes bundled with Node.js)
Git
Visual Studio Code (or any preferred code editor)
An active internet connection is required because the application communicates with external AI services.

STEP1:- Extract the Zip File
Step 2: Install Frontend Dependencies
Open a terminal inside the frontend folder.
cd frontend
npm install

Step 3: Install Backend Dependencies
Open another terminal.
cd backend
npm install 


Step 4: Configure Environment Variables

Inside the backend folder, create a file named:
.env
Add the following environment variables:
GOOGLE_API_KEY=YOUR_GOOGLE_GEMINI_API_KEY
GROQ_API_KEY=YOUR_GROQ_API_KEY

Step 5: Start the Backend Server
Navigate to the backend folder and run:
npm run dev

Step 6: Start the Frontend
Navigate to the frontend folder and run:
npm run dev


Deployment
The project has been successfully deployed on Vercel.
Live Application
>>>>>>>>https://ai-investment-xnf7.vercel.app/

**********************************************************************************************************************************************************************************

How It Works

Approach
The AI Investment Research Agent is designed as an intelligent, AI-driven application that assists users in researching companies and making informed investment decisions.
Rather than displaying only financial metrics, the application combines structured AI reasoning with an interactive conversational interface to provide a more comprehensive
investment analysis.
The workflow begins when a user enters the name of a company. The frontend sends this request to the backend, where a LangGraph-based AI workflow is initiated. 
The workflow constructs a structured prompt and invokes the configured Large Language Model (Google Gemini/Groq) to analyze the company's business profile, market position,
growth potential, strengths, weaknesses, opportunities, and investment risks.
Based on this analysis, the AI generates an investment recommendation (Invest or Pass), accompanied by a confidence score and a detailed explanation that helps users 
understand the reasoning behind the decision.
To make the application more interactive, an AI-powered chatbot is integrated into the dashboard. After receiving the investment report, users can continue asking 
follow-up questions related to the selected company. The chatbot maintains the context of the generated analysis and provides natural language responses about the 
company's business model, financial outlook, risks, competitive position, and investment prospects. This transforms the application from a static recommendation 
system into an intelligent investment assistant capable of engaging in contextual conversations.

**********************************************************************************************************************************************************************************

System Architecture

The application follows a modular three-layer architecture:
1. Presentation Layer (React)
The frontend provides an intuitive user interface where users can:
Enter a company name
Request an investment analysis
View the AI-generated report
Read the recommendation and confidence score
Interact with the AI chatbot by asking follow-up questions

The frontend communicates with the backend through REST APIs.


2. Backend Layer (Node.js + Express)
The backend serves as the central controller of the application. Its responsibilities include:
Receiving requests from the frontend
Validating user input
Initializing the LangGraph workflow
Invoking the Large Language Model
Generating structured investment analysis
Managing chatbot requests while preserving the context of the selected company
Returning JSON responses to the frontend


3. AI Processing Layer (LangGraph + LLM)
The AI Processing Layer is responsible for all intelligent reasoning within the application.
LangGraph orchestrates the workflow, while the configured LLM (Google Gemini/Groq) performs the reasoning tasks.
The workflow consists of two interconnected AI capabilities:
Investment Analysis
Receive the company name.
Generate a structured investment analysis prompt.
Invoke the LLM.
Analyze the company's business profile, strengths, opportunities, risks, and growth potential.
Generate an Invest or Pass recommendation.
Calculate a confidence score.
Return the final investment report.
AI Chatbot

After the investment report is generated:
The chatbot receives a user query.
The previously generated company context is used to understand the question.
The LLM generates a contextual response.
The chatbot returns a conversational answer, enabling users to explore the company in greater detail without restarting the analysis.
**********************************************************************************************************************************************************************************


Overall Workflow
                       User
                         │
                         ▼
              Enter Company Name
                         │
                         ▼
                 React Frontend
                         │
                         ▼
               Express.js Backend
                         │
                         ▼
                LangGraph Workflow
                         │
                         ▼
                 Google Gemini / Groq
                  ┌────────┴────────┐
                  ▼                 ▼
      Investment Recommendation   AI Chatbot
                  │                 │
                  └────────┬────────┘
                           ▼
                  Results Displayed
                     on Dashboard
**********************************************************************************************************************************************************************************

Key Decisions & Trade-offs
Key Design Decisions
1. React for the Frontend
React was chosen because its component-based architecture makes it easy to build a responsive and interactive user interface. It also simplifies the integration of both the 
investment dashboard and the chatbot within a single-page application.

2. Node.js and Express.js for the Backend
Node.js with Express.js was selected because it provides a lightweight and efficient backend that integrates seamlessly with JavaScript-based AI frameworks such as LangChain
and LangGraph.

3. LangGraph for AI Workflow
Instead of directly invoking the LLM, LangGraph was used to structure the AI workflow into multiple reasoning stages. This approach improves modularity and makes it easier 
to extend the application with additional tools or decision nodes in the future.

4. Google Gemini / Groq as the LLM
Google Gemini and Groq were selected for their strong reasoning capabilities and efficient response times. Their flexibility allows the application to generate detailed 
investment reports as well as conversational chatbot responses using the same AI foundation.

5. Context-Aware AI Chatbot
A context-aware chatbot was integrated to enhance user engagement. Rather than limiting users to a static investment report, the chatbot enables natural follow-up 
conversations about the analyzed company. This significantly improves usability and demonstrates the practical application of conversational AI in financial research.


Trade-offs

While developing the project, several design trade-offs were made to keep the implementation focused and achievable within the assignment timeline.
Features Implemented
AI-powered investment recommendation
Explainable reasoning
Confidence score
Context-aware AI chatbot
Responsive web interface
LangGraph-based workflow
Modular backend architecture

Features Deferred
The following enhancements can be added in future versions:
Real-time financial market data integration for more up-to-date investment analysis.
Conversation history so users can revisit previous chatbot interactions.
Personalized investment recommendations based on user preferences.

**********************************************************************************************************************************************************************************

What I Would Improve with More Time
Given additional development time, I would enhance the AI Investment Research Agent by introducing several advanced features to improve both the quality of investment 
analysis and the overall user experience.

1. Real-Time Financial Data Integration
Currently, the analysis is generated using AI reasoning and available company information. In future versions, I would integrate real-time financial APIs to include live 
stock prices, financial ratios, earnings reports, and market trends, enabling more accurate and up-to-date investment recommendations.

2. Enhanced AI Chatbot
The chatbot would be upgraded with conversation history and improved context retention, allowing users to have longer, more natural discussions about a company without 
losing previous context.

3.Source References and Citations
To improve transparency, I would include references to the information used during analysis. This would allow users to verify the AI's conclusions and increase confidence in 
the generated recommendations.










