# BRUMA ALTA — prepara todas as imagens do site a partir de fotos livres (Wikimedia Commons, ver creditos.json).
# 1) fotos coloridas: recorte na proporção do original + leve tratamento quente/fosco da marca, em WebP;
# 2) "meio-tom em linhas verticais" (identidade visual): máscaras alfa que o CSS pinta com a cor da seção.
# Uso: python3 -I cena/preparar.py <pasta-com-fotos-sd> <pasta-sd3> <pasta-sd4>   (roda na raiz do projeto)
import sys, os, json, numpy as np
from PIL import Image, ImageOps, ImageEnhance, ImageFilter

SD, SD3, SD4 = sys.argv[1], sys.argv[2], sys.argv[3]
OUT = 'public/img'; os.makedirs(OUT, exist_ok=True)
usadas = {}

def foto(pasta, nome):
    usadas[f'{pasta}/{nome}'] = (pasta, nome)
    return Image.open(os.path.join(pasta, nome)).convert('RGB')

def recorte(im, prop, foco=(.5, .5)):
    w, h = im.size
    if w / h > prop: nw = int(h * prop); x = int((w - nw) * foco[0]); return im.crop((x, 0, x + nw, h))
    nh = int(w / prop); y = int((h - nh) * foco[1]); return im.crop((0, y, w, y + nh))

def tratar(im, quente=.06, fosco=.05, sat=.92):
    # tom da marca: um pouco mais quente, pretos levemente erguidos (fosco), saturação contida
    a = np.asarray(im, float) / 255
    a = a * (1 - fosco) + fosco * np.array([.16, .17, .13])
    a[..., 0] *= 1 + quente; a[..., 2] *= 1 - quente
    im = Image.fromarray((np.clip(a, 0, 1) * 255).astype(np.uint8))
    return ImageEnhance.Color(im).enhance(sat)

def salvar(im, nome, larg, q=78):
    if im.width > larg: im = im.resize((larg, round(im.height * larg / im.width)), Image.LANCZOS)
    im.save(os.path.join(OUT, nome), quality=q, method=6); print(nome, im.size)

# ---------- meio-tom ----------
def meiotom(im, L, H=None, cw=8, rh=6, gama=1.15, corte=.9, inverter=False, contraste=1.0, piso=0., liso=0.):
    g = ImageOps.autocontrast(im.convert('L'), cutoff=1)
    if H is None: H = round(g.height * L / g.width)
    g = ImageOps.fit(g, (L, H), Image.LANCZOS)
    a = np.asarray(g, float) / 255
    if inverter: a = 1 - a
    a = np.clip((a - .5) * contraste + .5, 0, 1)
    if liso:  # áreas lisas (céu) ficam quase vazias: a tinta acompanha a textura local
        l = Image.fromarray((a * 255).astype(np.uint8)); r = 7
        m1 = np.asarray(l.filter(ImageFilter.BoxBlur(r)), float) / 255
        m2 = np.asarray(Image.fromarray((a * a * 255).astype(np.uint8)).filter(ImageFilter.BoxBlur(r)), float) / 255
        tex = np.clip((np.sqrt(np.clip(m2 - m1 * m1, 0, 1)) - .015) / .06, 0, 1)
        peso = liso + (1 - liso) * tex
        a = 1 - (1 - a) * peso  # (1-a) é a tinta antes da curva
    nc, nr = L // cw, H // rh
    b = a[:nr * rh, :nc * cw].reshape(nr, rh, nc, cw).mean((1, 3))
    d = np.clip(1 - b, 0, 1) ** gama; d[b > corte] = 0; d[d < piso] = 0
    w = np.rint(d * cw).astype(int)
    out = np.zeros((H, L), np.uint8)
    for i in range(nr):
        for j in range(nc):
            k = w[i, j]
            if k: c0 = j * cw + (cw - k) // 2; out[i * rh:(i + 1) * rh, c0:c0 + k] = 255
    return out

def gravar_mascara(m, nome):
    img = np.zeros(m.shape + (4,), np.uint8); img[..., 3] = m
    Image.fromarray(img).save(os.path.join(OUT, nome), lossless=True, method=6); print(nome, m.shape[::-1])

