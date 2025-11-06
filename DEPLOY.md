# 🚀 Guia de Deploy - Vercel

Este guia explica como fazer o deploy do jogo de Damas Online no Vercel (front-end) e Render/Railway (back-end).

## ⚠️ IMPORTANTE: Duas Plataformas Diferentes

**O projeto precisa de DUAS plataformas:**
- 🎨 **Vercel**: Para o front-end (pasta `client/`)
- 🖥️ **Render/Railway**: Para o back-end (pasta `server/`)

**❌ NÃO coloque o servidor no Vercel!** O Vercel é apenas para o front-end.

📖 Para entender melhor a arquitetura, veja: **[ARQUITETURA_DEPLOY.md](./ARQUITETURA_DEPLOY.md)**

## 📋 Pré-requisitos

1. Conta no [Vercel](https://vercel.com) (gratuita)
2. Conta no [Render](https://render.com) ou [Railway](https://railway.app) (gratuita)
3. Repositório no GitHub (já configurado ✅)

## 🔧 Passo 1: Deploy do Back-end (Render ou Railway)

### Opção A: Render

1. Acesse [render.com](https://render.com) e faça login
2. Clique em **"New +"** → **"Web Service"**
3. Conecte seu repositório GitHub: `willy-henrique/dama-online`
4. Configure:
   - **Name**: `dama-online-server`
   - **Root Directory**: `server`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

5. Adicione variáveis de ambiente:
   - `PORT`: `3001`
   - `CLIENT_URL`: `https://seu-app.vercel.app` (você atualizará depois)

6. Clique em **"Create Web Service"**
7. Aguarde o deploy e copie a URL (ex: `https://dama-online-server.onrender.com`)

### Opção B: Railway

1. Acesse [railway.app](https://railway.app) e faça login
2. Clique em **"New Project"** → **"Deploy from GitHub repo"**
3. Selecione o repositório `willy-henrique/dama-online`
4. Clique em **"Add Service"** → **"GitHub Repo"**
5. Configure:
   - **Root Directory**: `server`
   - **Start Command**: `npm start`

6. Adicione variáveis de ambiente:
   - `PORT`: `3001`
   - `CLIENT_URL`: `https://seu-app.vercel.app` (você atualizará depois)

7. Aguarde o deploy e copie a URL gerada

## 🎨 Passo 2: Deploy do Front-end (Vercel)

1. Acesse [vercel.com](https://vercel.com) e faça login com GitHub
2. Clique em **"Add New..."** → **"Project"**
3. Importe o repositório: `willy-henrique/dama-online`
4. Configure o projeto:
   - **Framework Preset**: Vite
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

5. Adicione variável de ambiente:
   - **Name**: `VITE_SERVER_URL`
   - **Value**: URL do seu servidor (ex: `https://dama-online-server.onrender.com`)

6. Clique em **"Deploy"**
7. Aguarde o deploy completar
8. Copie a URL do seu app (ex: `https://dama-online.vercel.app`)

## 🔄 Passo 3: Atualizar CLIENT_URL no Back-end

Após o deploy do front-end, você precisa atualizar a variável `CLIENT_URL` no back-end:

1. No Render/Railway, vá em **Environment Variables**
2. Atualize `CLIENT_URL` com a URL do Vercel (ex: `https://dama-online.vercel.app`)
3. Reinicie o serviço

## ✅ Verificação

1. Acesse a URL do Vercel
2. Teste criar uma sala
3. Teste entrar em uma sala (em outra aba/navegador)
4. Verifique se os movimentos estão sincronizando

## 🐛 Troubleshooting

### Erro: "DEPLOYMENT_DELETED"
Este erro ocorre quando um deployment foi removido. Veja o guia completo: **[SOLUCAO_DEPLOYMENT_DELETED.md](./SOLUCAO_DEPLOYMENT_DELETED.md)**

**Solução rápida:**
1. Crie um novo deployment no Vercel
2. Ou restaure o deployment deletado (se foi há menos de 30 dias)
3. Verifique as configurações do projeto

### Erro: "Cannot connect to server"
- Verifique se `VITE_SERVER_URL` está configurada corretamente no Vercel
- Verifique se o servidor está rodando (acesse a URL do servidor + `/health`)

### Erro: CORS
- Verifique se `CLIENT_URL` no servidor está com a URL correta do Vercel
- Certifique-se de que não há barra `/` no final da URL

### Socket.IO não conecta
- Verifique se o servidor suporta WebSockets (Render e Railway suportam)
- Verifique os logs do servidor para erros

## 📝 URLs de Exemplo

Após o deploy, você terá:
- **Front-end**: `https://dama-online.vercel.app`
- **Back-end**: `https://dama-online-server.onrender.com`

## 🔐 Variáveis de Ambiente Resumo

### Vercel (Front-end)
```
VITE_SERVER_URL=https://dama-online-server.onrender.com
```

### Render/Railway (Back-end)
```
PORT=3001
CLIENT_URL=https://dama-online.vercel.app
```

---

**Desenvolvido por WillTech - Solução web**

