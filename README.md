# gesap-auditor

Servicio de auditoría del Sistema GESAP. Permite a los auditores del MSPAS supervisar sesiones activas, historial de accesos, acciones CRUD, usuarios y dispositivos autorizados.

## Stack

- NestJS + TypeScript
- Prisma ORM + PostgreSQL (`prisma db push`, sin migraciones formales)
- JWT (passport-jwt)
- Socket.IO (WebSocket `/sessions`, path `/auditor-ws`)
- Swagger (documentación interactiva)

## Puertos

| Entorno | Puerto |
|---------|--------|
| Desarrollo | `3001` |
| Docker (host) | `3101` |

**Prefix global:** `/gesap-auditor/v1`  
**Swagger:** `http://localhost:3001/gesap-auditor/v1/docs`

## Variables de entorno

```env
PORT=3001
NODE_ENV=development
DATABASE_URL="postgresql://postgres:admin@localhost:5433/gesap_db?schema=public"
JWT_SECRET=x7K9mP2vQ8nR4wL6jH3cF1bA5dY0uT8sE2gN6iO9pX4zM7kJ5r
JWT_EXPIRES_IN=24h
GESAP_API_URL=http://localhost:3000
```

> **Importante:** Comparte la misma BD `gesap_db` que gesap-api. No usar una BD separada.

## Instalación y desarrollo

```bash
npm install
npx prisma generate
npx prisma db push   # crea las tablas sin migración formal

# Desarrollo
npm run start:dev

# Producción
npm run build
npm run start:prod
```

## Módulos

| Módulo | Endpoints principales |
|--------|-----------------------|
| `auth` | `POST /login`, `GET /profile` |
| `sessions` | `GET /sessions/active`, `GET /sessions/history`, `POST /sessions/kick/:id` |
| `audit-logs` | `GET /audit-logs` con filtros `action`, `entity`, `from`, `to` |
| `users` | Listado y toggle-active (scope por hospital para AUDITOR) |
| `hospitals` | Listado de hospitales |
| `dashboard` | Métricas: emergencias activas, cuentas pendientes, totales |
| `devices` | Whitelist de dispositivos autorizados por MAC |
| `schedules` | Horarios de atención por establecimiento |
| `patient-accounts` | Aprobación/rechazo de cuentas de pacientes |
| `emergencies` | Lectura de emergencias (read-only para auditores) |

## WebSocket

El gateway `/sessions` (path `/auditor-ws`) trackea los sockets de auditores conectados. Emite:
- `sessions:changed` → a todos los auditores cuando hay un kick (refresca la tabla)
- `session:kicked` → al socket específico del usuario cuya sesión fue cerrada

Conectar desde el cliente:
```js
import { io } from 'socket.io-client'
const socket = io('/', {
  path: '/auditor-ws',
  auth: { token: '<JWT>' },
  transports: ['polling', 'websocket'],
})
socket.on('session:kicked', () => { /* logout */ })
socket.on('sessions:changed', () => { /* refrescar lista */ })
```

## Roles con acceso

| Rol | Acceso |
|-----|--------|
| `SUPER_AUDITOR` | Todo el sistema, sin restricción de hospital |
| `AUDITOR` | Solo datos de su hospital asignado, no puede kickear otros AUDITOR/SUPER_AUDITOR |

## Docker

```bash
# Desde el repo raíz GESAP
docker compose up --build gesap-auditor
```

El Dockerfile corre `prisma db push` automáticamente al iniciar, creando las tablas si no existen.
