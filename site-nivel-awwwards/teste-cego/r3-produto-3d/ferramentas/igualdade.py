# Portão de igualdade (3d-leve.md, Regra 0): compara o molde (render PNG sem perdas) com o que o site exibe (quadros WebP do palco).
# Uso: python3 ferramentas/igualdade.py  (depois de: node ferramentas/gerar-imagens.mjs igualdade)
from PIL import Image, ImageChops
import json, os
R = os.path.join(os.path.dirname(__file__), '..')
res = {}
for nome, q in [('montado', 'q00'), ('aberto', 'q23')]:
    a = Image.open(f'{R}/referencias-3d/moedor/igualdade-molde-{nome}.png').convert('RGBA')
    b = Image.open(f'{R}/public/img/quadros/{q}.webp').convert('RGBA')
    ma = a.split()[3].point(lambda v: 255 if v > 200 else 0); mb = b.split()[3].point(lambda v: 255 if v > 200 else 0)
    inter = ImageChops.multiply(ma, mb).histogram()[255]; uni = ImageChops.lighter(ma, mb).histogram()[255]
    ba, bb = ma.getbbox(), mb.getbbox()
    ra = (ba[2] - ba[0]) / (ba[3] - ba[1]); rb = (bb[2] - bb[0]) / (bb[3] - bb[1])
    dif = ImageChops.difference(a.convert('RGB'), b.convert('RGB')); px = [p for p, m in zip(dif.getdata(), mb.getdata()) if m]
    res[nome] = { 'iou': round(inter / uni, 4), 'razao_molde': round(ra, 4), 'razao_site': round(rb, 4), 'dif_razao_%': round(abs(ra - rb) / ra * 100, 2), 'dif_cor_media_0_255': round(sum(sum(p) / 3 for p in px) / len(px), 2) }
print(json.dumps(res, indent=1))
