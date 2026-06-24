from fastapi import FastAPI
from app.api.upload import router
from app.api.search import router as search_router
from app.api.chat import router as chat_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5174"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



app.include_router(router)
app.include_router(search_router)
app.include_router(chat_router)

@app.get("/")
def home():
    return {"message": "Industrial Memory Engine"}