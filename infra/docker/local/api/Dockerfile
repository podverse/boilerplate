# Boilerplate API – local Docker (build from repo root)
FROM node:24-slim

WORKDIR /app

COPY package.json package-lock.json tsconfig.base.json ./
COPY apps/ ./apps/

RUN npm ci --ignore-scripts && npm run build -w @boilerplate/api

EXPOSE 4000

CMD ["node", "apps/api/dist/index.js"]
