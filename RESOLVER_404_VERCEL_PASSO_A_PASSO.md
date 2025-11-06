# 🔧 Resolver 404 no Vercel - Passo a Passo

## 🐛 Problema Atual

Você está vendo `404: NOT_FOUND` em `dama-online-rho.vercel.app`

## ✅ Solução Passo a Passo

### Passo 1: Verificar Configurações no Vercel

1. **Acesse**: https://vercel.com/dashboard
2. **Clique no projeto**: `dama-online`
3. **Vá em**: Settings → General

### Passo 2: Configurar Root Directory (CRÍTICO!)

**Esta é a configuração mais importante!**

1. Role até a seção **"Root Directory"**
2. **Deve estar**: `client`
3. **NÃO deve estar**: `.` (ponto) ou vazio
4. Se estiver errado, **edite e coloque**: `client`
5. **Salve**

### Passo 3: Verificar Build Settings

Na mesma página (Settings → General), verifique:

- **Framework Preset**: `Other` ou `Vite`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

Se alguma estiver diferente, **corrija e salve**.

### Passo 4: Verificar Variável de Ambiente

1. **Vá em**: Settings → Environment Variables
2. **Verifique se existe**:
   - **Key**: `VITE_SERVER_URL`
   - **Value**: `https://geophytic-condemningly-drema.ngrok-free.dev`
3. Se não existir, **adicione**:
   - Clique em "Add New"
   - Key: `VITE_SERVER_URL`
   - Value: `https://geophytic-condemningly-drema.ngrok-free.dev`
   - Environment: All
   - Salve

### Passo 5: Verificar Logs do Último Deploy

1. **Vá em**: Deployments
2. **Clique no último deployment** (o mais recente)
3. **Veja os logs**:
   - Se houver erros de build, anote-os
   - Se o build foi bem-sucedido, o problema é de configuração

### Passo 6: Fazer Novo Deploy

**Opção A: Redeploy Manual**

1. Vá em **Deployments**
2. Clique nos **três pontos** do último deployment
3. Selecione **"Redeploy"**
4. Aguarde o deploy completar

**Opção B: Triggerar via Git**

```bash
git commit --allow-empty -m "Fix: Trigger new Vercel deployment"
git push
```

### Passo 7: Verificar se Funcionou

1. Aguarde o deploy completar (pode levar 1-2 minutos)
2. Acesse: `https://dama-online-rho.vercel.app`
3. **Deve aparecer**: Interface do jogo (não mais 404)

---

## 🔍 Diagnóstico: Verificar o que Está Errado

### Se o Build Falhou

**Sintoma**: Logs mostram erros de build

**Solução**:
1. Teste localmente:
   ```bash
   cd client
   npm run build
   ```
2. Se der erro local, corrija antes de fazer deploy
3. Se funcionar local, o problema é no Vercel

### Se Root Directory Está Errado

**Sintoma**: Build funciona mas mostra 404

**Solução**:
1. Vá em Settings → General
2. Root Directory: `client` (não `.` ou vazio)
3. Salve e faça novo deploy

### Se Output Directory Está Errado

**Sintoma**: Build funciona mas não encontra arquivos

**Solução**:
1. Vá em Settings → General
2. Output Directory: `dist` (não `build` ou outro)
3. Salve e faça novo deploy

---

## 📋 Checklist Rápido

Antes de fazer novo deploy, verifique:

- [ ] Root Directory = `client` (não `.` ou vazio)
- [ ] Output Directory = `dist`
- [ ] Build Command = `npm run build`
- [ ] Install Command = `npm install`
- [ ] Variável `VITE_SERVER_URL` configurada
- [ ] Build local funciona (`cd client && npm run build`)

---

## 🚨 Se Ainda Não Funcionar

### Opção 1: Recriar Projeto

1. Delete o projeto atual no Vercel
2. Crie um novo projeto
3. Importe: `willy-henrique/dama-online`
4. **Configure manualmente**:
   - Root Directory: `client`
   - Framework: `Other`
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. Adicione variável `VITE_SERVER_URL`
6. Deploy

### Opção 2: Verificar Arquivo vercel.json

O arquivo `client/vercel.json` deve existir e estar correto.

Se não existir ou estiver errado, o Vercel pode não detectar as configurações.

---

## 💡 Dica: Verificar Build Local Primeiro

Antes de fazer deploy, sempre teste localmente:

```bash
cd client
npm install
npm run build
```

Se funcionar localmente, o problema é de configuração no Vercel.

---

## 📞 Próximos Passos

1. Siga os passos acima
2. Verifique especialmente o **Root Directory**
3. Faça um novo deploy
4. Teste novamente

Se ainda não funcionar, me mostre:
- Screenshot das configurações do Vercel (Settings → General)
- Logs do último deployment

---

**Desenvolvido por WillTech - Solução web**

