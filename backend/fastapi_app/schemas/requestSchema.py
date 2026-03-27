from pydantic import BaseModel, Field

# Resume Analysis Model
class ResumeAnalysisRequest(BaseModel):
    resume_text: str = Field(..., min_length=100,
                             description="Full resume content in plain text")

# Interview Question Model
class InterviewQuestionsRequest(BaseModel):
    target_role: str = Field(..., description="Target job role or position")
    company_type: str = Field(...,
                              description="Type of company (e.g., Startup, FAANG)")
    experience_level: str = Field(...,
                                  description="Experience level (e.g., 0-1 years, 1-3 years)")
    tech_stack: list[str] = Field(...,
                                  description="List of technologies and skills")

# RoadMap Model
class Roadmap(BaseModel):
    role_name: str = Field(..., description="Target career role or position")
    experience_level: str = Field(...,
                                  description="Experience level (e.g.,Beginner, Intermediate)")
    current_skills: list[str] = Field(...,
                                      description="List of technologies and skills")

# Aptitude Test Model
class AptitudeTestRequest(BaseModel):
    test_mode: str = Field(..., description="Test mode")
    category: str = Field(..., description="Question category")
    difficulty_level: str = Field(..., description="Difficulty level")
    no_of_questions: int = Field(..., gt=0,
                                 description="Number of questions for the test")
