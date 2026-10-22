# Northland community — UCP (web)

Panel de usuario del servidor de FiveM **Northland community**. Aplicación pública
(React + TypeScript + Vite + Tailwind CSS v4) que se despliega en GitHub Pages.

> Este repositorio es **público**: no contiene secretos, credenciales ni lógica
> sensible. Toda la autenticación y los datos viven en `northland-ucp-api` (privado).

## Desarrollo

```bash
npm install
cp .env.example .env
npm run dev
```

Variables de entorno (build):

| Variable         | Descripción                                              |
| ---------------- | -------------------------------------------------------- |
| `VITE_API_URL`   | URL base del backend, ej. `https://api.ejemplo.com`      |
| `VITE_API_MODE`  | `http` (API real) · `demo` (fixtures locales de prueba)  |

El modo `demo` muestra datos de prueba claramente marcados con un badge «DEMO» y
no realiza peticiones de red. Es útil para previsualizar el diseño sin backend.

## Arquitectura

```
src/
  api/            # Contrato (types.ts), HttpApi, DemoApi — selección por VITE_API_MODE
  auth/           # RequireAuth (guardia de sesión)
  components/
    layout/       # AppShell, Sidebar, TopBar, MobileNav, BrandMark (slot de logo)
    ui/           # Primitivas: Card, Badge, Stat, Skeleton, EmptyState, ErrorState…
  config/env.ts   # Variables de build tipadas
  hooks/api.ts    # Hooks de React Query por recurso
  lib/format.ts   # Formateo de dinero, fechas, etiquetas
  pages/          # Login, Dashboard, Personajes, Propiedades, Vehículos, Cuenta
```

- La sesión vive en una cookie `HttpOnly` gestionada por el backend; el frontend
  usa `fetch` con `credentials: 'include'` y nunca almacena tokens.
- Las mutaciones incluyen la cabecera `X-CSRF-Token` obtenida en `/auth/me`.
- La paleta completa se define como tokens en `src/index.css` (`@theme`): cambiar
  la identidad visual = editar ese bloque.

## Despliegue (GitHub Pages)

1. En el repo → **Settings → Pages → Source: GitHub Actions**.
2. Define las variables `VITE_API_URL` y `VITE_API_MODE` en
   **Settings → Secrets and variables → Actions → Variables**.
3. Push a `main`: el workflow `.github/workflows/deploy.yml` compila con la base
   `/<repo>/` y publica `dist/`.

Para un dominio propio, añade `public/CNAME` y ajusta el `--base` del workflow.

## Verificación

```bash
npm run build   # typecheck + build de producción
npm run lint    # oxlint
npm run preview # sirve dist/ localmente
```
