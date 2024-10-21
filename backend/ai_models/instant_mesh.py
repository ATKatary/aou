import sys 
import torch
import pymeshlab
import numpy as np
from utils import BASE_DIR
from einops import rearrange
from omegaconf import OmegaConf
from torchvision.transforms import v2

sys.path.append("/home/farazfaruqi")
from instant_mesh.src.utils.mesh_util import *
from instant_mesh.src.utils.train_util import *
from instant_mesh.src.utils.camera_util import *

INSTANT_MESH_BASE_CONFIG = f"{BASE_DIR.parent}/instant_mesh/configs/instant-mesh-base.yaml"

class InstantMesh(torch.nn.Module):
    def __init__(self, config=INSTANT_MESH_BASE_CONFIG, device="cuda"):
        super(InstantMesh, self).__init__()
        self.device = device
        self.config = OmegaConf.load(config)
        
        self.model_config = self.config.model_config
        self.infer_config = self.config.infer_config

        self.model = instantiate_from_config(self.model_config)
        
        state_dict = torch.load(self.infer_config.model_path, map_location='cpu')['state_dict']
        state_dict = {k[14:]: v for k, v in state_dict.items() if k.startswith('lrm_generator.')}
        
        self.model.load_state_dict(state_dict, strict=True)

        self.to(device)
        self.model.init_flexicubes_geometry(device, fovy=30.0)

        self.model = self.model.eval()
        self.cameras = get_zero123plus_input_cameras(batch_size=1, radius=4.0).to(device)

    def forward(self, img, **kwargs):
        img = np.asarray(img, dtype=np.float32) / 255.0
        img = torch.from_numpy(img).permute(2, 0, 1).contiguous().float()     # (3, 960, 640)
        img = rearrange(img, 'c (n h) (m w) -> (n m) c h w', n=3, m=2)        # (6, 3, 320, 320)

        img = img.unsqueeze(0).to(self.device)
        img = v2.functional.resize(img, 320, interpolation=3, antialias=True).clamp(0, 1)

        with torch.no_grad():
            # get triplane
            planes = self.model.forward_planes(img, self.cameras)

            # get mesh
            mesh_out = self.model.extract_mesh(
                planes,
                use_texture_map=False,
                **self.infer_config,
            )

            vertices, faces, vertex_colors = mesh_out[:3]
            return pymeshlab.Mesh(vertices, faces, v_color_matrix=vertex_colors)

    def to(self, device):
        self.model.to(device)

