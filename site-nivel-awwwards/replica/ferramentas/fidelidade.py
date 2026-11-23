# Nota de FIDELIDADE da réplica: compara original x nosso, tela por tela, com as tolerâncias do PROTOCOLO.md (seção 5.5).
#
# Uso:
#   python3 -I fidelidade.py <pasta-original> <pasta-nossa> [--limite 75] [--diferencas <pasta>] [--alturas H_original,H_nossa]
#   python3 -I fidelidade.py <original.jpg> <nosso.jpg> [...]          (uma tela só)
#
# As telas são pareadas pelo número no nome (m-07.jpg do estudar3.cjs com o-07.jpg do telas2.cjs; d-03-x.jpg com d-03-y.jpg).
# Tire as duas séries com o MESMO passo e a mesma largura (PROTOCOLO 5.1 e 5.2).
#
# O que mede (paleta, textos e fotos podem mudar: o protocolo manda trocar):
#   ssim   = parte de CONTRASTE+ESTRUTURA do SSIM em tons de cinza, com a imagem reduzida a 480 px de largura,
#            o melhor valor entre deslocamentos de até 8 px (deslocamento dentro da tolerância não tira ponto);
#            (sem o termo de brilho, para que trocar a paleta não derrube a nota; texto vira mancha e conta como bloco).
#   estr   = estrutura: bordas do original e do nosso a 720 px de largura; F1 de bordas que caem a até 8 px uma da outra
#            (tolerância de posição e tamanho de blocos do PROTOCOLO 5.5).
#   desl   = deslocamento vertical estimado (px na tela real) entre os perfis de borda; acima de 8 px é aviso de posição,
#            e acima de 2% de 900 px (18 px) quase sempre é rolagem fora de sincronia (início/fim de animação).
#   nota   = 100 x (0,4 ssim + 0,6 estr), de 0 a 100.
# Saída: texto com a nota por tela e o total. Imagem de diferença SÓ para tela abaixo do limite, e nunca dentro de um repositório
# git (a imagem tem pixels do original; capturas do original ficam fora do repositório).
# Código de saída: 0 se todas as telas passam e a altura está dentro de 1%; 1 se não.
import sys, os, re, subprocess
import numpy as np
from PIL import Image

LIMITE_PADRAO = 75.0   # nota mínima por tela (ver "Calibração" em PROTOCOLO.md, seção 5.5)
TOL_PX = 8             # PROTOCOLO 5.5: posição e tamanho de blocos até 8 px
TOL_ALTURA = 0.01      # PROTOCOLO 5.5: altura da página e das seções até 1%
TOL_ANIM = 0.02        # PROTOCOLO 5.5: início/fim de animação até 2% do trecho


def args():
    a = sys.argv[1:]
    op = {'limite': LIMITE_PADRAO, 'diferencas': None, 'alturas': None}
    pos = []
    i = 0
    while i < len(a):
        if a[i].startswith('--'):
            op[a[i][2:]] = a[i + 1]; i += 2
        else:
            pos.append(a[i]); i += 1
    if len(pos) != 2:
        print(__doc__ or open(__file__).read().split('import sys')[0]); sys.exit(2)
    op['limite'] = float(op['limite'])
    return pos, op


def cinza(caminho, largura):
    im = Image.open(caminho).convert('L')
    w, h = im.size
    return np.asarray(im.resize((largura, round(h * largura / w)), Image.BILINEAR), dtype=np.float64), (w, h)


def caixa(x, r):
    # média em janela (2r+1)x(2r+1) por imagem integral, com borda replicada
    p = np.pad(x, r + 1, mode='edge')
    s = p.cumsum(0).cumsum(1)
    k = 2 * r + 1
    t = s[k:, k:] - s[:-k, k:] - s[k:, :-k] + s[:-k, :-k]
    return t[:x.shape[0], :x.shape[1]] / (k * k)


def ssim_cs(a, b, r=3):
    # termo de contraste x estrutura do SSIM (Wang et al. 2004), sem o termo de brilho
    c2 = (0.03 * 255) ** 2
    ma, mb = caixa(a, r), caixa(b, r)
    va = np.maximum(caixa(a * a, r) - ma * ma, 0)
    vb = np.maximum(caixa(b * b, r) - mb * mb, 0)
    cov = caixa(a * b, r) - ma * mb
    m = (2 * cov + c2) / (va + vb + c2)
    return float(np.clip(m.mean(), 0, 1))


