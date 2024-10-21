import io
import asyncio
# from PIL import Image
# from mesh import Mesh
from ninja import NinjaAPI, File
from ninja.files import UploadedFile
from channels.layers import get_channel_layer
# from ai_models import SDXL, InstantMesh, MultiViewer, OpenAI

api = NinjaAPI()
ai_models = {
    # "sdxl": SDXL(),
    # "openai": OpenAI(),
    # "instant_mesh": InstantMesh(),
    # "multi_viewer": MultiViewer(),
}

@api.post("/ai")
def img_2_mesh(request, uid: str, nid: str, file: UploadedFile = File(...)):
    data = file.read()

    img = Image.open(io.BytesIO(data))

    asyncio.run(uid, nid, gen_mesh(img))


async def gen_mesh(uid, nid, img):
    multi_views = ai_models["multi_viewer"].forward(img, num_inference_steps=75)

    mesh_path = ai_models["instant_mesh"].forward(multi_views)
    with open(mesh_path, "rb") as obj:
        mesh_bytes = obj.read()
    
    event = {
        "nid": nid,
        "type": "notify", 
        "mesh": mesh_bytes
    }

    await get_channel_layer().send(uid, event)