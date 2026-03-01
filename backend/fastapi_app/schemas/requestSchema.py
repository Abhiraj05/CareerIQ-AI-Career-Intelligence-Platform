from pydantic import BaseModel, Field


class ResumeAnalysisRequest(BaseModel):
    resume_text: str = Field(..., min_length=100, description="Full resume content in plain text")
    