def bordas(x):
    x = caixa(x, 1)
    gx = np.zeros_like(x); gy = np.zeros_like(x)
    gx[:, 1:-1] = x[:, 2:] - x[:, :-2]
    gy[1:-1, :] = x[2:, :] - x[:-2, :]
    mag = np.hypot(gx, gy)
    # limiar absoluto (borda visível) e relativo (ignora ruído de textura fina)
    lim = max(12.0, np.percentile(mag, 85))
    return mag > lim


def dilatar(m, r):
    return caixa(m.astype(np.float64), r) > 0


def f1_bordas(ea, eb, r):
    na, nb = ea.sum(), eb.sum()
    if na == 0 and nb == 0:
        return 1.0
    if na == 0 or nb == 0:
        return 0.0
    prec = (eb & dilatar(ea, r)).sum() / nb   # o que desenhamos existe no original
    rec = (ea & dilatar(eb, r)).sum() / na    # o que o original tem existe no nosso
    return float(2 * prec * rec / (prec + rec)) if prec + rec else 0.0


def deslocamento(ea, eb, escala, maxpx=120):
    pa = ea.sum(1).astype(np.float64); pb = eb.sum(1).astype(np.float64)
    pa -= pa.mean(); pb -= pb.mean()
    if not pa.any() or not pb.any():
        return 0
    lim = int(maxpx / escala)
    melhor, dmelhor = -1e18, 0
    for d in range(-lim, lim + 1):
        if d >= 0:
            v = float((pa[d:] * pb[:len(pb) - d]).sum())
        else:
            v = float((pa[:d] * pb[-d:]).sum())
        if v > melhor:
            melhor, dmelhor = v, d
    return round(-dmelhor * escala)  # positivo: nosso está mais para baixo


def comparar(fo, fn):
    a1, (w, h) = cinza(fo, 480)
    b1, _ = cinza(fn, 480)
    hh = min(a1.shape[0], b1.shape[0]); a1, b1 = a1[:hh], b1[:hh]
    # deslocamento dentro da tolerância não é erro: melhor SSIM entre deslocamentos de até TOL_PX (em x e y)
    t = max(1, round(TOL_PX * 480 / w))
    s = max(ssim_cs(a1[max(0, dy):hh + min(0, dy), max(0, dx):a1.shape[1] + min(0, dx)],
                    b1[max(0, -dy):hh + min(0, -dy), max(0, -dx):b1.shape[1] + min(0, -dx)])
            for dy in range(-t, t + 1) for dx in range(-t, t + 1))
    a2, _ = cinza(fo, 720)
    b2, _ = cinza(fn, 720)
    hh = min(a2.shape[0], b2.shape[0]); a2, b2 = a2[:hh], b2[:hh]
    escala = w / 720
    ea, eb = bordas(a2), bordas(b2)
    r = max(1, round(TOL_PX / escala))
    e = f1_bordas(ea, eb, r)
    d = deslocamento(ea, eb, escala)
    nota = 100 * (0.4 * s + 0.6 * e)
    return {'ssim': s, 'estr': e, 'desl': d, 'nota': nota, 'ea': ea, 'eb': eb, 'r': r, 'tam': (w, h)}


def dentro_de_repo(pasta):
    try:
        out = subprocess.run(['git', '-C', pasta, 'rev-parse', '--is-inside-work-tree'], capture_output=True, text=True)
        return out.stdout.strip() == 'true'
    except Exception:
        return False


def salvar_diferenca(fo, fn, res, pasta, nome):
    os.makedirs(pasta, exist_ok=True)
    ea, eb, r = res['ea'], res['eb'], res['r']
    falta = ea & ~dilatar(eb, r)   # original tem, nosso não
    sobra = eb & ~dilatar(ea, r)   # nosso tem, original não
    base, _ = cinza(fo, 720); base = base[:ea.shape[0]]
    rgb = np.stack([base * 0.35 + 90] * 3, -1)
    rgb[falta] = [230, 40, 40]
    rgb[sobra] = [40, 120, 255]
    mapa = Image.fromarray(np.clip(rgb, 0, 255).astype(np.uint8))
    o = Image.open(fo).convert('RGB').resize(mapa.size); n = Image.open(fn).convert('RGB').resize(mapa.size)
    folha = Image.new('RGB', (mapa.size[0] * 3 + 20, mapa.size[1]), (15, 15, 15))
    for i, im in enumerate([o, n, mapa]):
        folha.paste(im, (i * (mapa.size[0] + 10), 0))
    saida = os.path.join(pasta, f'dif-{nome}.jpg')
    folha.save(saida, quality=80)
    return saida