def degrade_v(H, W, ini, fim, de=0., ate=1.):  # máscara 0..1 em gradiente vertical entre as linhas ini e fim
    y = np.arange(H)[:, None]; t = np.clip((y - ini) / max(1, fim - ini), 0, 1); return np.broadcast_to(de + (ate - de) * t, (H, W))

def dissolver(W, H, de_cima=True, cw=8, semente=3):
    # barras verticais de comprimento aleatório: passagem "digital" entre foto e cor chapada
    rng = np.random.default_rng(semente); out = np.zeros((H, W), np.uint8)
    for j in range(0, W, cw):
        L = int(H * rng.uniform(.15, 1) ** 1.6); k = rng.integers(2, cw)
        if de_cima: out[:L, j:j + k] = 255
        else: out[H - L:, j:j + k] = 255
    # base cheia no lado de onde vem a cor
    if de_cima: out[:int(H * .08)] = 255
    else: out[H - int(H * .08):] = 255
    return out

def araucaria(L, H):
    # só a árvore (sem o mato da esquerda), com barras finas: a silhueta vira linhas verticais e não um borrão
    ar = foto(SD4, 't3-03.jpg'); w, h = ar.size; ar = ar.crop((int(w * .3), int(h * .04), int(w * .94), int(h * .86)))
    g = np.asarray(ImageOps.autocontrast(ar.convert('L'), cutoff=1).resize((L, H)), float) / 255
    sil = (g < .3).astype(float)
    sil *= np.clip((H * .97 - np.arange(H)[:, None]) / (H * .08), 0, 1)  # pé da árvore some aos poucos
    sil[:int(H * .1), int(L * .56):] = 0  # sem a nuvem do canto
    return meiotom(Image.fromarray(((1 - sil * (.42 + .2 * (1 - g))) * 255).astype(np.uint8)), L, H, cw=8, rh=5, gama=1.0, corte=.97)

