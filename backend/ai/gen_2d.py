import torch
from utils import *
from diffusers import DiffusionPipeline, EulerAncestralDiscreteScheduler

SDXL = "stabilityai/stable-diffusion-xl-base-1.0"
INSTANT_MESH_UNET = f"{BASE_DIR}/instant_mesh/unet.bin"

class GenSD(torch.nn.Module):
    def __init__(self, model="sdxl", dtype=torch.float16):
        super(GenSD, self).__init__()
        self.model = model
        if model == "sdxl":
            self.pipe = DiffusionPipeline.from_pretrained(
                SDXL, 

                variant="fp16",
                torch_dtype=dtype, 
                use_safetensors=True 
            )
        
        elif model == "instant_mesh":
            self.pipe = DiffusionPipeline.from_pretrained(
                "sudo-ai/zero123plus-v1.2", 

                torch_dtype=dtype,
                custom_pipeline="zero123plus",
            )
            self.pipe.scheduler = EulerAncestralDiscreteScheduler.from_config(self.pipe.scheduler.config, timestep_spacing='trailing')
            unet = torch.load(INSTANT_MESH_UNET, map_location='cpu')
            self.pipe.unet.load_state_dict(unet, strict=True)
    
    def forward(self, x, **kwargs):
        return self.pipe(x, **kwargs).images[0]

    def to(self, device):
        self.pipe.to(device)
