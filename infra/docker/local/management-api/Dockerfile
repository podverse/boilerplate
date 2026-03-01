# Boilerplate Management API – local Docker (build from repo root)
FROM node:25-slim

WORKDIR /app

COPY package.json package-lock.json tsconfig.base.json ./
COPY packages/ ./packages/
COPY apps/ ./apps/

RUN npm ci --ignore-scripts && \
  npm run i18n:compile -w @boilerplate/helpers-i18n && \
  npm run build -w @boilerplate/helpers && \
  npm run build -w @boilerplate/helpers-i18n && \
  npm run build -w @boilerplate/orm && \
  npm run build -w @boilerplate/management-orm && \
  npm run build -w @boilerplate/management-api

EXPOSE 4100

CMD ["node", "apps/management-api/dist/index.js"]