if __name__ == '__main__':
    # ---------- fotos ----------
    hero = Image.open('cena/fundo.jpg').convert('RGB'); salvar(recorte(hero, 16 / 9, (.5, .5)), 'hero.webp', 1920, 80)
    salvar(tratar(recorte(foto(SD3, 't0-03.jpg'), 304 / 195)), 'mini.webp', 640)
    salvar(tratar(recorte(foto(SD, 't5-02.jpg'), 2 / 1, (.5, .45)), quente=.1), 'lugar.webp', 1920)
    for i, (p, n, f) in enumerate([(SD3, 't0-02.jpg', (.5, .3)), (SD3, 't0-01.jpg', (.5, .5)), (SD3, 't0-04.jpg', (.6, .5)), (SD3, 't0-03.jpg', (.5, .5)), (SD, 't0-03.jpg', (.4, .5)), (SD4, 't0-02.jpg', (.5, .5))], 1):
        salvar(tratar(recorte(foto(p, n), 3 / 4, f)), f'infra-{i}.webp', 720)
    cartoes = [(SD3, 't1-01.jpg', (.35, .5)), (SD3, 't2-01.jpg', (.45, .5)), (SD3, 't6-03.jpg', (.4, .5)), (SD3, 't7-04.jpg', (.3, .5)),
               (SD3, 't4-02.jpg', (.35, .5)), (SD, 't4-00.jpg', (.5, .5)), (SD3, 't5-01.jpg', (.5, .55)), (SD4, 't0-01.jpg', (.5, .5))]
    for i, (p, n, f) in enumerate(cartoes, 1): salvar(tratar(recorte(foto(p, n), 3 / 4, f)), f'cartao-{i}.webp', 820)
    salvar(tratar(recorte(foto(SD, 't4-03.jpg'), 1408 / 868, (.5, .4))), 'linha.webp', 1920)
    for i, (p, n, f) in enumerate([(SD, 't3-02.jpg', (.45, .5)), (SD, 't3-00.jpg', (.5, .5)), (SD, 't3-03.jpg', (.5, .5)), (SD, 't6-00.jpg', (.5, .5))], 1):
        salvar(tratar(recorte(foto(p, n), 567 / 792, f)), f'suite-{i}.webp', 900)
    for i, (p, n, f) in enumerate([(SD3, 't4-03.jpg', (.5, .5)), (SD, 't3-01.jpg', (.5, .5)), (SD3, 't1-02.jpg', (.5, .5)), (SD, 't4-01.jpg', (.5, .5)), (SD, 't5-03.jpg', (.5, .5))], 1):
        salvar(tratar(recorte(foto(p, n), 1408 / 868, f)), f'galeria-{i}.webp', 1920)
    for i, (p, n, f) in enumerate([(SD3, 't2-03.jpg', (.5, .5)), (SD, 't0-01.jpg', (.5, .5)), (SD, 't2-03.jpg', (.5, .5)), (SD3, 't6-00.jpg', (.5, .6)), (SD4, 't0-03.jpg', (.5, .5))], 1):
        salvar(tratar(recorte(foto(p, n), 3 / 2, f)), f'noticia-{i}.webp', 700)
    salvar(tratar(recorte(foto(SD3, 't0-02.jpg'), 1440 / 1800, (.5, .5))), 'alto.webp', 1440)

    # ---------- meio-tom (máscaras alfa) ----------
    # fim do hero: céu vazio, depois araucárias + serras do pôr do sol e a mata fechada até a cor cheia
    W = 1440; m = np.zeros((1800, W), np.uint8)
    pais = meiotom(foto(SD, 't0-04.jpg'), W, 1080, gama=1.05)[:900]
    m[900:1800] = np.maximum(m[900:1800], pais); m[1720:] = 255
    arv = araucaria(600, 860); m[780:1640, 1050:1440] = np.maximum(m[780:1640, 1050:1440], arv[:, :390])
    gravar_mascara(m, 'mt-paisagem.webp')
    # prólogo: hortênsias nas bordas esquerda e direita (miolo livre para o texto)
    fl = meiotom(foto(SD4, 't0-01.jpg'), W, 1020, inverter=True, gama=2.0, corte=.93, contraste=1.35, piso=.22).astype(float)
    x = np.arange(W)[None, :]; borda = np.clip((np.abs(x - W / 2) - 300) / 160, 0, 1)
    gravar_mascara((fl * borda).astype(np.uint8), 'mt-flores.webp')
    # faixa escura → areia: mata pendurada do alto (foto invertida na vertical)
    fx = meiotom(ImageOps.flip(foto(SD, 't0-04.jpg')), W, 1080, gama=1.0)[:360].copy(); fx[:30] = 255
    gravar_mascara(fx, 'mt-faixa.webp')
    gravar_mascara(dissolver(W, 240, de_cima=False), 'mt-dissolve.webp')          # cor chapada vem de baixo
    gravar_mascara(dissolver(W, 480, de_cima=True, semente=8), 'mt-dissolve-cima.webp')
    gravar_mascara(dissolver(W, 480, de_cima=False, semente=11), 'mt-dissolve-baixo.webp')
    # lua nascendo atrás da serra (claro = tinta, pintado em areia sobre o escuro)
    lua = Image.new('L', (W, 1224), 0); disco = foto(SD4, 't1-00.jpg').convert('L'); disco = ImageOps.fit(disco, (560, 532)); lua.paste(disco, (440, 250))
    serra = ImageOps.fit(foto(SD4, 't1-02.jpg').convert('L'), (W, 960)).crop((0, 420, W, 960)); serra = ImageEnhance.Brightness(serra).enhance(.75)
    fade = Image.fromarray((np.clip(np.arange(540) / 200, 0, 1)[:, None] * np.ones((1, W)) * 255).astype(np.uint8))
    lua.paste(serra, (0, 1224 - 540), fade); lua = lua.filter(ImageFilter.GaussianBlur(1))
    # halo suave em volta da lua
    yy, xx = np.mgrid[0:1224, 0:W]; halo = np.exp(-((np.hypot(xx - 720, yy - 516) - 250).clip(0) / 140) ** 2) * 60
    lua = Image.fromarray(np.clip(np.asarray(lua, float) + halo * (np.asarray(lua) < 40), 0, 255).astype(np.uint8))
    gravar_mascara(meiotom(lua.convert('RGB'), W, 1224, inverter=True, gama=1.6, corte=.96, contraste=1.0, piso=.12), 'mt-lua.webp')
    # galhos no palco claro: silhuetas no alto (invertidas) e embaixo, centro livre para o título
    # galhos finos: só o contorno das copas vira "gravetos" de pixel, com falhas aleatórias
    g = ImageOps.fit(foto(SD4, 't3-00.jpg').convert('L'), (W // 8, 900 // 6)); sil = Image.fromarray(((np.asarray(g) < 70) * 255).astype(np.uint8))
    borda = (np.asarray(sil.filter(ImageFilter.MaxFilter(3)), int) - np.asarray(sil.filter(ImageFilter.MinFilter(3)), int)) > 0
    rng = np.random.default_rng(5); borda &= rng.random(borda.shape) > .35
    cel = np.kron(borda, np.ones((6, 8))).astype(bool)[:900, :W]
    larg = np.zeros((900, W), bool); larg[:, (np.arange(W) % 8) < 4] = True; cel &= larg
    yy = np.arange(900)[:, None]; topo = np.flipud(cel) & (yy < 250); base = cel & (yy > 690)
    gravar_mascara(((topo | base) * 255).astype(np.uint8), 'mt-galhos.webp')
    # serras subindo do escuro (fim das suítes)
    se = meiotom(foto(SD, 't5-04.jpg'), W, 812, gama=1.7, piso=.15)[332:].copy(); se[-40:] = 255
    gravar_mascara(se, 'mt-serras.webp')
    # pico sobre as nuvens (claro = tinta)
    pico = meiotom(foto(SD, 't0-00.jpg'), W, 1050, gama=1.7, corte=.88, piso=.15).astype(float)
    xx = np.arange(W)[None, :]; pico *= np.clip((390 - np.abs(xx - 720)) / 90, 0, 1)  # colunas de texto à esquerda e à direita ficam livres
    gravar_mascara(pico.astype(np.uint8), 'mt-pico.webp')
    # estações (claro = tinta)
    for i, (p, n) in enumerate([(SD3, 't0-04.jpg'), (SD, 't2-03.jpg'), (SD, 't5-02.jpg'), (SD4, 't0-00.jpg')], 1):
        e = meiotom(foto(p, n), W, 1020, gama=2.6, corte=.84, piso=.25).astype(float)
        yy, xx = np.mgrid[0:1020, 0:W]; livre = np.maximum(np.clip((xx - 900) / 140, 0, 1), np.clip((70 - yy) / 50, 0, 1))  # direita e faixa do alto
        gravar_mascara((e * livre).astype(np.uint8), f'mt-estacao-{i}.webp')
    # nuvens altas (criadores) e lago (números da casa)
    nv = meiotom(foto(SD, 't5-01.jpg'), W, 2040, inverter=True, gama=1.6, corte=.94, piso=.1, liso=.45).astype(float)
    yy = np.arange(2040)[:, None]; nv *= np.clip(np.maximum(300 - yy, yy - 840) / 90, 0, 1)  # faixa da frase grande fica livre
    gravar_mascara(nv.astype(np.uint8), 'mt-nuvens.webp')
    gravar_mascara(meiotom(foto(SD, 't4-03.jpg'), W, 960, inverter=True, gama=1.6, corte=.94, piso=.1, liso=.45), 'mt-lago.webp')
    # araucária (rodapé e abertura): só a silhueta vira linhas
    gravar_mascara(araucaria(720, 1200), 'mt-araucaria.webp')

    cred = {}
    for d in (SD, SD3, SD4):
        cj = json.load(open(os.path.join(d, 'creditos.json')))
        for k, v in cj.items():
            if f'{d}/{k}' in usadas: cred[f'{os.path.basename(d)}/{k}'] = v
    json.dump(cred, open('public/creditos.json', 'w'), ensure_ascii=False, indent=1); print(len(cred), 'créditos')
