# Neiva alimentos — Guia do Projeto

## Comandos essenciais
- **Build local**: Projeto composto por páginas estáticas (HTML/CSS/JS). Abra `index.html` diretamente no navegador ou use um servidor estático (ex.: `npx serve .`).
- **Dependências**: Não há gerenciador de pacotes; fontes locais estão em `assets/fonts`.

## Arquitetura e estrutura
- **Páginas**: `index.html` (login), `cadastro.html`, `home.html`, `produtos.html`, `carrinho.html`, `checkout.html`.
- **Estilos**: `style.css` (tema premium com tons neutros, import de fontes locais via `@import url('./assets/fonts/8df7451d6c0a4b4981b47ded666596a8.css');`).
- **Scripts**: `script.js` centraliza dados de produtos, manipula carrossel, carrinho no `localStorage`, badges de contagem e animações `IntersectionObserver`.
- **Fontes**: Arquivos `.ttf` armazenados em `assets/fonts` (Inter 400–700, Playfair Display 500–700) e CSS auxiliar `8df7451d6c0a4b4981b47ded666596a8.css` com `@font-face` apontando para os arquivos locais.

## Dados e armazenamento
- **Carrinho**: Persistido em `localStorage` (chave `carrinho`); funções `adicionarCarrinho`, `removerDoCarrinho`, `carregarCarrinho`, `carregarResumoCheckout` garantem atualização das páginas.
- **Produtos**: Lista `produtos` definida em `script.js`, utilizada tanto nos grids como no carrossel.
