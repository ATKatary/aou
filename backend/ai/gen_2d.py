import torch
import rembg
from utils import *
from diffusers import DiffusionPipeline, EulerAncestralDiscreteScheduler
from instant_mesh.src.utils.infer_util import remove_background, resize_foreground

SDXL = "stabilityai/stable-diffusion-xl-base-1.0"
INSTANT_MESH_UNET = f"{BASE_DIR}/instant_mesh/ckpts/diffusion_pytorch_model.bin"
rembg_session = rembg.new_session()

class GenSD(torch.nn.Module):
    def __init__(self, dtype=torch.float16):
        super(GenSD, self).__init__()
        self.dtype = dtype

    def init_sdxl(self):
        self.pipe = DiffusionPipeline.from_pretrained(
            SDXL, 

            variant="fp16",
            torch_dtype=self.dtype, 
            use_safetensors=True 
        )
        self.to("cuda")
        
    def init_instant_mesh(self):
        self.pipe = DiffusionPipeline.from_pretrained(
            "sudo-ai/zero123plus-v1.2", 

            torch_dtype=self.dtype,
            custom_pipeline="instant_mesh/zero123plus",
        )
        self.pipe.scheduler = EulerAncestralDiscreteScheduler.from_config(self.pipe.scheduler.config, timestep_spacing='trailing')
        unet = torch.load(INSTANT_MESH_UNET, map_location='cpu')
        self.pipe.unet.load_state_dict(unet, strict=True)
        self.to("cuda")
    
    def forward_mesh(self, img, **kwargs):
        self.init_instant_mesh()
        img = remove_background(img, rembg_session)
        img = resize_foreground(img, 0.85)

        img.save(f"{BASE_DIR}/out/processed.png")
        
        multi_views = self.pipe(img, **kwargs).images[0]
        multi_views.save(f"{BASE_DIR}/out/multi_views.png")
        del self.pipe # clear up memory
        return multi_views

    def forward_sdxl(self, prompt, **kwargs):
        self.init_sdxl()
        img = self.pipe(prompt=prompt, **kwargs).images[0]
    
        img.save(f"{BASE_DIR}/out/generated.png")
        del self.pipe
        return img
    
    def to(self, device):
        self.pipe.to(device)
