# Frontend (Next.js)

Projeto [Next.js](https://nextjs.org) criado com [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Primeiros passos

Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no navegador.

O projeto usa [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) para otimizar e carregar a família [Geist](https://vercel.com/font).

## Configuração na máquina local

1. **Instalar dependências** (na pasta `frontend`):

   ```bash
   npm install
   ```

2. **Ambiente da aplicação**: copie `.env.example` para `.env.local` e defina `NEXT_PUBLIC_BACKEND_URL` com a URL do backend que o navegador vai usar (em desenvolvimento local, por exemplo `http://localhost:4020`).

3. **Vercel** (deploy manual com `npm run deploy` ou `npm run deploy:prod`):
   - `npx vercel login` — autenticação no navegador.
   - `npx vercel link` — associa esta pasta ao projeto na Vercel e gera ou atualiza **`.vercel/project.json`** com `orgId` e `projectId`. Essa pasta não deve ser versionada (já está no `.gitignore`).

4. **GitHub Actions** (workflow `.github/workflows/vercel-frontend.yml`): no repositório no GitHub, em **Settings → Secrets and variables → Actions**, crie estes **secrets** com os valores corretos:
   - **`VERCEL_TOKEN`** — token da conta em [vercel.com/account/tokens](https://vercel.com/account/tokens) (não coloque no `.env.local`; use só em CI ou no CLI com `--token`).
   - **`VERCEL_ORG_ID`** — igual ao campo **`orgId`** em `frontend/.vercel/project.json` (depois do `vercel link`).
   - **`VERCEL_PROJECT_ID`** — igual ao campo **`projectId`** em `frontend/.vercel/project.json`.

   O workflow faz deploy **só para produção** (`vercel --prod`); execute-o manualmente em **Actions → Run workflow**.

5. **Docker** (build e execução da imagem local): na pasta **`frontend`**, com o Docker em execução:
   - **Build:** `npm run docker-build` (equivale a `docker build -t medidas-frontend .`). O `Dockerfile` usa por padrão `NEXT_PUBLIC_BACKEND_URL=http://localhost:4020` no build (adequado se o backend estiver na sua máquina nessa porta). Para outro URL no build:  
     `docker build --build-arg NEXT_PUBLIC_BACKEND_URL=https://exemplo.com -t medidas-frontend .`
   - **Execução:** `npm run docker-run` — sobe o contêiner na porta **3000** (`http://localhost:3000`). O script usa `--rm` para remover o contêiner ao encerrar.

No dashboard da Vercel, se o repositório for um monorepo, defina **Root Directory** como **`frontend`**.

## Saiba mais

- [Documentação do Next.js](https://nextjs.org/docs)
- [Learn Next.js](https://nextjs.org/learn) — tutorial interativo
- [Repositório do Next.js no GitHub](https://github.com/vercel/next.js)

## Deploy na Vercel

A forma mais direta de publicar o app é pela [plataforma Vercel](https://vercel.com/new). Veja também a [documentação de deploy do Next.js](https://nextjs.org/docs/app/building-your-application/deploying).
