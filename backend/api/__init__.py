import cv2
import numpy as np
from utils import BASE_DIR
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, File, UploadFile, WebSocket

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

@app.websocket("/ws/img2Mesh/")
async def ws_img_2_mesh(websocket: WebSocket):
    await websocket.accept()
    while True:
        img_bytes = await websocket.receive_bytes()
        img_decoded = cv2.imdecode(np.frombuffer(img_bytes, np.uint8), -1)
        
        with open(f"{BASE_DIR}/vase.obj", "rb") as obj:
            obj = obj.read()

        await websocket.send_bytes(obj)
        