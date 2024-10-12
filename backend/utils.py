import math
import pymeshlab
import numpy as np
from pathlib import Path
from matplotlib import pyplot as plt 

BASE_DIR = Path(__file__).resolve().parent

def display(imgs, r, c=-1, w=3, h=3):
    """ Display images in a grid """
    n = len(imgs)
    if c == -1: c = math.ceil(n / r)

    fig, axes = plt.subplots(r, c, figsize=(w*c, h))

    for i in range(r):
      for j in range(c):
        if r > 1: 
          if c > 1: axe = axes[i][j]; z = i*r + j
          else: axe = axes[i]; z = i
        elif c > 1: axe = axes[j]; z = j
        else: axe = axes; z = 0
  
        if z < n:
          axe.imshow(np.array(imgs[z]['img']))
          axe.title.set_text((imgs[z]['label']))
          axe.axis("off")
    plt.show()


