import torch
from utils import BASE_DIR
from diffusers import DiffusionPipeline

SDXL_MODEL_ID = "stabilityai/stable-diffusion-xl-base-1.0"
class SDXL(torch.nn.Module):
    def __init__(self, dtype=torch.float16):
        super(SDXL, self).__init__()
        self.dtype = dtype

    def init(self):
        self.pipe = DiffusionPipeline.from_pretrained(
            SDXL_MODEL_ID, 

            variant="fp16",
            torch_dtype=self.dtype, 
            use_safetensors=True 
        )
        self.to("cuda")

    def forward(self, prompt, **kwargs):
        self.init()
        img = self.pipe(prompt=prompt, **kwargs).images[0]
    
        del self.pipe
        return img
    
    def to(self, device):
        self.pipe.to(device)
