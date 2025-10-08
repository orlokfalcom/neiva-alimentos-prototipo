const produtos = [
  {
    id: 1,
    nome: "Sal Marinho 1kg",
    preco: 5.9,
    imagem: "https://cdn.pixabay.com/photo/2017/03/10/12/04/salt-2137330_1280.jpg"
  },
  {
    id: 2,
    nome: "Azeite de Oliva Extra Virgem 500ml",
    preco: 29.9,
    imagem: "https://cdn.pixabay.com/photo/2017/05/23/22/36/olive-oil-2339110_1280.jpg"
  },
  {
    id: 3,
    nome: "Vinagre Balsâmico 250ml",
    preco: 12.5,
    imagem: "https://cdn.pixabay.com/photo/2017/01/03/21/33/vinegar-1959534_1280.jpg"
  },
  {
    id: 4,
    nome: "Pimenta-do-Reino Moída 100g",
    preco: 8.9,
    imagem: "https://cdn.pixabay.com/photo/2016/08/29/09/53/pepper-1627543_1280.jpg"
  },
  {
    id: 5,
    nome: "Orégano Desidratado 50g",
    preco: 6.2,
    imagem: "https://cdn.pixabay.com/photo/2016/06/17/13/33/oregano-1460292_1280.jpg"
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
