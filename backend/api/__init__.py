import io
import gc
import torch
import numpy as np
from PIL import Image
from ai.mesh import Mesh
from utils import BASE_DIR
from ai.gen_2d import GenSD
from ai.gen_3d import Img2Mesh
from fastapi import FastAPI, WebSocket
from contextlib import asynccontextmanager
from pytorch_lightning import seed_everything
from fastapi.middleware.cors import CORSMiddleware

models = {}

@asynccontextmanager
async def lifespan(app: FastAPI):
    gc.collect()
    torch.cuda.empty_cache()

    seed_everything(42)
    models['img2Img'] = GenSD()
    models['txt2Img'] = GenSD()

    models['img2Mesh'] = Img2Mesh()

    # models['txt2Img'].init_sdxl()
    # models['img2Img'].init_instant_mesh()
    yield 

    del models['txt2Img'].pipe
    del models['img2Img'].pipe
    del models['img2Mesh'].model

app = FastAPI(lifespan=lifespan)
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
        # img = cv2.imdecode(np.frombuffer(img_bytes, np.uint8), -1)
        img = Image.open(io.BytesIO(img_bytes))

        # await websocket.send_text("Analyzing image")
        mulit_views = models['img2Img'].forward_mesh(img, num_inference_steps=75)
        
        # await websocket.send_text("Generating mesh")
        mesh_path = models['img2Mesh'](mulit_views)

        # await websocket.send_text("Cleaning mesh")
        mesh = Mesh(mesh_path)
        mesh.clean()
        
        with open(mesh_path, "rb") as obj:
            obj = obj.read()

        await websocket.send_bytes(obj)

@app.websocket("/ws/txt2Mesh/")
async def ws_img_2_mesh(websocket: WebSocket):
    await websocket.accept()
    while True:
        prompt = await websocket.receive_text()
        img = models['txt2Img'].forward_sdxl(f"Picture of {prompt} intricately detailed, high resolution, 3d, full object visible in center of image")

        # await websocket.send_text("Analyzing image")
        mulit_views = models['img2Img'].forward_mesh(img, num_inference_steps=75)
        
        # await websocket.send_text("Generating mesh")
        mesh_path = models['img2Mesh'](mulit_views)

        # await websocket.send_text("Cleaning mesh")
        # mesh = Mesh(mesh_path)
        # mesh.clean()
        
        with open(mesh_path, "rb") as obj:
            obj = obj.read()

        await websocket.send_bytes(obj)