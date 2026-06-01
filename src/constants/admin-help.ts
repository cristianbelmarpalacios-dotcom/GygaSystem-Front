export type HelpSection = {
  id: string;
  title: string;
  intro?: string;
  items: Array<{
    term: string;
    definition: string;
  }>;
};

export const ADMIN_HELP_SECTIONS: HelpSection[] = [
  {
    id: "general",
    title: "Conceptos generales",
    intro:
      "El backoffice guarda todo en la base de datos (Supabase). Algunos campos son listas fijas del sistema; otros los creas tú, como las categorías.",
    items: [
      {
        term: "Tipo de producto",
        definition:
          "Clasificación fija del sistema (4 opciones). No se pueden crear tipos nuevos desde el admin. Sirve para filtrar y organizar a nivel técnico (componentes vs periféricos vs PCs armados). Para agrupar como en la tienda (ej. «Monitores», «Teclados»), usa Categorías.",
      },
      {
        term: "Categoría",
        definition:
          "La creas tú en Admin → Categorías. Es flexible: nombre, slug y descripción. Un producto puede tener varias categorías. Ideal para menús y secciones de la tienda.",
      },
      {
        term: "Slug",
        definition:
          "Identificador corto para URLs, sin espacios ni tildes. Ejemplo: nombre «Tarjetas gráficas» → slug tarjetas-graficas. Debe ser único. Si lo cambias después, los enlaces antiguos pueden dejar de funcionar.",
      },
      {
        term: "Producto vs variante",
        definition:
          "El producto es la ficha (nombre, descripción, fotos, tipo). La variante es la unidad que se vende: tiene su propio SKU, precio y stock. Un mismo producto puede tener varias variantes en el futuro (ej. 16 GB vs 32 GB de RAM); hoy al crear un producto se genera una variante inicial.",
      },
      {
        term: "SKU (SKU variante)",
        definition:
          "Stock Keeping Unit: código único de inventario (como un código de barras interno). Ejemplos: GAB-DF-001, RAM-32GB-5600. Si lo dejas vacío al crear, el sistema genera uno automático a partir del slug. No debe repetirse en todo el catálogo.",
      },
    ],
  },
  {
    id: "tipos",
    title: "Tipos de producto (lista fija)",
    intro: "No son editables desde el panel. Para ampliar la organización, usa categorías.",
    items: [
      {
        term: "Componente PC",
        definition:
          "Piezas para armar o upgradear un equipo: gabinete, CPU, placa madre, RAM, GPU, SSD, fuente, refrigeración, etc.",
      },
      {
        term: "Periférico",
        definition:
          "Accesorios de uso externo: teclado, mouse, audífonos, micrófono, monitor, webcam, etc.",
      },
      {
        term: "PC armado",
        definition:
          "Equipo completo ya montado, listo para usar. Suele tener un precio global y descripción del build.",
      },
      {
        term: "Accesorio",
        definition:
          "Complementos que no son periférico principal ni pieza interna: cables, pads, soportes, hubs, etc.",
      },
    ],
  },
  {
    id: "productos",
    title: "Campos al crear un producto",
    items: [
      {
        term: "Nombre",
        definition: "Título visible en la tienda y en el admin.",
      },
      {
        term: "Slug (URL)",
        definition:
          "Parte de la dirección web del producto. Se autocompleta desde el nombre; puedes ajustarlo.",
      },
      {
        term: "Estado",
        definition:
          "Vigente: visible en la tienda. No vigente: oculto para clientes pero conservado en el sistema (pedidos, historial). Dar de baja un producto lo marca como no vigente.",
      },
      {
        term: "Precio normal (CLP)",
        definition:
          "Precio de lista opcional. Si es mayor al precio de venta, en la tienda se muestra tachado y el porcentaje de descuento.",
      },
      {
        term: "Precio de venta (CLP)",
        definition:
          "Precio que paga el cliente. Es el valor principal en la ficha del producto.",
      },
      {
        term: "Imágenes",
        definition:
          "Hay dos tipos de imágenes: «Vitrina» (galería y catálogo, hasta 8; la primera es principal) e «Detalle» (imágenes grandes en la sección de descripción de la ficha, hasta 6, máx. 20 MB). Al crear o desde el listado usa «+ Vitrina» o «+ Detalle». Se guardan en Supabase Storage.",
      },
      {
        term: "Stock",
        definition:
          "Unidades disponibles de esa variante. Al vender, el sistema debería descontar (según flujo de pedidos e inventario).",
      },
      {
        term: "Descripción corta",
        definition: "Resumen de una o dos líneas para listados y tarjetas de producto.",
      },
      {
        term: "Categorías (selección)",
        definition:
          "Etiquetas de navegación que tú creaste. Un producto puede estar en varias a la vez (ej. componentes-pc y destacados).",
      },
    ],
  },
  {
    id: "categorias",
    title: "Campos al crear una categoría",
    items: [
      {
        term: "Nombre",
        definition: "Texto que verá el cliente, ej. «Memoria RAM» o «Monitores».",
      },
      {
        term: "Slug",
        definition:
          "Identificador en URL, ej. memoria-ram. Se genera solo al escribir el nombre; conviene no cambiarlo luego.",
      },
      {
        term: "Descripción",
        definition: "Opcional. Texto para SEO o subtítulo en la página de la categoría.",
      },
      {
        term: "Estado",
        definition:
          "Vigente = visible en menú y catálogo. No vigente = oculta en tienda pero conservada en admin y en productos ya asignados.",
      },
      {
        term: "Contador de productos",
        definition:
          "Cuántos productos tienen asignada esa categoría. Sirve para ver si la categoría está en uso.",
      },
    ],
  },
  {
    id: "pedidos",
    title: "Pedidos y ventas",
    items: [
      {
        term: "Número de pedido",
        definition: "Código legible del pedido para soporte y seguimiento.",
      },
      {
        term: "Estado del pedido",
        definition:
          "Flujo típico: Creado → Esperando pago → Pagado → En preparación → Enviado → Entregado. También Cancelado o Reembolsado si aplica.",
      },
      {
        term: "Líneas del pedido",
        definition:
          "Cada producto comprado: nombre, SKU de la variante, cantidad y precio unitario en ese momento.",
      },
      {
        term: "Nota al cambiar estado",
        definition:
          "Comentario interno opcional al actualizar (ej. «Despachado con Starken, OT 12345»).",
      },
    ],
  },
  {
    id: "tienda",
    title: "Menú y tienda pública",
    items: [
      {
        term: "Categoría raíz (sin padre)",
        definition:
          "Aparece como ítem principal del menú (ej. Periféricos). Su página es /catalogo/perifericos.",
      },
      {
        term: "Subcategoría (con padre)",
        definition:
          "Aparece en el desplegable del menú y como sección en la página del padre (ej. Mouse dentro de Periféricos). Los productos se asignan a la subcategoría, no al padre.",
      },
      {
        term: "Menú de la tienda",
        definition:
          "Se genera desde las categorías raíz y sus hijas en la base de datos. Al crear o editar categorías, reinicia el front (o espera ~1 min de caché) para ver el menú actualizado.",
      },
      {
        term: "Armador 3D",
        definition:
          "Usa tipos de pieza del configurador (gabinete, procesador, etc.), distintos de las categorías del catálogo ecommerce.",
      },
    ],
  },
  {
    id: "roles",
    title: "Roles y permisos",
    intro:
      "Cada usuario del admin tiene un rol de permisos. Por pantalla puedes activar Ver, Editar y Eliminar.",
    items: [
      {
        term: "Ver",
        definition:
          "Puede entrar a la pantalla y consultar datos. Sin «Ver» no aparece en el menú lateral.",
      },
      {
        term: "Editar",
        definition:
          "Crear, modificar, publicar o subir archivos. Implica también «Ver».",
      },
      {
        term: "Eliminar",
        definition:
          "Dar de baja productos/categorías o borrar roles. Implica «Ver».",
      },
      {
        term: "Rol Administrador",
        definition:
          "Rol de sistema con acceso total. Los usuarios ADMIN sin rol asignado también tienen acceso completo (compatibilidad).",
      },
    ],
  },
];
