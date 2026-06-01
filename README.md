# GygaSystem Front (Giovanni)

Frontend Next.js 14 para GigaSystem — tienda, armador de PC y panel admin.

## Desarrollo local

```bash
cp .env.example .env
npm install
npm run dev
```

Variables en `.env.example`:

- `NEXT_PUBLIC_API_URL` — backend NestJS (local: `http://localhost:4000`)
- `NEXT_PUBLIC_SITE_URL` — URL pública del front

## Producción

- **API:** `https://gigasystem-api-cl.fly.dev`
- **Deploy:** [Vercel](https://vercel.com) (framework **Next.js**)

Variables en Vercel:

| Variable | Ejemplo |
|----------|---------|
| `NEXT_PUBLIC_API_URL` | `https://gigasystem-api-cl.fly.dev` |
| `NEXT_PUBLIC_SITE_URL` | `https://tu-proyecto.vercel.app` |

Tras el deploy, actualizar CORS en Fly:

```bash
fly secrets set CORS_ORIGIN="https://tu-proyecto.vercel.app" -a gigasystem-api-cl
```
