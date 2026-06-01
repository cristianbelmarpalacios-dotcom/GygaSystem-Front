type JsonLdProps = {
  data: Record<string, unknown> | Record<string, unknown>[];
};

/** Inserta JSON-LD para buscadores (sin dependencias extra). */
export default function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
