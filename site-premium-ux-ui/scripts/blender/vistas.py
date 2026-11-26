# Renderiza o molde 3D nas vistas padrão do pipeline (references/pipeline-3d.md).
# Uso:
#   blender --background <arquivo>.blend --python vistas.py -- --saida <pasta> [--lado 1024] [--amostras 256]
# Gera <pasta>/frente.png, lado.png, tres-quartos.png, costas.png, topo.png.
#
# Enquadramento igual ao do módulo starters/modulos/07-elemento-threejs (para comparar as etapas):
#   câmera perspectiva de 85 mm (campo de visão vertical ~23,9°), mirando o centro da esfera que envolve os objetos,
#   distância = raio / sen(fov/2) * 1,15. Eixos: frente do Blender (-Y) = frente do Three.js (+Z).
# Se a cena não tiver luzes, monta um estúdio (3 luzes de área + fundo cinza claro). Se tiver, usa as do arquivo.
# Ainda não testado com Blender instalado nesta skill: rode uma vez e confira as 5 imagens.
import bpy, sys, math, os
from mathutils import Vector

args = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else []
def opt(nome, padrao=None):
    return args[args.index('--' + nome) + 1] if '--' + nome in args else padrao

saida = os.path.abspath(opt('saida', 'vistas'))
lado = int(opt('lado', 1024))
amostras = int(opt('amostras', 256))
os.makedirs(saida, exist_ok=True)

cena = bpy.context.scene
malhas = [o for o in cena.objects if o.type == 'MESH' and o.visible_get()]
if not malhas:
    sys.exit('Nenhuma malha visível na cena.')

# Esfera que envolve todos os objetos (pelas caixas em coordenadas de mundo)
cantos = [o.matrix_world @ Vector(c) for o in malhas for c in o.bound_box]
minimo = Vector((min(c.x for c in cantos), min(c.y for c in cantos), min(c.z for c in cantos)))
maximo = Vector((max(c.x for c in cantos), max(c.y for c in cantos), max(c.z for c in cantos)))
centro = (minimo + maximo) / 2
raio = (maximo - minimo).length / 2

LENTE = 85.0
fov = 2 * math.atan(18.0 / LENTE)  # sensor de 36 mm, imagem quadrada
dist = raio / math.sin(fov / 2) * 1.15

# (azimute em graus a partir da frente -Y, girando para +X; elevação em graus)
VISTAS = {'frente': (0, 0), 'lado': (90, 0), 'tres-quartos': (45, 20), 'costas': (180, 0), 'topo': (0, 89.9)}

cam_dados = bpy.data.cameras.new('cam-vistas')
cam_dados.lens = LENTE
cam_dados.sensor_width = 36
cam_dados.sensor_fit = 'HORIZONTAL'
cam_dados.clip_end = dist * 10
cam = bpy.data.objects.new('cam-vistas', cam_dados)
cena.collection.objects.link(cam)
cena.camera = cam

if not any(o.type == 'LIGHT' for o in cena.objects):
    def luz(nome, energia, tam, pos):
        d = bpy.data.lights.new(nome, 'AREA'); d.energy = energia * raio * raio; d.size = tam * raio
        o = bpy.data.objects.new(nome, d); o.location = centro + Vector(pos) * dist
        o.rotation_euler = (centro - o.location).to_track_quat('-Z', 'Y').to_euler()
        cena.collection.objects.link(o)
    luz('chave', 600, 2.5, (-0.6, -0.8, 0.6))
    luz('preenchimento', 200, 3.0, (0.8, -0.5, 0.2))
    luz('recorte', 450, 1.5, (0.3, 0.9, 0.7))
    mundo = cena.world or bpy.data.worlds.new('mundo'); cena.world = mundo; mundo.use_nodes = True
    fundo = mundo.node_tree.nodes.get('Background')
    if fundo: fundo.inputs[0].default_value = (0.82, 0.82, 0.82, 1); fundo.inputs[1].default_value = 0.6

cena.render.engine = 'CYCLES'
cena.cycles.samples = amostras
cena.cycles.use_denoising = True
cena.render.resolution_x = cena.render.resolution_y = lado
cena.render.resolution_percentage = 100
cena.render.image_settings.file_format = 'PNG'
cena.view_settings.view_transform = 'AgX' if 'AgX' in [i.identifier for i in cena.view_settings.bl_rna.properties['view_transform'].enum_items] else 'Filmic'

for nome, (az, el) in VISTAS.items():
    a, e = math.radians(az), math.radians(el)
    direcao = Vector((math.sin(a) * math.cos(e), -math.cos(a) * math.cos(e), math.sin(e)))
    cam.location = centro + direcao * dist
    cam.rotation_euler = (centro - cam.location).to_track_quat('-Z', 'Y').to_euler()
    cena.render.filepath = os.path.join(saida, nome + '.png')
    bpy.ops.render.render(write_still=True)
    print('OK', nome, cena.render.filepath)
