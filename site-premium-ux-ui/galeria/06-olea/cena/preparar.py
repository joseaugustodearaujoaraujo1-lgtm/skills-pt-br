# OLEA — prepara as imagens do site: abertura com foco no sabonete, versão térmica da bancada, fotos provisórias
# (licença livre, Wikimedia Commons) recortadas nas proporções do original, casca de oliveira em close e créditos.
# Uso: python3 -I cena/preparar.py <pasta-fotos-ol>   (roda na raiz do projeto, depois de gerar os renders 3D)
import sys, os, json, numpy as np
from PIL import Image, ImageFilter, ImageDraw, ImageOps, ImageEnhance
FO = sys.argv[1]; OUT = 'public/img'; usadas = {}
def foto(n): usadas[n] = 1; return Image.open(os.path.join(FO, n)).convert('RGB')
def recorte(im, prop, foco=(.5, .5)):
    w, h = im.size
    if w / h > prop: nw = int(h * prop); x = int((w - nw) * foco[0]); return im.crop((x, 0, x + nw, h))
    nh = int(w / prop); y = int((h - nh) * foco[1]); return im.crop((0, y, w, y + nh))
def quente(im, k=.07, sat=.9):  # tom da marca: quente, pretos erguidos, saturação contida
    a = np.asarray(im, float) / 255; a = a * .95 + .05 * np.array([.12, .11, .07]); a[..., 0] *= 1 + k; a[..., 2] *= 1 - k
    return ImageEnhance.Color(Image.fromarray((np.clip(a, 0, 1) * 255).astype(np.uint8))).enhance(sat)
def salvar(im, nome, larg, q=80):
    if im.width > larg: im = im.resize((larg, round(im.height * larg / im.width)), Image.LANCZOS)
    im.save(os.path.join(OUT, nome), quality=q, method=6); print(nome, im.size)

# abertura: desfoque forte em tudo, menos no sabonete (máscara elíptica macia)
im = Image.open(f'{OUT}/mesa-abertura.webp').convert('RGB'); W, H = im.size
bl = im.filter(ImageFilter.GaussianBlur(16)); m = Image.new('L', (W, H), 0)
ImageDraw.Draw(m).ellipse((W * .5 - W * .15, H * .5 - H * .22, W * .5 + W * .15, H * .5 + H * .25), fill=255)
salvar(Image.composite(im, bl, m.filter(ImageFilter.GaussianBlur(30))), 'abertura.webp', 1920)
# térmica: luminância da bancada → mapa de cor "inferno" (roxo → laranja → amarelo), o sabonete mais quente
b = np.asarray(Image.open(f'{OUT}/mesa-bancada.webp').convert('L'), float) / 255
yy, xx = np.mgrid[0:b.shape[0], 0:b.shape[1]]; calor = np.exp(-(((xx - b.shape[1] * .52) / (b.shape[1] * .12)) ** 2 + ((yy - b.shape[0] * .73) / (b.shape[0] * .1)) ** 2))
t = np.clip(b * .55 + calor * .75, 0, 1)
pts = np.array([[0, 0, 4], [.25, 60, 12, 110], [.45, 150, 30, 120], [.65, 230, 80, 50], [.82, 252, 160, 20], [1, 252, 250, 170]], dtype=object)
xs = [0, .25, .45, .65, .82, 1]; cs = np.array([[10, 6, 40], [62, 14, 112], [150, 32, 118], [230, 82, 52], [252, 162, 22], [252, 248, 168]], float)
rgb = np.stack([np.interp(t, xs, cs[:, k]) for k in range(3)], -1)
salvar(Image.fromarray(rgb.astype(np.uint8)).filter(ImageFilter.GaussianBlur(1.2)), 'mesa-termica.webp', 1920)
# fotos provisórias (estilo de vida / galeria / avaliações / produto)
mapa = {
  'vida-1': ('t1-04.jpg', 3 / 4, (.5, .4)), 'vida-2': ('t0-00.jpg', 3 / 4, (.4, .5)), 'vida-3': ('t4-00.jpg', 3 / 4, (.6, .5)),
  'vida-4': ('t1-00.jpg', 3 / 4, (.5, .5)), 'vida-5': ('t0-02.jpg', 3 / 4, (.3, .5)), 'vida-6': ('t4-01.jpg', 3 / 4, (.5, .5)),
  'vida-7': ('t0-01.jpg', 3 / 4, (.5, .5)), 'vida-8': ('t0-03.jpg', 3 / 4, (.5, .5)),
  'galeria-noite': ('t4-02.jpg', 1280 / 720, (.5, .5)), 'galeria-chuveiro': ('t3-01.jpg', 1500 / 720, (.5, .5)),
  'galeria-queda': ('t0-01.jpg', 1500 / 720, (.5, .6)), 'galeria-legado': ('t2-04.jpg', 1500 / 720, (.5, .4)),
  'review-1': ('t4-01.jpg', 4 / 3, (.5, .5)), 'review-2': ('t0-03.jpg', 4 / 3, (.5, .5)), 'review-3': ('t1-03.jpg', 4 / 3, (.5, .5)), 'review-4': ('t0-00.jpg', 4 / 3, (.5, .5)),
}
for nome, (f, prop, foco) in mapa.items():
    im = quente(recorte(foto(f), prop, foco))
    if nome == 'galeria-legado': im = ImageOps.colorize(ImageOps.grayscale(im), '#1a140c', '#efe2c6')
    salvar(im, nome + '.webp', 1500 if nome.startswith('galeria') else 800)
# casca de oliveira em close (tronco antigo), duas metades que se abrem
casca = foto('t4-01.jpg'); w, h = casca.size; casca = casca.crop((int(w * .05), int(h * .25), int(w * .45), int(h * .75)))
casca = ImageEnhance.Contrast(quente(casca, .1, .8)).enhance(1.25); salvar(recorte(casca, 16 / 9), 'casca.webp', 1920)
# cartão de microtextura (coeficiente de atrito): close cinza do próprio render da borda
bz = Image.open(f'{OUT}/borda-azulejo.webp').convert('L'); bz = bz.crop((700, 380, 1220, 660)).resize((520, 280)); salvar(ImageOps.autocontrast(bz).convert('RGB'), 'micro.webp', 520)
cred = {}
cj = json.load(open(os.path.join(FO, 'creditos.json')))
for k in usadas: cred[k] = cj[k]
json.dump(cred, open('public/creditos.json', 'w'), ensure_ascii=False, indent=1); print(len(cred), 'créditos')
