# marca "listrada" (estilo varredura): corpo da letra cheio, bordas de cima/baixo de cada trecho com "dentes" estreitos
# (pente) e poucas frestas verticais internas. Uso: listrar.py entrada saida [col] [semente]
import sys, numpy as np
from PIL import Image
ent, sai = sys.argv[1], sys.argv[2]; col = int(sys.argv[3]) if len(sys.argv) > 3 else 12; rng = np.random.default_rng(int(sys.argv[4]) if len(sys.argv) > 4 else 7)
a = np.array(Image.open(ent).convert('RGBA'))[:, :, 3] > 110
bb = np.argwhere(a); y0, x0 = bb.min(0); y1, x1 = bb.max(0)
pad = 40; a = a[max(0, y0 - pad):y1 + pad, max(0, x0 - 10):x1 + 10]
H, W = a.shape; out = np.zeros_like(a)
dente = col * 2.4; larg = max(3, int(col * .6))
for j in range(0, W, col):
    fatia = a[:, j:j + col].mean(1) > .5
    out[:, j:j + col] = fatia[:, None]            # corpo quantizado em colunas
    d = np.diff(np.r_[0, fatia.astype(int), 0]); ini = np.where(d == 1)[0]; fim = np.where(d == -1)[0]
    for s, e in zip(ini, fim):
        if e - s < col: continue
        t = int(dente * rng.choice([.35, .7, 1, 1, 1.2])); b = int(dente * rng.choice([.35, .7, 1, 1, 1.2]))
        out[max(0, s - t):s, j:j + larg] = True      # dente para cima
        out[e:min(H, e + b), j:j + larg] = True      # dente para baixo
        # fresta interna curta (risco escuro) de vez em quando
        if rng.random() < .16 and e - s > col * 4:
            m = rng.integers(s + col, e - col); L = int(rng.uniform(.18, .4) * (e - s))
            out[m:min(e - col, m + L), j + col // 2 - 2:j + col // 2 + 1] = False
img = np.zeros((H, W, 4), np.uint8); img[out] = (0, 0, 0, 255)
Image.fromarray(img).save(sai); print(sai, W, H)
