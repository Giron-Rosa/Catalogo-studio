# Catálogo Studio

Plataforma multi-usuario para crear y gestionar catálogos personalizados.

## Stack
- **Frontend:** Next.js 14 + TypeScript + TailwindCSS
- **Auth & DB:** Supabase (Auth, PostgreSQL, Storage)
- **Contenedores:** Docker + Docker Compose

## Paleta de colores
| Nombre     | Hex       |
|------------|-----------|
| Espresso   | `#482E1D` |
| Caramel    | `#895D2B` |
| Leafy      | `#A3966A` |
| Sand Storm | `#F0DAAE` |
| Cinnamon   | `#90553C` |

## Primeros pasos

### 1. Configurar variables de entorno
```bash
cp frontend/.env.local.example frontend/.env.local
```
Edita `frontend/.env.local` con tus credenciales de Supabase.

### 2. Levantar con Docker
```bash
docker-compose up --build
```
La app estará disponible en [http://localhost:3000](http://localhost:3000)

### 3. Desarrollo local sin Docker (requiere Node.js 20+)
```bash
cd frontend
npm install
npm run dev
```

## Estructura del proyecto
```
Catalogo-studio/
├── docker-compose.yml
├── frontend/
│   ├── Dockerfile          # Producción
│   ├── Dockerfile.dev      # Desarrollo
│   ├── src/
│   │   ├── app/
│   │   │   ├── (auth)/
│   │   │   │   ├── login/
│   │   │   │   ├── register/
│   │   │   │   └── forgot-password/
│   │   └── lib/
│   │       └── supabase.ts
└── .env.example
```