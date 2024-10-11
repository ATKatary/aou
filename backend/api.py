import cv2
import numpy as np
from utils import *
from fastapi.responses import FileResponse
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
origins = [
    "http://localhost:3000",
    "localhost:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_headers=["*"],
    allow_methods=["*"],
    allow_origins=origins,
    allow_credentials=True,
)


@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.post("/img2Mesh/")
async def api_img_2_mesh(img: UploadFile = File(...)):
    img_bytes = img.file.read()
    img_decoded = cv2.imdecode(np.frombuffer(img_bytes, np.uint8), -1)

    # TODO: convert to a websocket that continues to send obj files as they are generated
    # TODO: use generate api to generate mesh from image

    return FileResponse(f"{BASE_DIR}/vase.obj")