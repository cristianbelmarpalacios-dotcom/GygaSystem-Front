import * as THREE from "three";

/** Contorno CCW; hueco rectangular CW (convención Extrude de Three.js). */
export function buildRectFrameShape(
  outerW: number,
  outerD: number,
  innerW: number,
  innerD: number,
): THREE.Shape {
  const shape = new THREE.Shape();
  const ohw = outerW / 2;
  const ohd = outerD / 2;
  const ihw = innerW / 2;
  const ihd = innerD / 2;
  shape.moveTo(-ohw, -ohd);
  shape.lineTo(ohw, -ohd);
  shape.lineTo(ohw, ohd);
  shape.lineTo(-ohw, ohd);
  shape.lineTo(-ohw, -ohd);

  const hole = new THREE.Path();
  hole.moveTo(-ihw, ihd);
  hole.lineTo(ihw, ihd);
  hole.lineTo(ihw, -ihd);
  hole.lineTo(-ihw, -ihd);
  hole.lineTo(-ihw, ihd);
  shape.holes.push(hole);
  return shape;
}

/**
 * Placa perforada (agujeros circulares pasantes en geometría), vista en planta: ejes shape X/Z del mundo.
 */
export function buildCircularPerforatedPlateShape(
  width: number,
  depth: number,
  holeR: number,
  pitch: number,
): THREE.Shape {
  const shape = new THREE.Shape();
  const hw = width / 2;
  const hd = depth / 2;
  shape.moveTo(-hw, -hd);
  shape.lineTo(hw, -hd);
  shape.lineTo(hw, hd);
  shape.lineTo(-hw, hd);
  shape.lineTo(-hw, -hd);

  const margin = holeR * 2.4;
  const rowStep = pitch * (Math.sqrt(3) / 2);
  let row = 0;
  for (let cy = -hd + margin; cy <= hd - margin + 1e-6; cy += rowStep) {
    const stagger = row % 2 === 0 ? 0 : pitch / 2;
    for (
      let cx = -hw + margin + stagger;
      cx <= hw - margin + 1e-6;
      cx += pitch
    ) {
      const holePath = new THREE.Path();
      holePath.absarc(cx, cy, holeR, 0, Math.PI * 2, true);
      shape.holes.push(holePath);
    }
    row += 1;
  }
  return shape;
}

export function extrudePlateToWorldY(
  depth: number,
  shape: THREE.Shape,
): THREE.ExtrudeGeometry {
  const geo = new THREE.ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: false,
    curveSegments: 10,
  });
  geo.rotateX(-Math.PI / 2);
  geo.center();
  return geo;
}
