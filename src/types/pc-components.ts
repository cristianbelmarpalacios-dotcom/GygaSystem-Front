export type ComponentCategory = 
  | 'gabinete'
  | 'procesador'
  | 'tarjeta-madre'
  | 'ram'
  | 'tarjeta-grafica'
  | 'almacenamiento'
  | 'fuente-poder'
  | 'refrigeracion'
  | 'otros';

export interface PCComponent {
  id: string;
  name: string;
  category: ComponentCategory;
  price: number;
  image: string;
  description?: string;
  specifications?: Record<string, string>;
  /** Ruta al GLB del gabinete (solo se usa si has3dPreview es true). */
  model3d?: string;
  model3dScale?: number;
  model3dPosition?: [number, number, number];
  model3dRotation?: [number, number, number];
  /**
   * Si es true, en la sección Componentes el cliente puede abrir la vista 3D de este gabinete.
   * El resto de gabinetes se venden con ficha, precio y vista 2D; sin preview WebGL.
   */
  has3dPreview?: boolean;
  /** Variante procedural del chasis cuando no hay GLB propio. */
  caseVariant?: "white" | "black";
}

export interface SelectedComponents {
  gabinete?: PCComponent;
  procesador?: PCComponent;
  'tarjeta-madre'?: PCComponent;
  ram?: PCComponent;
  'tarjeta-grafica'?: PCComponent;
  almacenamiento?: PCComponent;
  'fuente-poder'?: PCComponent;
  refrigeracion?: PCComponent;
  otros?: PCComponent[];
}

export interface PCBuild {
  components: SelectedComponents;
  total: number;
}

