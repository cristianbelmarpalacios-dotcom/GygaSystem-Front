Coloca aqui los gabinetes 3D licenciados en formato GLB.

Rutas esperadas por defecto:
- /models/cases/demo-mid-tower.glb
- /models/cases/demo-mini-itx.glb
- /models/cases/demo-full-tower.glb

Puedes cambiar cada ruta en src/data/components.ts usando:
- model3d
- model3dScale
- model3dPosition
- model3dRotation

Pipeline recomendado:
1) Validar licencia comercial del modelo.
2) Optimizar a GLB (texturas comprimidas, malla simplificada).
3) Probar escala/posicion en model3dScale y model3dPosition.
4) Confirmar que el archivo responde 200 en /models/cases/...
