# 🔧 Solução: Erro DEPLOYMENT_DELETED no Vercel

## O que significa esse erro?

O erro **DEPLOYMENT_DELETED** ocorre quando você tenta acessar um deployment que foi removido automaticamente pela política de retenção do Vercel.

## ✅ Soluções

### Opção 1: Criar um Novo Deployment (Recomendado)

Se você está fazendo o deploy pela primeira vez ou o deployment foi deletado:

1. **Acesse o Vercel Dashboard**: https://vercel.com/dashboard
2. **Vá para seu projeto** (ou crie um novo)
3. **Conecte o repositório**: `willy-henrique/dama-online`
4. **Configure**:
   - **Root Directory**: `client`
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. **Adicione variável de ambiente**:
   - `VITE_SERVER_URL` = URL do seu servidor (Render/Railway)
6. **Clique em "Deploy"**

### Opção 2: Restaurar Deployment Deletado (se foi deletado recentemente)

Se o deployment foi deletado há menos de 30 dias:

1. Acesse **Settings** do seu projeto no Vercel
2. Vá em **Security** no painel lateral
3. Role até a seção **Recently Deleted**
4. Encontre o deployment que precisa ser restaurado
5. Clique no menu dropdown e selecione **Restore**
6. Complete o modal de confirmação

### Opção 3: Fazer Push para Triggerar Novo Deploy

Se o projeto já está conectado ao GitHub:

```bash
# Faça uma pequena alteração (ou apenas force um novo deploy)
git commit --allow-empty -m "Trigger new deployment"
git push
```

O Vercel detectará automaticamente e criará um novo deployment.

## 🚀 Passo a Passo Completo para Novo Deploy

### 1. Preparar o Back-end primeiro

**No Render ou Railway:**
- Deploy do servidor primeiro
- Copie a URL do servidor (ex: `https://dama-online-server.onrender.com`)

### 2. Deploy no Vercel

1. Acesse: https://vercel.com/new
2. **Import Git Repository**
3. Selecione: `willy-henrique/dama-online`
4. **Configure Project**:
   ```
   Framework Preset: Vite
   Root Directory: client
   Build Command: npm run build
   Output Directory: dist
   Install Command: npm install
   ```
5. **Environment Variables**:
   - Adicione: `VITE_SERVER_URL` = `https://seu-servidor.onrender.com`
6. **Deploy**

### 3. Atualizar CLIENT_URL no Back-end

Após o deploy do Vercel:
- Vá nas configurações do Render/Railway
- Atualize `CLIENT_URL` com a URL do Vercel
- Reinicie o serviço

## 🐛 Se o erro persistir

1. **Verifique se o projeto existe** no Vercel Dashboard
2. **Verifique as permissões** do repositório GitHub
3. **Tente desconectar e reconectar** o repositório
4. **Verifique os logs** do deployment no Vercel

## 📝 Checklist

- [ ] Back-end deployado e rodando (Render/Railway)
- [ ] URL do servidor copiada
- [ ] Projeto criado no Vercel
- [ ] Repositório conectado corretamente
- [ ] Root Directory configurado como `client`
- [ ] Variável `VITE_SERVER_URL` configurada
- [ ] Build Command: `npm run build`
- [ ] Output Directory: `dist`
- [ ] Deployment criado com sucesso
- [ ] `CLIENT_URL` atualizado no back-end

---

**Desenvolvido por WillTech - Solução web**

