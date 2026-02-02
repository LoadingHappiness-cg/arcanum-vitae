# SEO / Indexação – Notas de alterações

## 2026-02-02 – Normalização de URLs com trailing slash

Sintoma: Google Search Console a reportar erro de redirecionamento e só uma página indexada, apesar de sitemap e roteamento estarem corretos em aparência.

Causa identificada:
- O servidor e o Cloudflare servem as páginas em URLs **com barra final** (`/music/`, `/about/`, etc.).
- O `sitemap.xml` e as tags `rel="canonical"` estavam a usar **URLs sem barra final** (`/music`, `/about`, ...).
- Resultado: o Google via `https://arcanumvitae.art/music` → 301 para `/music/`, mas a página respondia com canonical `https://arcanumvitae.art/music` (sem barra), o que é um padrão clássico para erros de redirecionamento / incoerência de URL preferida.

### Alterações aplicadas

1. **`prerender.tsx`**
   - Antes:
     ```ts
     const canonical = `${BASE_URL}${path === '/' ? '/' : path}`;
     ```
   - Depois (normalização explícita para trailing slash):
     ```ts
     const canonicalPath =
       path === '/'
         ? '/'
         : (path.endsWith('/') ? path : `${path}/`);

     const canonical = `${BASE_URL}${canonicalPath}`;
     ```
   - Efeito: todas as páginas (excepto `/`) passam a ter canonical com barra final, alinhado com o que o servidor realmente serve.

2. **`scripts/generate-seo.ts`** (geração de `public/sitemap.xml`)
   - Antes:
     ```ts
     const urls = routes
       .filter((r) => !r.includes(':'))
       .map((r) => `${BASE_URL}${r === '/' ? '/' : r}`);
     ```
   - Depois:
     ```ts
     const urls = routes
       .filter((r) => !r.includes(':'))
       .map((r) => {
         if (r === '/') return `${BASE_URL}/`;
         const path = r.endsWith('/') ? r : `${r}/`;
         return `${BASE_URL}${path}`;
       });
     ```
   - Efeito: o `sitemap.xml` passa a listar exatamente as mesmas URLs (com barra final) que o servidor serve e que aparecem nas tags canonical.

### Passos necessários após alterações

1. `npm run build` para regenerar:
   - `dist/` (HTML prerenderizado com meta/canonical atualizado)
   - `public/sitemap.xml` via `scripts/generate-seo.ts`.
2. Deploy normal (ex.: `deploy-lxc.sh` / PM2).
3. Verificação manual pós-deploy:
   - `view-source:https://arcanumvitae.art/music/` → `link rel="canonical"` termina em `/music/`.
   - `https://arcanumvitae.art/sitemap.xml` → todas as entradas `<loc>` têm barra final.
4. No Google Search Console:
   - Usar **Inspeção de URL** em algumas páginas chave (`/`, `/music/`, um track, `/about/`) e clicar **"Pedir indexação"**.

Expectativa: o erro de redirecionamento no Search Console deve desaparecer após o recrawl, e mais páginas devem começar a ser indexadas normalmente.
