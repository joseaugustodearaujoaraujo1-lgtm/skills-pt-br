# folha lado a lado (original à esquerda, nosso à direita), tela por tela
# uso: python3 lado-or.py <pasta-original (m-NN.jpg)> <pasta-nossa (o-NN.jpg)> <0,1,2,...> <saida.jpg>
import sys, os
from PIL import Image, ImageDraw
orig_dir, nosso_dir, idx, saida = sys.argv[1], sys.argv[2], [int(x) for x in sys.argv[3].split(',')], sys.argv[4]
W, H = 480, 300
sh = Image.new('RGB', (W * 2 + 10, len(idx) * (H + 14)), (20, 20, 20)); d = ImageDraw.Draw(sh)
for r, i in enumerate(idx):
    for c, f in enumerate([f'{orig_dir}/m-{i:02d}.jpg', f'{nosso_dir}/o-{i:02d}.jpg']):
        if os.path.exists(f): sh.paste(Image.open(f).resize((W, H)), (c * (W + 10), r * (H + 14)))
    d.text((4, r * (H + 14) + H + 1), f'{i:02d}', fill=(255, 255, 0))
sh.save(saida, quality=78)
