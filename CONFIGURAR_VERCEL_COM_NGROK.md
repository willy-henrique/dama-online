# ✅ Configurar Vercel com ngrok

## 🎉 ngrok está funcionando!

Sua URL pública do ngrok:
```
https://geophytic-condemningly-drema.ngrok-free.dev
```

---

## 📋 Próximos Passos

### 1. Copiar a URL do ngrok

Sua URL é:
```
https://geophytic-condemningly-drema.ngrok-free.dev
```

**⚠️ IMPORTANTE**: 
- Essa URL muda toda vez que você reinicia o ngrok (versão gratuita)
- Você precisará atualizar no Vercel se reiniciar o ngrok

### 2. Configurar no Vercel

1. **Acesse o Vercel Dashboard**: https://vercel.com/dashboard
2. **Vá no seu projeto**: `dama-online`
3. **Settings** → **Environment Variables**
4. **Adicione nova variável**:
   - **Key**: `VITE_SERVER_URL`
   - **Value**: `https://geophytic-condemningly-drema.ngrok-free.dev`
   - **Environment**: Todas (Production, Preview, Development)
5. **Salve**

### 3. Fazer Novo Deploy

1. Vá em **Deployments**
2. Clique nos **três pontos** do último deployment
3. Selecione **Redeploy**
4. Ou faça um commit vazio para triggerar novo deploy:
   ```bash
   git commit --allow-empty -m "Update: Configure ngrok URL"
   git push
   ```

### 4. Verificar se Funcionou

1. Acesse a URL do seu app no Vercel
2. Tente criar uma sala
3. Verifique se conecta ao servidor local

---

## ⚠️ Lembretes Importantes

### Manter ngrok Rodando

- ✅ **NÃO feche o terminal do ngrok** enquanto estiver usando
- ✅ **NÃO feche o terminal do servidor** (porta 3001)
- ✅ Se reiniciar o ngrok, a URL muda e você precisa atualizar no Vercel

### Se a URL do ngrok Mudar

1. Copie a nova URL do ngrok
2. Vá no Vercel → Settings → Environment Variables
3. Edite `VITE_SERVER_URL` com a nova URL
4. Faça um novo deploy

---

## 🧪 Testar Localmente Primeiro

Antes de fazer deploy no Vercel, teste localmente:

1. **Inicie o servidor**:
   ```bash
   cd server
   npm run dev
   ```

2. **Inicie o cliente** (em outro terminal):
   ```bash
   cd client
   npm run dev
   ```

3. **Acesse**: `http://localhost:3000`
4. **Configure** `VITE_SERVER_URL` no arquivo `.env` do client:
   ```
   VITE_SERVER_URL=https://geophytic-condemningly-drema.ngrok-free.dev
   ```

Se funcionar localmente, funcionará no Vercel também!

---

## 📝 Checklist Final

- [ ] ngrok está rodando e mostrando a URL
- [ ] Servidor está rodando na porta 3001
- [ ] URL do ngrok copiada
- [ ] Variável `VITE_SERVER_URL` configurada no Vercel
- [ ] Novo deploy feito no Vercel
- [ ] Testado e funcionando

---

## 🚀 Próximo Nível: Usar Render/Railway

Quando quiser uma solução mais estável (URL fixa, sempre online):

1. Faça deploy do servidor no Render ou Railway
2. Use a URL fixa do servidor
3. Não precisa mais do ngrok

Veja: [DEPLOY.md](./DEPLOY.md)

---

**Desenvolvido por WillTech - Solução web**

