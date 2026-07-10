import os
from dotenv import load_dotenv
from langchain_groq import ChatGroq

load_dotenv()

llm = ChatGroq(
    # model="llama-3.3-70b-versatile",
    model="openai/gpt-oss-120b",
    # model="qwen/qwen3.6-27b",
    # model="llama-3.1-8b-instant",
    groq_api_key=os.getenv("GROQ_API_KEY")
)