from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from .schemas.requestSchema import ResumeAnalysisRequest
import os
from langchain_groq import ChatGroq
import json
from prompt.system_prompt import resume_prompt, roadmap_prompt, interview_questions_prompt
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
async def analyze_resume(request: ResumeAnalysisRequest):
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
        ("system", resume_prompt),
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


@app.get("/generate_roadmap")
def generate_roadmap(request):
    career_role = request.careeer_role
    llm_model = ChatGroq(model="qwen/qwen3-32b",
                         temperature=0,
                         max_retries=2,
                         max_tokens=None,
                         timeout=30)
    messages = [
        ("system", roadmap_prompt),
        (
            "human",
            f"""
        Generate a detailed roadmap for {career_role} using a structured, phase-based format.
        
        
        Instructions:
        - Break the roadmap into progressive levels (e.g., Fundamentals → Intermediate → Advanced → Expert).
        - Ensure each level reflects real-world industry expectations and hiring standards.
        - Include clearly defined, skill-specific modules (avoid vague or generic topics).
        - Cover technical skills, tools, best practices, and relevant soft skills.
        - Maintain logical skill progression between levels.
        - Align modules with current market demand and ATS-relevant keywords.
        - Keep module names concise, practical, and outcome-driven.
        - Ensure the structure is clean, consistent, and scalable across different career roles.
        - Focus on career readiness, employability, and measurable competency development.

        Remember:
        - Return ONLY valid JSON.
        - Follow the exact structure defined in the system instructions.
        """
        ),
    ]
    llm_model_response = llm_model.invoke(messages)
    json_data_file = json.loads(llm_model_response.content)
    return {"roadmap": json_data_file}



@app.get("/generate_interview_questions")
def generate_interview_questions(request):
    level_type = request.level
    category = request.category
    
    llm_model = ChatGroq(model="qwen/qwen3-32b",
                         temperature=0,
                         max_retries=2,
                         max_tokens=None,
                         timeout=30)
    messages = [
        ("system", interview_questions_prompt),
        (
            "human",
            f"""
        Generate a interview questions for {category}  of {level_type} level using a structured, phase-based format.
        
        
        Instructions:
        - Ensure difficulty aligns realistically with industry interview standards.
        - Questions must be skill-specific, scenario-based, and aligned with real-world expectations.
        - Avoid vague or overly theoretical questions unless appropriate for the level.
        - Answers must be concise, technically accurate, and professionally written.
        - For Medium and Hard levels, prioritize problem-solving, optimization, architecture, or trade-off discussions.
        - Ensure content reflects current industry demand and commonly tested interview topics.
        - Keep structure clean, consistent, and scalable.
        - Return ONLY valid JSON.
        - Do NOT include explanations outside the JSON.
        - Do NOT use markdown formatting.
        
        
        Remember:
        - Return ONLY valid JSON.
        - Follow the exact structure defined in the system instructions.
        """
        ),
    ]
    llm_model_response = llm_model.invoke(messages)
    json_data_file = json.loads(llm_model_response.content)
    return {"interview_questions": json_data_file}
