import cv2
import numpy as np

from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
origins = [
    "http://localhost:3000",
    "localhost:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.post("/img2Mesh/")
def create_upload_file(img: UploadFile = File(...)):
    img_bytes = img.file.read()
    img_decoded = cv2.imdecode(np.frombuffer(img_bytes, np.uint8), -1)

    return {"filename": img.filename}