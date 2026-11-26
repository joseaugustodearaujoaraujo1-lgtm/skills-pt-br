# fundo do hero: serras em camadas (foto livre, ver creditos.json) regradas para o fim de tarde:
# céu pêssego/dourado, névoa quente no alto, serras próximas frias, sol baixo à direita logo acima da crista.
# Uso: python3 graduar-fundo.py foto.jpg saida.jpg
import sys, numpy as np
from PIL import Image
im = Image.open(sys.argv[1]).convert('RGB'); a = np.asarray(im, float) / 255; H, W, _ = a.shape
lum = a @ [.3, .59, .11]
y = np.linspace(0, 1, H)[:, None, None]; x = np.linspace(0, 1, W)[None, :, None]
quente = np.array([1.0, .78, .55])
mix = np.clip(1.15 - y * 1.6, 0, 1) * np.clip(lum[..., None] * 1.6, 0, 1)
b = a * (1 - mix) + (lum[..., None] * quente * 1.12) * mix
b = b * (.82 + .18 * np.clip(1 - y, 0, 1))
sx, sy = .84, .045; d = np.sqrt(((x - sx) * W / H) ** 2 + (y - sy) ** 2)
gl = np.exp(-(d / .05) ** 2) * 1.0 + np.exp(-(d / .3) ** 2) * .38
b = 1 - (1 - b) * (1 - gl * np.array([1, .82, .55]))
Image.fromarray((np.clip(b, 0, 1) ** .95 * 255).astype(np.uint8)).save(sys.argv[2], quality=92)
