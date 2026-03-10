# gesap-auditor

Servicio de auditoría del sistema GESAP.

## Requisitos
- Node.js 18+
- PostgreSQL 15+

## Instalación
```bash
npm install
cp .env.example .env
npx prisma generate
npx prisma migrate dev --name init
```

## Ejecución
```bash
npm run start:dev
```

El servidor corre en `http://localhost:3001/gesap-auditor/v1`

## Endpoints
- `GET /gesap-auditor/v1/auth/validate` — Verificar token
- `/gesap-auditor/v1/audit-logs` — Logs de auditoría
- `/gesap-auditor/v1/schedules` — Horarios de trabajo
- `/gesap-auditor/v1/devices` — Dispositivos autorizados
- WebSocket en `/sessions` — Sesiones en tiempo real
