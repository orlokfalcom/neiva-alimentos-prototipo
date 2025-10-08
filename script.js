const produtos = [
  {
    id: 1,
    nome: "Sal Marinho Flor de Sal 150g",
    preco: 24.9,
    imagem: "https://images.unsplash.com/photo-1615486364395-0e84a9288c01?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 2,
    nome: "Azeite de Oliva Extra Virgem 500ml",
    preco: 62.9,
    imagem: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 3,
    nome: "Vinagre Balsâmico Tradizionale 250ml",
    preco: 48.5,
    imagem: "https://images.unsplash.com/photo-1604908177067-a67df2df50fc?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 4,
    nome: "Pimenta-do-Reino Moída na Hora 100g",
    preco: 18.9,
    imagem: "https://images.unsplash.com/photo-1475856034134-5c529926f8b2?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 5,
    nome: "Orégano Desidratado Premium 60g",
    preco: 14.7,
    imagem: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=800&q=80&crop=entropy"
  }
];

const formatCurrency = (value) =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

function atualizarBadgeCarrinho() {
  const badge = document.querySelectorAll("[data-cart-count]");
  if (!badge.length) return;
  const carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
  badge.forEach(el => {
    el.textContent = carrinho.length;
  });
}

function carregarProdutos() {
  const container = document.getElementById("produtos");
  if (!container) return;
  container.innerHTML = "";

  produtos.forEach(produto => {
    const card = document.createElement("article");
    card.className = "product-card";
    card.innerHTML = `
      <img src="${produto.imagem}" alt="${produto.nome}">
      <h3>${produto.nome}</h3>
      <p>Blend natural selecionado para realçar sabores e texturas.</p>
      <p class="price">${formatCurrency(produto.preco)}</p>
      <button class="btn btn-primary" type="button" data-add="${produto.id}">Adicionar ao carrinho</button>
    `;
    container.appendChild(card);
  });

  container.querySelectorAll("[data-add]").forEach(button => {
    button.addEventListener("click", () => {
      adicionarCarrinho(Number(button.dataset.add));
    });
  });
}

function adicionarCarrinho(id) {
  const carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
  const produto = produtos.find(p => p.id === id);
  if (!produto) return;
  carrinho.push(produto);
  localStorage.setItem("carrinho", JSON.stringify(carrinho));
  atualizarBadgeCarrinho();
  exibirToast(`${produto.nome} adicionado ao carrinho`);
}

function exibirToast(message) {
  let toast = document.querySelector(".toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.className = "toast";
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add("is-visible");
  clearTimeout(exibirToast.timeoutId);
  exibirToast.timeoutId = setTimeout(() => {
    toast.classList.remove("is-visible");
  }, 2200);
}

function carregarCarrinho() {
  const container = document.getElementById("carrinho");
  const totalEl = document.getElementById("cart-total");
  if (!container) return;

  const carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
  container.innerHTML = "";

  if (carrinho.length === 0) {
    container.innerHTML = "<p>Seu carrinho está vazio no momento.</p>";
    if (totalEl) totalEl.textContent = formatCurrency(0);
    return;
  }

  let total = 0;
  carrinho.forEach(produto => {
    total += produto.preco;
    const item = document.createElement("div");
    item.className = "cart-item";
    item.innerHTML = `
      <div class="cart-item-info">
        <span class="cart-item-name">${produto.nome}</span>
        <span class="cart-item-price">${formatCurrency(produto.preco)}</span>
      </div>
      <button class="btn btn-ghost" type="button" data-remove="${produto.id}">Remover</button>
    `;
    container.appendChild(item);
  });

  if (totalEl) totalEl.textContent = formatCurrency(total);

  container.querySelectorAll("[data-remove]").forEach(button => {
    button.addEventListener("click", () => {
      removerDoCarrinho(Number(button.dataset.remove));
    });
  });
}

function removerDoCarrinho(id) {
  let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
  carrinho = carrinho.filter(item => item.id !== id);
  localStorage.setItem("carrinho", JSON.stringify(carrinho));
  carregarCarrinho();
  atualizarBadgeCarrinho();
}

function carregarResumoCheckout() {
  const subtotalEl = document.getElementById("checkout-subtotal");
  const totalEl = document.getElementById("checkout-total");
  if (!subtotalEl || !totalEl) return;
  const carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
  const subtotal = carrinho.reduce((acc, item) => acc + item.preco, 0);
  subtotalEl.textContent = formatCurrency(subtotal);
  totalEl.textContent = formatCurrency(subtotal);
}

// ===================== CARROSSEL DE PRODUTOS =====================
let deslocamento = 0;

function carregarCarrossel() {
  const container = document.getElementById("carousel-items");
  if (!container) return;
  container.innerHTML = "";

  produtos.forEach(produto => {
    const card = document.createElement("article");
    card.className = "carousel-item";
    card.innerHTML = `
      <img src="${produto.imagem}" alt="${produto.nome}">
      <h3>${produto.nome}</h3>
      <p>${formatCurrency(produto.preco)}</p>
      <button class="btn btn-primary" type="button" data-add-carousel="${produto.id}">Adicionar ao carrinho</button>
    `;
    container.appendChild(card);
  });

  container.querySelectorAll("[data-add-carousel]").forEach(button => {
    button.addEventListener("click", () => {
      adicionarCarrinho(Number(button.dataset.addCarousel));
    });
  });
}

function moverCarrossel(direcao) {
  const track = document.querySelector(".carousel-track");
  if (!track) return;

  const itemLargura = 284;
  const total = document.querySelectorAll(".carousel-item").length;
  const visivel = Math.floor(track.offsetWidth / itemLargura);
  deslocamento += direcao * itemLargura;

  const maxDeslocamento = Math.max(0, (total - visivel) * itemLargura);
  if (deslocamento < 0) deslocamento = 0;
  if (deslocamento > maxDeslocamento) deslocamento = maxDeslocamento;

  track.style.transform = `translateX(-${deslocamento}px)`;
}

// ===================== Animações de rolagem =====================
function initScrollAnimations() {
  const targets = document.querySelectorAll("[data-animate]");
  if (!targets.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  targets.forEach(el => observer.observe(el));
}

// ===================== Inicialização =====================
function init() {
  carregarProdutos();
  carregarCarrinho();
  carregarCarrossel();
  carregarResumoCheckout();
  atualizarBadgeCarrinho();
  initScrollAnimations();
}

document.addEventListener("DOMContentLoaded", init);
