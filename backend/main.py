from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import json
import os
import google.generativeai as genai
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure Gemini
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel("gemini-2.0-flash")

app = FastAPI()

# 🌍 Allow React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def load_argo_data():
    """Load and return Argo dataset from cache."""
    with open("argo_cache.json", "r") as f:
        return json.load(f)


def build_context(data: list) -> str:
    """Convert Argo data list into a readable text context for Gemini."""
    lines = ["Here is real-time ocean data from Argo floats:\n"]
    for i, d in enumerate(data):
        lat = d.get("latitude", "N/A")
        lon = d.get("longitude", "N/A")
        temp = d.get("temperature", "N/A")
        sal = d.get("salinity", "N/A")
        pres = d.get("pressure", "N/A")
        lines.append(
            f"Float {i+1}: Latitude={lat:.2f}, Longitude={lon:.2f}, "
            f"Temperature={temp:.2f}°C, Salinity={sal:.2f} PSU, Pressure={pres:.2f} dbar"
        )
    return "\n".join(lines)


# 🏠 Home route
@app.get("/")
def home():
    return {"message": "DeepSeaGPT Backend Running"}


# 🌊 Argo data API
@app.get("/api/ocean/live")
def get_live_argo_data():
    return load_argo_data()


# 🤖 Chatbot request model
class ChatRequest(BaseModel):
    question: str


# 🤖 AI sidebar chatbot route — powered by Gemini + Argo RAG
@app.post("/api/chat")
def ocean_chat(request: ChatRequest):
    try:
        data = load_argo_data()
        context = build_context(data)

        prompt = f"""You are DeepSeaGPT, an expert ocean data analyst. 
You have access to real Argo float ocean sensor data.
Use the data below to answer the user's question accurately and concisely.
If the question is unrelated to ocean data, politely redirect the user.

{context}

User question: {request.question}

Provide a clear, informative answer based on the data above."""

        response = model.generate_content(prompt)
        return {"answer": response.text}

    except Exception as e:
        return {"answer": f"Error communicating with AI: {str(e)}"}
