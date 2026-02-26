# Metaboost Web – local Docker (build from repo root). Node 24.
FROM node:24-slim

WORKDIR /app

COPY package.json package-lock.json tsconfig.base.json ./
COPY apps/ ./apps/

RUN npm ci --ignore-scripts && npm run build -w @metaboost/web

EXPOSE 4100

ENV NODE_ENV=production
ENV PORT=4100

CMD ["npm", "run", "start", "-w", "@metaboost/web"]
