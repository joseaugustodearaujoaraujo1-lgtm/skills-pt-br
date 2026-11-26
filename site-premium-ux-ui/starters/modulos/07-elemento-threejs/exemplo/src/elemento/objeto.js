// Exemplo de elemento: peça de aço escovado com cúpula de cristal.
// Troque por um elemento novo, feito igual ao molde aprovado (references/pipeline-3d.md):
// mesmas medidas (em metros), mesmas peças e os mesmos valores de material anotados no README do objeto.
import { revolucao, texturaEscovada } from '../../../modulo.js';

export function criarObjeto({ THREE }) {
  const grupo = new THREE.Group();

  const escovado = texturaEscovada({ circular: true, base: 0.3, variacao: 0.16 });
  const aco = new THREE.MeshPhysicalMaterial({
    color: 0xc9ced2, metalness: 1, roughness: 0.32, roughnessMap: escovado,
    clearcoat: 0.25, clearcoatRoughness: 0.12,
  });
  // corpo: perfil [raio, altura] em metros, de baixo para cima; os cantos ganham chanfro automático
  grupo.add(new THREE.Mesh(revolucao([
    [0, 0], [0.019, 0], [0.0205, 0.0015], [0.0205, 0.008], [0.019, 0.0095], [0.017, 0.0105], [0.017, 0.011], [0, 0.011],
  ], { chanfro: 0.0008 }), aco));

  // anel serrilhado: 60 dentes por geometria instanciada (uma chamada de desenho)
  const dente = new THREE.BoxGeometry(0.0012, 0.0052, 0.0011);
  const dentes = new THREE.InstancedMesh(dente, aco, 60);
  const m = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Vector3(1, 1, 1);
  for (let i = 0; i < 60; i++) {
    const a = (i / 60) * Math.PI * 2;
    q.setFromAxisAngle(new THREE.Vector3(0, 1, 0), -a);
    m.compose(new THREE.Vector3(Math.cos(a) * 0.0207, 0.0048, Math.sin(a) * 0.0207), q, e);
    dentes.setMatrixAt(i, m);
  }
  grupo.add(dentes);

  // cúpula de cristal (vidro físico: transmissão, IOR da safira)
  const cristal = new THREE.MeshPhysicalMaterial({
    color: 0xffffff, metalness: 0, roughness: 0.02, transmission: 1, thickness: 0.002, ior: 1.77,
    clearcoat: 1, clearcoatRoughness: 0.02, attenuationColor: 0xe8f4ff, attenuationDistance: 0.05,
  });
  const cupula = new THREE.Mesh(new THREE.SphereGeometry(0.0168, 96, 32, 0, Math.PI * 2, 0, Math.PI * 0.32), cristal);
  cupula.scale.y = 0.55; cupula.position.y = 0.0047;
  grupo.add(cupula);

  // disco interno escuro com índices (o que aparece através do cristal)
  const mostrador = new THREE.MeshPhysicalMaterial({ color: 0x0d2a30, metalness: 0.2, roughness: 0.45, clearcoat: 0.6 });
  const disco = new THREE.Mesh(new THREE.CylinderGeometry(0.0158, 0.0158, 0.0004, 96), mostrador);
  disco.position.y = 0.0108; grupo.add(disco);
  const indice = new THREE.BoxGeometry(0.0007, 0.0003, 0.0028);
  const lume = new THREE.MeshPhysicalMaterial({ color: 0xeefbf4, roughness: 0.35, emissive: 0x2a5a48, emissiveIntensity: 0.2 });
  const indices = new THREE.InstancedMesh(indice, lume, 12);
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2;
    q.setFromAxisAngle(new THREE.Vector3(0, 1, 0), -a + Math.PI / 2);
    m.compose(new THREE.Vector3(Math.cos(a) * 0.0128, 0.0112, Math.sin(a) * 0.0128), q, e);
    indices.setMatrixAt(i, m);
  }
  grupo.add(indices);

  return grupo;
}
