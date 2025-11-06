# 🧪 Testando com Servidor Local

## ⚠️ Importante: Apenas para Testes!

Você **PODE** rodar o servidor localmente e conectar o Vercel a ele, mas há limitações:

### ✅ Vantagens
- Testa rapidamente sem fazer deploy
- Não precisa criar conta no Render/Railway ainda
- Bom para desenvolvimento

### ❌ Desvantagens
- Seu PC precisa estar ligado sempre
- Precisa de IP público ou túnel (ngrok)
- Não é solução de produção
- Se reiniciar o PC, o servidor para

---

## 🚀 Opção 1: Usar ngrok (Recomendado para Testes)

### Passo 1: Instalar ngrok

1. Baixe em: https://ngrok.com/download
2. Ou instale via npm:
```bash
npm install -g ngrok
```

### Passo 2: Iniciar o Servidor Local

```bash
cd server
npm run dev
```

O servidor vai rodar em `http://localhost:3001`

### Passo 3: Criar Túnel com ngrok

Em outro terminal:

```bash
ngrok http 3001
```

Você verá algo como:
```
Forwarding  https://abc123.ngrok.io -> http://localhost:3001
```

Copie a URL `https://abc123.ngrok.io`

### Passo 4: Configurar no Vercel

1. Vá no Vercel Dashboard → Settings → Environment Variables
2. Adicione:
   - **Name**: `VITE_SERVER_URL`
   - **Value**: `https://abc123.ngrok.io` (URL do ngrok)
3. Faça um novo deploy

### ⚠️ Importante sobre ngrok

- A URL muda toda vez que você reinicia o ngrok (versão gratuita)
- Você precisa atualizar no Vercel toda vez
- Versão paga tem URL fixa

---

## 🔧 Opção 2: IP Público (Mais Complexo)

Se você tem IP público fixo e sabe configurar port forwarding:

1. Configure port forwarding no roteador (porta 3001)
2. Use seu IP público: `http://SEU_IP:3001`
3. Configure no Vercel: `VITE_SERVER_URL=http://SEU_IP:3001`

**Problemas:**
- Precisa IP público fixo
- Precisa configurar firewall/roteador
- Menos seguro (expõe seu PC)

---

## 📋 Passo a Passo Completo (ngrok)

### 1. Instalar Dependências (se ainda não fez)

```bash
cd server
npm install
```

### 2. Iniciar Servidor

```bash
npm run dev
```

Você deve ver:
```
🚀 Servidor rodando na porta 3001
```

### 3. Instalar e Iniciar ngrok

```bash
# Instalar (se ainda não tem)
npm install -g ngrok

# Criar túnel
ngrok http 3001
```

### 4. Configurar Variáveis no Servidor

No arquivo `server/index.js`, o servidor já está configurado para aceitar qualquer origem em desenvolvimento. Mas para produção, você precisa:

**No servidor local (para testes):**
- Não precisa configurar `CLIENT_URL` (já aceita tudo em dev)

**No Vercel:**
- Adicione: `VITE_SERVER_URL` = URL do ngrok

### 5. Testar

1. Acesse a URL do Vercel
2. Tente criar uma sala
3. Verifique se conecta ao servidor local

---

## 🎯 Variáveis de Ambiente

### Servidor Local (não precisa configurar nada)
O servidor já aceita qualquer origem em desenvolvimento.

### Vercel
```
VITE_SERVER_URL = https://abc123.ngrok.io
```

---

## ⚠️ Limitações Importantes

1. **ngrok gratuito:**
   - URL muda a cada reinício
   - Limite de conexões
   - Pode ser lento

2. **Servidor local:**
   - PC precisa estar ligado
   - Internet precisa estar funcionando
   - Não é para produção

3. **Para produção:**
   - Use Render ou Railway (sempre online)
   - URLs fixas
   - Mais confiável

---

## 🚀 Quando Usar Cada Opção

### ✅ Use Servidor Local + ngrok quando:
- Está desenvolvendo/testando
- Quer testar rápido
- Não precisa de disponibilidade 24/7

### ✅ Use Render/Railway quando:
- Quer colocar em produção
- Precisa de disponibilidade 24/7
- Quer URL fixa
- Quer solução profissional

---

## 🔄 Migrar de Local para Render/Railway

Quando quiser migrar:

1. Faça deploy no Render/Railway (veja [DEPLOY.md](./DEPLOY.md))
2. Copie a URL do servidor
3. Atualize `VITE_SERVER_URL` no Vercel
4. Pronto! Agora está em produção

---

**Desenvolvido por WillTech - Solução web**