def chave(nome):
    m = re.search(r'(\d+)', os.path.basename(nome))
    return int(m.group(1)) if m else None


def main():
    (po, pn), op = args()
    if os.path.isdir(po):
        ext = ('.jpg', '.jpeg', '.png', '.webp')
        lo = {chave(f): os.path.join(po, f) for f in sorted(os.listdir(po)) if f.lower().endswith(ext) and chave(f) is not None}
        ln = {chave(f): os.path.join(pn, f) for f in sorted(os.listdir(pn)) if f.lower().endswith(ext) and chave(f) is not None}
        pares = [(k, lo[k], ln[k]) for k in sorted(lo) if k in ln]
        so_o = sorted(set(lo) - set(ln)); so_n = sorted(set(ln) - set(lo))
    else:
        pares = [(0, po, pn)]; so_o = so_n = []
    if not pares:
        print('Nenhuma tela pareada (os nomes precisam ter o mesmo número).'); sys.exit(2)

    limite = op['limite']
    pasta_dif = op['diferencas'] or os.path.join(os.path.dirname(os.path.abspath(pn if os.path.isdir(pn) else os.path.dirname(pn))), 'fidelidade-diferencas')
    print(f'Fidelidade · {len(pares)} telas · limite por tela {limite:.0f} · tolerância {TOL_PX} px')
    print(f'{"tela":>5} {"ssim":>6} {"estr":>6} {"desl":>7} {"nota":>6}  situação')
    notas, reprovadas, avisos = [], [], []
    for k, fo, fn in pares:
        res = comparar(fo, fn)
        notas.append(res['nota'])
        sit = 'ok' if res['nota'] >= limite else 'ABAIXO'
        d = res['desl']
        if abs(d) > TOL_ANIM * 900:
            sit += f' · desl. {d:+d} px: rolagem/animação fora de sincronia (> {TOL_ANIM:.0%} de 900)'
        elif abs(d) > TOL_PX:
            sit += f' · desl. {d:+d} px (> {TOL_PX} px)'
        if res['nota'] < limite:
            if dentro_de_repo(os.path.dirname(os.path.abspath(pasta_dif)) or '.'):
                sit += ' · (imagem não gerada: pasta de diferenças dentro de repositório)'
            else:
                sit += ' · ' + salvar_diferenca(fo, fn, res, pasta_dif, f'{k:02d}')
            reprovadas.append(k)
        print(f'{k:>5} {res["ssim"]:>6.3f} {res["estr"]:>6.3f} {d:>+7d} {res["nota"]:>6.1f}  {sit}')
    total = sum(notas) / len(notas)
    print('-' * 60)
    print(f'TOTAL {total:.1f} / 100 · {len(pares) - len(reprovadas)} de {len(pares)} telas no limite · pior tela {min(notas):.1f}')
    ok = not reprovadas
    if so_o:
        print(f'Telas só no original (faltam no nosso): {so_o}'); ok = False
    if so_n:
        print(f'Telas só no nosso: {so_n}')
    if op['alturas']:
        ho, hn = [float(x) for x in op['alturas'].split(',')]
        dif = abs(hn - ho) / ho
        estado = 'ok' if dif <= TOL_ALTURA else 'FORA'
        print(f'Altura da página: original {ho:.0f} px · nosso {hn:.0f} px · diferença {dif:.2%} (tolerância {TOL_ALTURA:.0%}) · {estado}')
        ok = ok and dif <= TOL_ALTURA
    print('RESULTADO:', 'APROVADO' if ok else 'REPROVADO', '' if ok else f'(telas abaixo do limite: {reprovadas})' if reprovadas else '')
    if reprovadas:
        print('Legenda das imagens de diferença: original | nosso | bordas (vermelho = só no original, azul = só no nosso).')
    sys.exit(0 if ok else 1)


if __name__ == '__main__':
    main()
