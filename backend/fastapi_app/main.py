from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv  
from .schemas.requestSchema import ResumeAnalysisRequest 
import os
from langchain_groq import ChatGroq
import json
from prompt.system_prompt import llm_prompt
app = FastAPI()

origins = [
    "http://localhost:8000",
    "http://localhost:5173"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# load the api key
load_dotenv()
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

# resume analysis and return a json response with insights and suggestions
@app.post("/analyze_resume")
async def analyze_resume(request: ResumeAnalysisRequest ):
    os.environ["GROQ_API_KEY"] = GROQ_API_KEY
    resume_text = request.text

    # Intializing groq model
    llm_model = ChatGroq(model="qwen/qwen3-32b",
                         temperature=0,
                         max_retries=2,
                         max_tokens=None,
                         timeout=30)
    
     # llm model request & response prompt
    messages = [
    ("system", llm_prompt),
    (
        "human",
        f"""
        Analyze the following resume carefully.

        Resume Content:
        ----------------
        {request.resume_text}
        ----------------

        Instructions:
        - Perform detailed ATS-style evaluation.
        - Be strict but fair in scoring.
        - Penalize missing metrics, vague descriptions, and lack of measurable impact.
        - Check for keyword alignment and clarity.
        - Ensure section scores logically align with overall score.
        - Provide realistic and actionable improvements.

        Remember:
        - Return ONLY valid JSON.
        - Follow the exact structure defined in the system instructions.
        """
    ),
]
    
    llm_model_response = llm_model.invoke(messages)
    json_data_file = json.loads(llm_model_response.content)
    return {"analysis_result": json_data_file}