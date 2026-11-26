# Gera as ilustrações vetoriais provisórias da ESCUTA (personagens chapados, objetos, caminho e morros).
# São nossas e substituem os personagens do original até chegarem as ilustrações finais (lista em IMAGENS-PARA-GERAR.md).
# Uso: python3 gerar-ilustras.py  → public/img/ilustra/*.svg
import math, os, random

SAIDA = os.path.join(os.path.dirname(__file__), 'public', 'img', 'ilustra')
os.makedirs(SAIDA, exist_ok=True)

TINTA = '#2C2E2A'
PELES = ['#F2C29B', '#C98B5E', '#8A5634', '#E9A97C', '#5E3A22']
CABELOS = ['#2C2E2A', '#6B3A1E', '#E9B44C', '#2C2E2A', '#B5483A']
ROUPAS = ['#6A3FB5', '#2F7DE1', '#F06B8A', '#F5D547', '#3FA36B', '#CDB4F5', '#FF7A45', '#8EC5FF']
CAJU = '#F4A261'


def pt(x, y, ang, comp):
    a = math.radians(ang)
    return x + math.cos(a) * comp, y + math.sin(a) * comp


def membro(x, y, a1, a2, c1, c2, cor, larg):
    x1, y1 = pt(x, y, a1, c1)
    x2, y2 = pt(x1, y1, a2, c2)
    d = f'<path d="M{x:.1f} {y:.1f}L{x1:.1f} {y1:.1f}L{x2:.1f} {y2:.1f}" fill="none" stroke="{cor}" stroke-width="{larg}" stroke-linecap="round" stroke-linejoin="round"/>'
    return d, (x2, y2), (x1, y1)


def pessoa(x, y, s=1.0, pose=None, pele=0, cabelo=0, roupa=(0, 1), sapato='#2C2E2A', cabelo_forma=0, vira=1):
    """Personagem chapado em pé no ponto (x, y) = quadril. pose: ângulos em graus."""
    p = dict(tronco=-90, coxa_e=100, canela_e=95, coxa_d=70, canela_d=110, braco_e=150, ante_e=120, braco_d=-20, ante_d=-50, cabeca=0)
    if pose:
        p.update(pose)
    pe, cb = PELES[pele % 5], CABELOS[cabelo % 5]
    camisa, calca = ROUPAS[roupa[0] % 8], ROUPAS[roupa[1] % 8]
    g = [f'<g transform="translate({x} {y}) scale({s * vira} {s})">']
    # pernas
    for ca, cn in ((p['coxa_e'], p['canela_e']), (p['coxa_d'], p['canela_d'])):
        d, pe_fim, _ = membro(0, 0, ca, cn, 78, 74, calca, 40)
        g.append(d)
        ang = cn
        sx, sy = pe_fim
        g.append(f'<ellipse cx="{sx + 14:.1f}" cy="{sy + 6:.1f}" rx="30" ry="17" fill="{sapato}" transform="rotate({(ang - 90) * .3:.1f} {sx:.1f} {sy:.1f})"/>')
        g.append(f'<path d="M{sx - 12:.1f} {sy + 14:.1f}h52" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".9"/>')
    # tronco
    nx, ny = pt(0, 0, p['tronco'], 92)
    g.append(f'<path d="M0 0L{nx:.1f} {ny:.1f}" stroke="{camisa}" stroke-width="74" stroke-linecap="round"/>')
    g.append(f'<path d="M-22 -6L{nx - 22:.1f} {ny + 10:.1f}" stroke="#fff" stroke-width="7" stroke-linecap="round" opacity=".35"/>')
    # braços
    for ba, an in ((p['braco_e'], p['ante_e']), (p['braco_d'], p['ante_d'])):
        d, mao, _ = membro(nx, ny + 10, ba, an, 62, 58, camisa, 30)
        g.append(d)
        g.append(f'<circle cx="{mao[0]:.1f}" cy="{mao[1]:.1f}" r="17" fill="{pe}"/>')
    # cabeça
    hx, hy = pt(nx, ny, p['tronco'] + p['cabeca'], 58)
    g.append(f'<circle cx="{hx:.1f}" cy="{hy:.1f}" r="36" fill="{pe}"/>')
    if cabelo_forma == 0:
        g.append(f'<path d="M{hx - 38:.1f} {hy - 2:.1f}c-4-34 20-52 44-50c26 2 40 22 34 44c-12-14-30-18-46-14c-14 4-24 12-32 20z" fill="{cb}"/>')
    elif cabelo_forma == 1:
        g.append(f'<circle cx="{hx - 6:.1f}" cy="{hy - 26:.1f}" r="30" fill="{cb}"/><circle cx="{hx - 34:.1f}" cy="{hy - 6:.1f}" r="20" fill="{cb}"/><circle cx="{hx + 22:.1f}" cy="{hy - 30:.1f}" r="18" fill="{cb}"/>')
    elif cabelo_forma == 2:
        g.append(f'<path d="M{hx - 40:.1f} {hy - 6:.1f}h80c0-26-18-44-40-44s-40 18-40 44z" fill="{cb}"/><path d="M{hx - 44:.1f} {hy - 8:.1f}h96" stroke="{cb}" stroke-width="12" stroke-linecap="round"/>')
    else:
        g.append(f'<path d="M{hx - 36:.1f} {hy + 30:.1f}c-14-50 0-84 40-84c36 0 48 30 36 60c-8-20-24-30-42-28c-20 4-30 22-34 52z" fill="{cb}"/>')
    # rosto
    g.append(f'<circle cx="{hx + 14:.1f}" cy="{hy - 2:.1f}" r="4.5" fill="{TINTA}"/><path d="M{hx + 6:.1f} {hy + 16:.1f}q10 9 22 0" fill="none" stroke="{TINTA}" stroke-width="4" stroke-linecap="round"/>')
    g.append('</g>')
    return '\n'.join(g)


