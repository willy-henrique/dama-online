# 🏗️ Arquitetura de Deploy - Onde Cada Parte Vai?

## ⚠️ IMPORTANTE: Separação Front-end e Back-end

O projeto tem **DUAS PARTES SEPARADAS** que vão em **PLATAFORMAS DIFERENTES**:

```
┌─────────────────────────────────────────────────────────┐
│                    SEU PROJETO                           │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  📁 client/          →  VERCEL (Front-end)              │
│     (React + Vite)                                       │
│                                                           │
│  📁 server/          →  RENDER ou RAILWAY (Back-end)   │
│     (Node.js + Socket.IO)                                │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

## 🎨 Front-end (Client) → VERCEL

**O que vai no Vercel:**
- ✅ Apenas a pasta `client/`
- ✅ Interface React
- ✅ Arquivos estáticos (HTML, CSS, JS)

**Variáveis de Ambiente no Vercel:**
```
VITE_SERVER_URL = https://dama-online-server.onrender.com
```

**Configurações no Vercel:**
- Root Directory: `client`
- Build Command: `npm run build`
- Output Directory: `dist`

---

## 🖥️ Back-end (Server) → RENDER ou RAILWAY

**O que vai no Render/Railway:**
- ✅ Apenas a pasta `server/`
- ✅ Servidor Node.js
- ✅ Socket.IO para tempo real

**Variáveis de Ambiente no Render/Railway:**
```
PORT = 3001
CLIENT_URL = https://dama-online.vercel.app
```

**Configurações no Render/Railway:**
- Root Directory: `server`
- Build Command: `npm install`
- Start Command: `npm start`

---

## ❌ O que NÃO fazer

### ❌ NÃO colocar o servidor no Vercel
O Vercel é para front-end estático. O servidor precisa de:
- WebSockets (Socket.IO)
- Processo contínuo rodando
- Porta dedicada

**O Vercel não suporta isso adequadamente para este tipo de aplicação.**

### ❌ NÃO colocar variáveis do servidor no Vercel
As variáveis `PORT` e `CLIENT_URL` são do **servidor**, não do cliente.

---

## ✅ Fluxo Correto de Deploy

### Passo 1: Deploy do Servidor (Render/Railway) PRIMEIRO

1. **Render ou Railway:**
   - Conecte o repositório: `willy-henrique/dama-online`
   - Root Directory: `server`
   - Variáveis:
     - `PORT=3001`
     - `CLIENT_URL=https://seu-app.vercel.app` (você atualiza depois)
   - Deploy
   - Copie a URL do servidor (ex: `https://dama-online-server.onrender.com`)

### Passo 2: Deploy do Cliente (Vercel) DEPOIS

1. **Vercel:**
   - Conecte o repositório: `willy-henrique/dama-online`
   - Root Directory: `client`
   - Variável:
     - `VITE_SERVER_URL=https://dama-online-server.onrender.com` (URL do passo 1)
   - Deploy
   - Copie a URL do Vercel (ex: `https://dama-online.vercel.app`)

### Passo 3: Atualizar CLIENT_URL no Servidor

1. **Volte no Render/Railway:**
   - Vá em Environment Variables
   - Atualize `CLIENT_URL` com a URL do Vercel do Passo 2
   - Reinicie o serviço

---

## 🔄 Como Funciona a Comunicação

```
┌─────────────────┐         Socket.IO          ┌─────────────────┐
│                 │  ←──────────────────────→  │                 │
│   VERCEL        │      (WebSockets)          │   RENDER/       │
│   (Front-end)   │                            │   RAILWAY      │
│                 │                            │   (Back-end)    │
│  React App      │                            │  Node.js Server│
│                 │                            │                 │
└─────────────────┘                            └─────────────────┘
     │                                                    │
     │                                                    │
     └────────────────────────────────────────────────────┘
                    HTTP Requests (opcional)
```

**Fluxo:**
1. Usuário acessa o app no Vercel
2. React se conecta ao servidor via Socket.IO (URL em `VITE_SERVER_URL`)
3. Servidor valida origem via `CLIENT_URL`
4. Comunicação em tempo real estabelecida

---

## 📋 Checklist de Variáveis

### ✅ Vercel (Front-end)
- [ ] `VITE_SERVER_URL` = URL do servidor (Render/Railway)

### ✅ Render/Railway (Back-end)
- [ ] `PORT` = `3001`
- [ ] `CLIENT_URL` = URL do Vercel

---

## 🐛 Problemas Comuns

### "Cannot connect to server"
- ❌ Verifique se `VITE_SERVER_URL` está correta no Vercel
- ❌ Verifique se o servidor está rodando (Render/Railway)

### Erro de CORS
- ❌ Verifique se `CLIENT_URL` está correta no servidor
- ❌ Certifique-se de que não há barra `/` no final da URL

### Socket.IO não conecta
- ❌ Verifique se ambas as URLs estão corretas
- ❌ Verifique se o servidor suporta WebSockets (Render e Railway suportam)

---

## 💡 Resumo Visual

```
┌─────────────────────────────────────────────────────────────┐
│                    GITHUB REPOSITORY                        │
│              willy-henrique/dama-online                     │
│                                                              │
│  ┌──────────────┐              ┌──────────────┐              │
│  │   client/    │              │   server/   │              │
│  │              │              │             │              │
│  │  React App   │              │  Node.js   │              │
│  └──────┬───────┘              └──────┬─────┘              │
│         │                              │                    │
│         │                              │                    │
│         ▼                              ▼                    │
│  ┌──────────────┐              ┌──────────────┐              │
│  │    VERCEL    │              │ RENDER/     │              │
│  │              │              │ RAILWAY     │              │
│  │ Front-end    │              │ Back-end    │              │
│  │              │              │             │              │
│  │ VITE_SERVER_ │              │ PORT        │              │
│  │ URL          │              │ CLIENT_URL  │              │
│  └──────────────┘              └──────────────┘              │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

**Desenvolvido por WillTech - Solução web**

