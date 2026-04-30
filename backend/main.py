from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import subprocess
import tempfile
import os
from database import engine, get_db
import models
from routers import auth, courses, users, code_runner 

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="EduCode Hub API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(courses.router)
app.include_router(users.router)
app.include_router(code_runner.router)

@app.get("/")
def read_root():
    return {"status": "online", "message": "EduCode Hub API ishlayapti ✅"}

