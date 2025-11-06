# 🔧 Solução: Erro 404 no Vercel

## Problema

Ao acessar `dama-online-bnjs.vercel.app`, você está vendo um erro **404: NOT_FOUND**.

## ✅ Soluções

### Solução 1: Verificar Configurações no Vercel Dashboard

1. **Acesse o Vercel Dashboard**: https://vercel.com/dashboard
2. **Vá para seu projeto**: `dama-online` (ou o nome do seu projeto)
3. **Clique em "Settings"**
4. **Verifique as seguintes configurações**:

   **General:**
   - ✅ Framework Preset: `Other` ou `Vite` (se disponível)
   - ✅ Root Directory: `client`
   - ✅ Build Command: `npm run build`
   - ✅ Output Directory: `dist`
   - ✅ Install Command: `npm install`

5. **Salve as alterações**
6. **Vá em "Deployments"** e faça um novo deploy:
   - Clique nos três pontos do último deployment
   - Selecione "Redeploy"

### Solução 2: Recriar o Projeto no Vercel

Se a Solução 1 não funcionar:

1. **Delete o projeto atual** (ou crie um novo)
2. **Crie um novo projeto**:
   - Acesse: https://vercel.com/new
   - Importe: `willy-henrique/dama-online`
3. **Configure manualmente**:
   ```
   Framework Preset: Other
   Root Directory: client
   Build Command: npm run build
   Output Directory: dist
   Install Command: npm install
   ```
4. **Adicione variável de ambiente**:
   - `VITE_SERVER_URL` = URL do seu servidor
5. **Deploy**

### Solução 3: Verificar se o Build está Funcionando

Teste localmente se o build funciona:

```bash
cd client
npm run build
```

Se funcionar, você verá uma pasta `dist` criada. Se der erro, corrija antes de fazer deploy.

### Solução 4: Verificar Arquivo vercel.json

Certifique-se de que o arquivo `client/vercel.json` existe e está correto:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm install",
  "framework": null,
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

## 🔍 Verificações Importantes

### 1. Root Directory está correto?

No Vercel Dashboard → Settings → General:
- ✅ Deve ser: `client`
- ❌ NÃO deve ser: `.` ou vazio

### 2. Output Directory está correto?

- ✅ Deve ser: `dist`
- ❌ NÃO deve ser: `build` ou outro

### 3. Build Command está correto?

- ✅ Deve ser: `npm run build`
- ❌ NÃO deve ser: `npm build` ou outro

### 4. Variáveis de Ambiente configuradas?

Verifique se `VITE_SERVER_URL` está configurada:
- Settings → Environment Variables
- Adicione: `VITE_SERVER_URL` = URL do seu servidor

## 📝 Checklist de Deploy Correto

- [ ] Repositório conectado: `willy-henrique/dama-online`
- [ ] Root Directory: `client`
- [ ] Framework: `Other` ou `Vite`
- [ ] Build Command: `npm run build`
- [ ] Output Directory: `dist`
- [ ] Install Command: `npm install`
- [ ] Variável `VITE_SERVER_URL` configurada
- [ ] Arquivo `client/vercel.json` existe
- [ ] Build local funciona (`npm run build` no diretório client)
- [ ] Deployment criado com sucesso
- [ ] Sem erros nos logs do deployment

## 🐛 Se ainda não funcionar

1. **Verifique os logs do deployment**:
   - Vercel Dashboard → Deployments → Clique no deployment
   - Veja os logs de build para identificar erros

2. **Teste o build localmente**:
   ```bash
   cd client
   npm install
   npm run build
   ```

3. **Verifique se o arquivo index.html está sendo gerado**:
   ```bash
   ls client/dist/index.html
   ```

4. **Tente fazer um commit vazio para triggerar novo deploy**:
   ```bash
   git commit --allow-empty -m "Fix: Trigger new Vercel deployment"
   git push
   ```

## 🚀 Deploy Manual via CLI (Alternativa)

Se preferir usar a CLI do Vercel:

```bash
# Instalar Vercel CLI
npm i -g vercel

# No diretório client
cd client
vercel

# Siga as instruções:
# - Link to existing project? Yes
# - Select project: dama-online
# - Override settings? Yes
# - Root Directory: ./
# - Build Command: npm run build
# - Output Directory: dist
```

---

**Desenvolvido por WillTech - Solução web**

