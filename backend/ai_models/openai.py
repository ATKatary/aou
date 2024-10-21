import io
import json
import torch
import base64
import requests
from PIL import Image
from openai import OpenAI
from backend.utils import *

with open(f"{BASE_DIR}/.creds/openai_creds.json", "r") as openai_creds:
    OPENAI_API_KEY = json.loads(openai_creds.read())['OPENAI_API_KEY']
    
openai_client = OpenAI(api_key=OPENAI_API_KEY)

class DALLE(torch.nn.Module):
    def __init__(self):
        super(DALLE, self).__init__()
    
    def forward(self, prompt, **kwargs):
        img_url = openai_client.images.generate(
            n=1,
            prompt=prompt,
            model="dall-e-3",
            size="1024x1024",
            quality="standard",
            
            **kwargs
        ).data[0].url
        
        img = Image.open(io.BytesIO(requests.get(img_url).content))
        return img

class Captioner(torch.nn.Module):   
    def __init__(self):
        super(Captioner, self).__init__()
    
    def forward(self, img, **kwargs):
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {OPENAI_API_KEY}"
        }

        base64_img = base64.b64encode(img).decode("utf-8")

        payload = {
        "model": "gpt-4o-mini",
        "messages": [
            {
            "role": "user",
            "content": [
                {
                "type": "text",
                "text": "Describe the geometry of the following image, be explicit with describing the topology and curvature, ignore color and texture. state your answer as a paragraph in a 150 characters or less. Speak of the object using 'a' and 'the'"
                },
                {
                "type": "image_url",
                "image_url": {
                    "url": f"data:image/jpeg;base64,{base64_img}"
                }
                }
            ]
            }
        ],
        "max_tokens": 300
        }

        response = requests.post("https://api.openai.com/v1/chat/completions", headers=headers, json=payload)

        return response.json()['choices'][0]['message']['content']