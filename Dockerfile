# ---- Stage 1: dependências ----
FROM node:22-slim AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev

# ---- Stage 2: runtime ----
FROM node:22-slim AS runtime
WORKDIR /app
ENV NODE_ENV=production
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# better-sqlite3 é nativo: garante binário compatível com a imagem
RUN npm rebuild better-sqlite3
EXPOSE 3000
USER node
CMD ["node", "src/server.js"]
