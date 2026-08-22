# API Mínima e Segura

API de exemplo em Node.js + Express + SQLite, construída para testar uma **esteira de CI/CD real** com deploy via pipeline (sem auto-deploy da hospedagem).

## Stack

- Node.js 22 + Express 4 (ESM)
- better-sqlite3 (banco local)
- helmet, express-rate-limit, cors, validação de entrada
- vitest + supertest (testes)
- Docker (multi-stage)
- GitHub Actions (CI + CD)
- Render (deploy gratuito, disparado pelo pipeline)

## Endpoints

| Método | Rota            | Descrição                    |
|--------|-----------------|------------------------------|
| GET    | `/health`       | Health check                 |
| GET    | `/api/items`    | Lista itens                  |
| GET    | `/api/items/:id`| Busca item por id            |
| POST   | `/api/items`    | Cria item (`{ "name": "..." }`) |
| DELETE | `/api/items/:id`| Remove item                  |

## Rodando localmente

```bash
npm install
cp .env.example .env   # ajuste os valores
npm run dev            # http://localhost:3000
```

## Testes, lint e build

```bash
npm test        # vitest + supertest
npm run lint    # eslint
npm run build   # checagem de sintaxe
```

## Docker

```bash
docker build -t api-minima-segura .
docker run -p 3000:3000 api-minima-segura
```

## Esteira de CI/CD

- **CI** (`.github/workflows/ci.yml`): roda em todo push/PR no `main` — `npm ci`, lint, test, build.
- **CD** (`.github/workflows/cd.yml`): roda em push no `main`, **após o CI passar**, e dispara o deploy no Render via **Deploy Hook** (chamada à API). O deploy **não** é auto-deploy da hospedagem — só acontece quando o pipeline chama o hook.

## Guia de deploy (Render, gratuito, sem auto-deploy)

1. Crie uma conta em [render.com](https://render.com) (login com GitHub).
2. **New → Web Service → Connect repository** → selecione `api-minima-segura`.
3. Configuração:
   - **Build Command:** `npm ci && npm run build`
   - **Start Command:** `npm start`
   - **Environment:** Node 22
   - **Instance Type:** Free
4. **Environment Variables:** `PORT=10000`, `CORS_ORIGIN`, `NODE_ENV=production`.
5. **Desative o Auto-Deploy** (Settings → Deploy → Auto-Deploy: **Off**). O deploy será feito apenas pelo pipeline.
6. Copie o **Deploy Hook** (Settings → Deploy → Deploy Hook) — é uma URL completa.
7. No GitHub, adicione o segredo `RENDER_DEPLOY_HOOK` com essa URL (Settings → Secrets and variables → Actions → New repository secret).
8. Faça um push no `main`: o CI roda, o CD chama o hook e o Render redeploya.
9. Valide em `https://<nome>.onrender.com/health`.

> **Atenção:** no plano free do Render o disco é efêmero — os dados do SQLite são apagados a cada redeploy. Para estudo/demo é aceitável; para persistência real, use um banco externo (ex.: Turso/libSQL, Supabase).

## Segurança

- Nenhum segredo versionado (`.env` no `.gitignore`).
- helmet, rate limit (100 req/15min), CORS restrito, body limit 10kb, validação de entrada.
