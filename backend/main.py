from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from config import settings
from auth_routes import router as auth_router
from email_routes import router as email_router

# Create FastAPI app
app = FastAPI(
    title="Constructure AI API",
    description="Backend API for Constructure AI with Google OAuth authentication",
    version="1.0.0"
)

# Configure CORS
allowed_origins = [
    "http://localhost:5173",
    "http://localhost:5174",
]

# Add production frontend URL if set
if settings.FRONTEND_URL:
    allowed_origins.append(settings.FRONTEND_URL)
    # Also allow all Vercel preview deployments
    if "vercel.app" in settings.FRONTEND_URL:
        base_domain = settings.FRONTEND_URL.split("https://")[1].split(".")[0]
        allowed_origins.append(f"https://{base_domain}-*.vercel.app")

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_origin_regex=r"https://.*\.vercel\.app",  # Allow all Vercel deployments
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth_router)
app.include_router(email_router)

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Constructure AI API",
        "version": "1.0.0",
        "status": "running"
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    import os
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=False)
