from pydantic import BaseModel, Field


class ResumeAnalysisRequest(BaseModel):
    resume_text: str = Field(..., min_length=100,
                             description="Full resume content in plain text")


class InterviewQuestionsRequest(BaseModel):
    target_role: str = Field(..., description="Target job role or position")
    company_type: str = Field(..., description="Type of company (e.g., Startup, FAANG)")
    experience_level: str = Field(..., description="Experience level (e.g., 0-1 years, 1-3 years)")
    tech_stack: list[str] = Field(..., description="List of technologies and skills")
    

class Roadmap(BaseModel):
    career_role:str