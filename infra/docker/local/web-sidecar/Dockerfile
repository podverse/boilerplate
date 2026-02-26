# Metaboost Web sidecar – runtime-config server (build from repo root)
FROM node:24-slim

WORKDIR /app

COPY package.json package-lock.json tsconfig.base.json ./
COPY apps/ ./apps/

RUN npm ci --ignore-scripts && npm run build -w @metaboost/web-sidecar

EXPOSE 4101

ENV PORT=4101

CMD ["node", "apps/web/sidecar/dist/server.js"]
