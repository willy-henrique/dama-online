# ✅ Checklist de Configuração do Vercel

## 📋 Informações do Projeto

- **Project Name**: `dama-online` ✅
- **Project ID**: `prj_v8zpu7Xt4OOiIu6kIQATVQy3UEQ4` ✅

---

## 🔧 Configurações Essenciais

### 1. Root Directory
- [ ] **Deve ser**: `client`
- [ ] **NÃO deve ser**: `.` (raiz) ou vazio

**Onde verificar:**
- Settings → General → Root Directory

### 2. Build Settings
- [ ] **Framework Preset**: `Other` ou `Vite` (se disponível)
- [ ] **Build Command**: `npm run build`
- [ ] **Output Directory**: `dist`
- [ ] **Install Command**: `npm install`

**Onde verificar:**
- Settings → General → Build & Development Settings

### 3. Variáveis de Ambiente
- [ ] **Name**: `VITE_SERVER_URL`
- [ ] **Value**: URL do seu servidor
  - Se servidor local + ngrok: `https://abc123.ngrok.io`
  - Se Render/Railway: `https://dama-online-server.onrender.com`

**Onde configurar:**
- Settings → Environment Variables

### 4. Deploy Settings
- [ ] Repositório conectado: `willy-henrique/dama-online`
- [ ] Branch: `main` (ou a branch que você usa)

---

## 🚀 Próximos Passos

### Se você vai usar servidor local (testes):

1. **Inicie o servidor local:**
   ```bash
   cd server
   npm run dev
   ```

2. **Instale e inicie ngrok:**
   ```bash
   npm install -g ngrok
   ngrok http 3001
   ```

3. **Copie a URL do ngrok** (ex: `https://abc123.ngrok.io`)

4. **Configure no Vercel:**
   - Settings → Environment Variables
   - Adicione: `VITE_SERVER_URL` = URL do ngrok

5. **Faça o deploy:**
   - Vá em Deployments
   - Clique em "Redeploy" ou faça push de um commit

### Se você vai usar Render/Railway (produção):

1. **Faça deploy do servidor primeiro** (veja [DEPLOY.md](./DEPLOY.md))
2. **Copie a URL do servidor** (ex: `https://dama-online-server.onrender.com`)
3. **Configure no Vercel:**
   - Settings → Environment Variables
   - Adicione: `VITE_SERVER_URL` = URL do servidor
4. **Faça o deploy**

---

## ✅ Verificação Final

Após configurar tudo, verifique:

- [ ] Build funciona (veja logs do deployment)
- [ ] Site carrega sem erro 404
- [ ] Consegue criar uma sala
- [ ] Socket.IO conecta (verifique console do navegador)

---

## 🐛 Problemas Comuns

### Erro 404
- ✅ Verifique se Root Directory está como `client`
- ✅ Verifique se Output Directory está como `dist`
- Veja: [SOLUCAO_404_VERCEL.md](./SOLUCAO_404_VERCEL.md)

### "Cannot connect to server"
- ✅ Verifique se `VITE_SERVER_URL` está configurada
- ✅ Verifique se o servidor está rodando
- ✅ Teste a URL do servidor no navegador: `https://seu-servidor.com/health`

### Build falha
- ✅ Verifique os logs do deployment
- ✅ Teste localmente: `cd client && npm run build`
- ✅ Verifique se todas as dependências estão no `package.json`

---

## 📝 Notas

- **Project ID**: Use apenas se for interagir com a API do Vercel
- **Project Name**: Aparece na URL: `dama-online.vercel.app`
- **URL do projeto**: `https://dama-online.vercel.app` (ou domínio customizado se configurado)

---

**Desenvolvido por WillTech - Solução web**

