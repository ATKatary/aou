import sys 
import torch
import rembg
from backend.utils import *
from diffusers import DiffusionPipeline, EulerAncestralDiscreteScheduler

sys.path.append("/home/farazfaruqi")
from instant_mesh.src.utils.infer_util import remove_background, resize_foreground

INSTANT_MESH_UNET = f"{BASE_DIR.parent}/instant_mesh/ckpts/diffusion_pytorch_model.bin"
rembg_session = rembg.new_session()

class MultiViewer(torch.nn.Module):
    def __init__(self, dtype=torch.float16):
        super(MultiViewer, self).__init__()
        self.dtype = dtype
        
    def init(self):
        self.pipe = DiffusionPipeline.from_pretrained(
            "sudo-ai/zero123plus-v1.2", 

            torch_dtype=self.dtype,
            custom_pipeline=f"{BASE_DIR.parent.parent}/instant_mesh/zero123plus",
        )
        self.pipe.scheduler = EulerAncestralDiscreteScheduler.from_config(self.pipe.scheduler.config, timestep_spacing='trailing')
        unet = torch.load(INSTANT_MESH_UNET, map_location='cpu')
        self.pipe.unet.load_state_dict(unet, strict=True)
        self.to("cuda")
    
    def forward(self, img, **kwargs):
        img = remove_background(img, rembg_session)
        img = resize_foreground(img, 0.85)
        
        self.init()
        multi_views = self.pipe(img, **kwargs).images[0]
        del self.pipe # clear up memory
        return multi_views
    
    def to(self, device):
        self.pipe.to(device)
