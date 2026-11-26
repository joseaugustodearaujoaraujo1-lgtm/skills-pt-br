import sys, os
from PIL import Image, ImageDraw
pasta, pref, saida = sys.argv[1], sys.argv[2], sys.argv[3]
ini = int(sys.argv[4]) if len(sys.argv) > 4 else 0; fim = int(sys.argv[5]) if len(sys.argv) > 5 else 999
fs = sorted(f for f in os.listdir(pasta) if f.startswith(pref) and f.endswith('.jpg'))[ini:fim]
W, H, cols = 720, 450, 2; rows = (len(fs) + 1) // 2
sh = Image.new('RGB', (cols * W, rows * (H + 16)), (20, 20, 20)); d = ImageDraw.Draw(sh)
for i, f in enumerate(fs):
    im = Image.open(os.path.join(pasta, f)).resize((W, H)); x = (i % cols) * W; y = (i // cols) * (H + 16); sh.paste(im, (x, y)); d.text((x + 4, y + H + 2), f, fill=(255, 255, 0))
sh.save(saida, quality=80); print(len(fs))