def svg(nome, w, h, corpo):
    with open(os.path.join(SAIDA, nome), 'w') as f:
        f.write(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" width="{w}" height="{h}">\n{corpo}\n</svg>\n')


def confete(rnd, n, w, h):
    out = []
    for _ in range(n):
        x, y = rnd.uniform(0, w), rnd.uniform(0, h)
        c = rnd.choice(ROUPAS)
        if rnd.random() < .5:
            out.append(f'<path d="M{x:.0f} {y:.0f}q8-14 16 0t16 0" fill="none" stroke="{c}" stroke-width="6" stroke-linecap="round"/>')
        else:
            out.append(f'<circle cx="{x:.0f}" cy="{y:.0f}" r="{rnd.uniform(4, 8):.1f}" fill="{c}"/>')
    return '\n'.join(out)


rnd = random.Random(7)

# 1. grupo do hero: quatro pessoas avançando juntas, a da frente apontando
grupo = [
    '<ellipse cx="380" cy="500" rx="330" ry="22" fill="#2C2E2A" opacity=".12"/>',
    pessoa(130, 330, .95, dict(tronco=-70, coxa_e=120, canela_e=150, coxa_d=40, canela_d=90, braco_e=180, ante_e=200, braco_d=-10, ante_d=-30), pele=2, cabelo=0, roupa=(1, 3), cabelo_forma=1),
    pessoa(260, 320, 1.0, dict(tronco=-75, coxa_e=130, canela_e=160, coxa_d=50, canela_d=80, braco_e=200, ante_e=230, braco_d=-40, ante_d=-70), pele=0, cabelo=2, roupa=(5, 4), cabelo_forma=3),
    pessoa(390, 330, 1.05, dict(tronco=-65, coxa_e=125, canela_e=150, coxa_d=35, canela_d=70, braco_e=170, ante_e=190, braco_d=-15, ante_d=-25), pele=3, cabelo=4, roupa=(6, 7), cabelo_forma=0),
    pessoa(520, 320, 1.12, dict(tronco=-60, coxa_e=130, canela_e=165, coxa_d=30, canela_d=60, braco_e=160, ante_e=170, braco_d=-25, ante_d=-30, cabeca=-8), pele=1, cabelo=0, roupa=(2, 3), cabelo_forma=2),
    '<path d="M688 120l22-8-6 22" fill="none" stroke="#2C2E2A" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>',
    confete(rnd, 16, 737, 260),
]
svg('grupo.svg', 737, 527, '<g transform="translate(-60 40) scale(1.16)">' + '\n'.join(grupo) + '</g>')

# 2. personagens da linha do tempo
svg('corredora.svg', 420, 600, pessoa(200, 330, 1.25, dict(tronco=-80, coxa_e=150, canela_e=110, coxa_d=20, canela_d=100, braco_e=-150, ante_e=-120, braco_d=10, ante_d=60), pele=0, cabelo=4, roupa=(1, 5), cabelo_forma=3) + confete(rnd, 6, 420, 200))
svg('musico.svg', 560, 680, pessoa(260, 380, 1.3, dict(tronco=-95, coxa_e=110, canela_e=90, coxa_d=60, canela_d=95, braco_e=-20, ante_e=-60, braco_d=-10, ante_d=-40), pele=2, cabelo=0, roupa=(3, 1), cabelo_forma=1)
    + '<path d="M392 150l90-30v60z" fill="#F5D547"/><circle cx="486" cy="150" r="34" fill="#F5D547" stroke="#E0B92B" stroke-width="6"/>')
svg('gamer.svg', 480, 600, pessoa(220, 360, 1.2, dict(tronco=-100, coxa_e=40, canela_e=100, coxa_d=20, canela_d=110, braco_e=30, ante_e=-20, braco_d=20, ante_d=-30), pele=1, cabelo=2, roupa=(4, 6), cabelo_forma=2)
    + '<rect x="300" y="200" width="110" height="64" rx="30" fill="#2F7DE1"/><circle cx="330" cy="232" r="9" fill="#fff"/><circle cx="380" cy="226" r="7" fill="#F06B8A"/><circle cx="394" cy="242" r="7" fill="#F5D547"/>')
svg('jogador.svg', 620, 640, pessoa(300, 360, 1.25, dict(tronco=-70, coxa_e=170, canela_e=200, coxa_d=30, canela_d=60, braco_e=-140, ante_e=-110, braco_d=-30, ante_d=-60), pele=3, cabelo=0, roupa=(6, 2), cabelo_forma=0)
    + '<circle cx="540" cy="470" r="54" fill="#fff" stroke="#2C2E2A" stroke-width="6"/><path d="M540 440l26 18-10 30h-32l-10-30z" fill="#2C2E2A"/>')
ciclistas = [
    '<circle cx="250" cy="520" r="90" fill="none" stroke="#2C2E2A" stroke-width="12"/><circle cx="560" cy="520" r="90" fill="none" stroke="#2C2E2A" stroke-width="12"/>',
    '<path d="M250 520L380 400L560 520M380 400L470 400L560 520M380 400L350 330M470 400L490 330" fill="none" stroke="#F06B8A" stroke-width="16" stroke-linecap="round" stroke-linejoin="round"/>',
    pessoa(390, 330, 1.0, dict(tronco=-70, coxa_e=60, canela_e=110, coxa_d=20, canela_d=120, braco_e=-10, ante_e=10, braco_d=-20, ante_d=0), pele=1, cabelo=3, roupa=(3, 1), cabelo_forma=3),
    pessoa(130, 420, 1.0, dict(tronco=-75, coxa_e=150, canela_e=110, coxa_d=30, canela_d=90, braco_e=-150, ante_e=-120, braco_d=-20, ante_d=-60), pele=4, cabelo=0, roupa=(7, 6), cabelo_forma=1),
    pessoa(690, 420, 1.0, dict(tronco=-105, coxa_e=110, canela_e=80, coxa_d=60, canela_d=100, braco_e=-160, ante_e=-140, braco_d=-30, ante_d=-90), pele=0, cabelo=2, roupa=(5, 2), cabelo_forma=0, vira=-1),
]
svg('ciclistas.svg', 806, 640, '\n'.join(ciclistas))

# 3. objetos soltos
svg('relogio.svg', 150, 150, '<circle cx="75" cy="75" r="62" fill="#F5D547" stroke="#2C2E2A" stroke-width="7"/><circle cx="75" cy="75" r="44" fill="#fff"/><path d="M75 45v32l20 14" fill="none" stroke="#2C2E2A" stroke-width="7" stroke-linecap="round"/>')
svg('pasta.svg', 180, 150, '<path d="M14 40h56l14 16h82v78H14z" fill="#8EC5FF" stroke="#2C2E2A" stroke-width="6" stroke-linejoin="round"/><path d="M14 70h152" stroke="#2C2E2A" stroke-width="6"/>')
svg('aviao.svg', 120, 100, '<path d="M8 50L112 10L72 92L58 60z" fill="#fff" stroke="#2C2E2A" stroke-width="5" stroke-linejoin="round"/><path d="M58 60L112 10" stroke="#2C2E2A" stroke-width="5"/>')
svg('folha.svg', 140, 120, '<path d="M20 20h80l20 20v70H20z" fill="#fff" stroke="#2C2E2A" stroke-width="5" stroke-linejoin="round"/><path d="M38 52h56M38 70h56M38 88h36" stroke="#2C2E2A" stroke-width="5" stroke-linecap="round"/>')
svg('nota.svg', 100, 120, '<path d="M38 92V20l46-10v70" fill="none" stroke="#2C2E2A" stroke-width="8" stroke-linejoin="round"/><ellipse cx="26" cy="94" rx="18" ry="14" fill="#6A3FB5"/><ellipse cx="72" cy="82" rx="18" ry="14" fill="#6A3FB5"/>')
svg('controle.svg', 160, 150, '<path d="M30 40h100c20 0 28 30 22 60c-6 24-26 30-40 10l-10-14H48l-10 14c-14 20-34 14-40-10c-6-30 2-60 32-60z" fill="#2F7DE1"/><path d="M42 66h28M56 52v28" stroke="#fff" stroke-width="8" stroke-linecap="round"/><circle cx="108" cy="58" r="8" fill="#F06B8A"/><circle cx="124" cy="76" r="8" fill="#F5D547"/>')
svg('bola.svg', 120, 120, '<circle cx="60" cy="60" r="52" fill="#fff" stroke="#2C2E2A" stroke-width="6"/><path d="M60 34l24 18-9 28H45l-9-28z" fill="#2C2E2A"/>')
for i, (w, h) in enumerate([(475, 96), (300, 70), (220, 60), (115, 27), (72, 23)], 1):
    r = h * .42
    bolhas = ''.join(f'<circle cx="{w * fx:.1f}" cy="{h - r * fr:.1f}" r="{r * fr:.1f}" fill="#fff"/>' for fx, fr in [(.18, .9), (.36, 1.45), (.56, 1.2), (.74, 1.0), (.86, .7)])
    svg(f'nuvem-{i}.svg', w, h, f'<rect x="{w * .1:.1f}" y="{h - r:.1f}" width="{w * .82:.1f}" height="{r:.1f}" rx="{r / 2:.1f}" fill="#fff"/>' + bolhas)

# 4. caminho sinuoso da linha do tempo (1498 x 4738)
W, H = 1498, 4738
caminho = ('M760 -40 C 760 260, 300 340, 300 700 S 1180 1100, 1180 1500 S 260 1900, 300 2350 '
           'S 1200 2700, 1160 3150 S 380 3500, 420 3900 S 1100 4300, 760 4780')
svg('caminho.svg', W, H, f'<path d="{caminho}" fill="none" stroke="{CAJU}" stroke-width="300" stroke-linecap="round"/>'
    f'<path d="{caminho}" fill="none" stroke="#fff" stroke-width="5" stroke-dasharray="2 34" stroke-linecap="round" opacity=".55"/>')

# 5. morros do fim (3 camadas)
svg('morro-tras.svg', 1440, 411, f'<path d="M0 160C200 40 380 60 560 140S900 40 1100 90S1340 60 1440 120V411H0z" fill="#E98E46"/>')
svg('morro-meio.svg', 1440, 205, f'<path d="M0 90C260 10 520 20 760 80S1220 20 1440 70V205H0z" fill="#F0974F"/>'
    + ''.join(f'<circle cx="{x}" cy="{y}" r="{r}" fill="{c}"/>' for x, y, r, c in [(120, 70, 14, '#F06B8A'), (400, 50, 12, '#F5D547'), (820, 70, 14, '#fff'), (1180, 52, 12, '#CDB4F5')]))
svg('morro-frente.svg', 1440, 271, f'<path d="M0 120C180 60 340 70 520 130S860 200 1060 120S1340 60 1440 100V271H0z" fill="{CAJU}"/>'
    + ''.join(f'<g transform="translate({x} {y})"><path d="M0 0v-46" stroke="#3FA36B" stroke-width="6"/><circle cy="-52" r="16" fill="{c}"/><circle cy="-52" r="6" fill="#F5D547"/></g>' for x, y, c in [(90, 150, '#F06B8A'), (260, 120, '#fff'), (700, 180, '#CDB4F5'), (980, 170, '#F06B8A'), (1300, 120, '#fff')]))
print('ilustrações geradas em', SAIDA)
