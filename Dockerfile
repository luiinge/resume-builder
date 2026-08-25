# syntax=docker/dockerfile:1
#
# Imagen única: backend (NestJS) y frontend (React) empaquetados en el mismo
# contenedor. El backend sirve los estáticos del frontend y expone la API
# bajo /api en el mismo puerto. La base de datos es un fichero SQLite
# persistido en un volumen (ver docker-compose.yml).

# ---- Etapa de build ----
FROM node:20-slim AS build
WORKDIR /app

COPY package.json package-lock.json ./
COPY packages/shared/package.json packages/shared/package.json
COPY apps/backend/package.json apps/backend/package.json
COPY apps/frontend/package.json apps/frontend/package.json
RUN npm ci

COPY packages/shared packages/shared
COPY apps/backend apps/backend
COPY apps/frontend apps/frontend

RUN npm run build --workspace packages/shared
RUN npm run prisma:generate --workspace apps/backend
RUN npm run build --workspace apps/backend
RUN npm run build --workspace apps/frontend

# Aplica las migraciones contra un fichero SQLite descartable solo para forzar
# la descarga/caché del motor de Prisma correspondiente a esta plataforma
# (glibc + OpenSSL 3.x, igual que la imagen de runtime) mientras hay red
# disponible en el build. Así el contenedor en ejecución no necesita salir a
# internet para aplicar migraciones reales.
RUN cd apps/backend && DATABASE_URL="file:./build-cache.db" npx prisma migrate deploy && rm -f build-cache.db

# ---- Etapa de ejecución ----
# Imagen oficial de Playwright: incluye Chromium y sus dependencias de sistema,
# necesarias para la exportación de CVs a PDF (ver openspec/.../design.md).
# La versión de la imagen debe coincidir con la de la dependencia "playwright"
# en apps/backend/package.json.
FROM mcr.microsoft.com/playwright:v1.62.1-jammy AS runtime
WORKDIR /app
ENV NODE_ENV=production

COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/packages/shared/dist ./packages/shared/dist
COPY --from=build /app/packages/shared/package.json ./packages/shared/package.json
COPY --from=build /app/apps/backend/dist ./apps/backend/dist
COPY --from=build /app/apps/backend/package.json ./apps/backend/package.json
COPY --from=build /app/apps/backend/prisma ./apps/backend/prisma
COPY --from=build /app/apps/backend/tsconfig.json ./apps/backend/tsconfig.json
COPY --from=build /app/apps/frontend/dist ./apps/backend/public
COPY docker-entrypoint.sh ./docker-entrypoint.sh
RUN chmod +x ./docker-entrypoint.sh

WORKDIR /app/apps/backend
EXPOSE 3000
ENTRYPOINT ["/app/docker-entrypoint.sh"]
CMD ["node", "dist/main.js"]
