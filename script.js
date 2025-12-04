document.addEventListener("DOMContentLoaded", () => {
  const tabButtons = document.querySelectorAll(".tab-btn");
  const tabPanels = {
    inventario: document.getElementById("tab-inventario"),
    compras: document.getElementById("tab-compras")
  };

  const envChips = document.querySelectorAll(".chip[data-env]");
  const summaryBar = document.querySelector(".summary-bar");
  const inventoryList = document.getElementById("inventoryList");
  const shoppingList = document.getElementById("shoppingList");

  const shoppingModeChips = document.querySelectorAll("#shoppingModeRow .chip[data-shop]");
  let shoppingMode = "geral";

  const btnAdd = document.querySelector(".btn-add");
  const addModal = document.getElementById("addItemModal");
  const addItemTitle = document.getElementById("addItemTitle");
  const addItemName = document.getElementById("addItemName");
  const addItemGroup = document.getElementById("addItemGroup");
  const addItemQty = document.getElementById("addItemQty");
  const addItemUnit = document.getElementById("addItemUnit");
  const addItemCancel = document.getElementById("addItemCancel");
  const addItemSave = document.getElementById("addItemSave");

  let currentEnv = "despensa";

  // controle de edição
  let editingEnv = null;
  let editingId = null;

  const envLabels = {
    hortifruti: "🥗 Hortifruti",
    laticinios: "🧀 Laticínios & ovos",
    freezer: "❄️ Freezer",
    despensa: "📦 Despensa",
    cozinha: "🍽️ Cozinha",
    banheiro: "🚽 Banheiro",
    area: "🧺 Área de serviço",
    farmacia: "💊 Farmácia"
  };

  // === DADOS INICIAIS DO INVENTÁRIO ===
  let inventoryData = {
    hortifruti: [
      // Frutas
      { id: "maca", name: "Maçã", group: "Frutas", status: "ok", qty: 0, unit: "UN", shoppingToday: false, weekendKit: false, tagHealth: null },
      { id: "mamao", name: "Mamão", group: "Frutas", status: "ok", qty: 0, unit: "UN", shoppingToday: false, weekendKit: false, tagHealth: null },
      { id: "banana", name: "Banana prata ou nanica", group: "Frutas", status: "ok", qty: 0, unit: "UN", shoppingToday: false, weekendKit: false, tagHealth: null },
      { id: "maracuja", name: "Maracujá", group: "Frutas", status: "ok", qty: 0, unit: "UN", shoppingToday: false, weekendKit: false, tagHealth: null },
      { id: "melao", name: "Melão", group: "Frutas", status: "ok", qty: 0, unit: "UN", shoppingToday: false, weekendKit: false, tagHealth: null },
      { id: "pera", name: "Pera", group: "Frutas", status: "ok", qty: 0, unit: "UN", shoppingToday: false, weekendKit: false, tagHealth: null },
      { id: "kiwi", name: "Kiwi", group: "Frutas", status: "ok", qty: 0, unit: "UN", shoppingToday: false, weekendKit: false, tagHealth: null },
      { id: "manga", name: "Manga", group: "Frutas", status: "ok", qty: 0, unit: "UN", shoppingToday: false, weekendKit: false, tagHealth: null },
      { id: "ameixa", name: "Ameixa", group: "Frutas", status: "ok", qty: 0, unit: "UN", shoppingToday: false, weekendKit: false, tagHealth: null },
      { id: "frutas-vermelhas", name: "Frutas vermelhas (frescas ou congeladas)", group: "Frutas", status: "ok", qty: 0, unit: "UN", shoppingToday: false, weekendKit: false, tagHealth: null },

      // Legumes
      { id: "cebola", name: "Cebola", group: "Legumes", status: "ok", qty: 0, unit: "UN", shoppingToday: false, weekendKit: false, tagHealth: null },
      { id: "alho", name: "Alho", group: "Legumes", status: "ok", qty: 0, unit: "UN", shoppingToday: false, weekendKit: false, tagHealth: null },
      { id: "pimentao", name: "Pimentão", group: "Legumes", status: "ok", qty: 0, unit: "UN", shoppingToday: false, weekendKit: false, tagHealth: null },
      { id: "tomate-cereja", name: "Tomate cereja ou grape", group: "Legumes", status: "ok", qty: 0, unit: "UN", shoppingToday: false, weekendKit: false, tagHealth: null },
      { id: "tomate", name: "Tomate", group: "Legumes", status: "ok", qty: 0, unit: "UN", shoppingToday: false, weekendKit: false, tagHealth: null },
      { id: "cenoura", name: "Cenoura", group: "Legumes", status: "ok", qty: 0, unit: "UN", shoppingToday: false, weekendKit: false, tagHealth: null },
      { id: "inhame", name: "Inhame", group: "Legumes", status: "ok", qty: 0, unit: "UN", shoppingToday: false, weekendKit: false, tagHealth: null },
      { id: "batata", name: "Batata", group: "Legumes", status: "ok", qty: 0, unit: "UN", shoppingToday: false, weekendKit: false, tagHealth: null },
      { id: "abobrinha", name: "Abobrinha", group: "Legumes", status: "ok", qty: 0, unit: "UN", shoppingToday: false, weekendKit: false, tagHealth: null },
      { id: "abobora-jap", name: "Abóbora jap", group: "Legumes", status: "ok", qty: 0, unit: "UN", shoppingToday: false, weekendKit: false, tagHealth: null },
      { id: "chuchu", name: "Chuchu", group: "Legumes", status: "ok", qty: 0, unit: "UN", shoppingToday: false, weekendKit: false, tagHealth: null },
      { id: "brocolis", name: "Brócolis", group: "Legumes", status: "ok", qty: 0, unit: "UN", shoppingToday: false, weekendKit: false, tagHealth: null },
      { id: "couve-flor", name: "Couve-flor", group: "Legumes", status: "ok", qty: 0, unit: "UN", shoppingToday: false, weekendKit: false, tagHealth: null },
      { id: "batata-doce", name: "Batata-doce", group: "Legumes", status: "ok", qty: 0, unit: "UN", shoppingToday: false, weekendKit: false, tagHealth: null },
      { id: "cogumelos", name: "Cogumelos", group: "Legumes", status: "ok", qty: 0, unit: "UN", shoppingToday: false, weekendKit: false, tagHealth: null },

      // Verduras
      { id: "alface", name: "Alface", group: "Verduras", status: "ok", qty: 0, unit: "UN", shoppingToday: false, weekendKit: false, tagHealth: null },
      { id: "rucula-agriao", name: "Rúcula ou Agrião", group: "Verduras", status: "ok", qty: 0, unit: "UN", shoppingToday: false, weekendKit: false, tagHealth: null },
      { id: "espinafre", name: "Espinafre", group: "Verduras", status: "ok", qty: 0, unit: "UN", shoppingToday: false, weekendKit: false, tagHealth: null },
      { id: "cebolinha", name: "Salsinha-Cebolinha", group: "Verduras", status: "ok", qty: 0, unit: "UN", shoppingToday: false, weekendKit: false, tagHealth: null },
    ],

    laticinios: [
      { id: "leite", name: "Leite", group: "Laticínios & ovos", status: "ok", qty: 0, unit: "UN", shoppingToday: false, weekendKit: false, tagHealth: null },
      { id: "leite-castanha", name: "Leite Castanha", group: "Laticínios & ovos", status: "ok", qty: 0, unit: "UN", shoppingToday: false, weekendKit: false, tagHealth: null },
      { id: "queijo-padrao", name: "Queijo padrão", group: "Laticínios & ovos", status: "ok", qty: 0, unit: "UN", shoppingToday: false, weekendKit: false, tagHealth: null },
      { id: "queijo-parmesao", name: "Queijo parmesão", group: "Laticínios & ovos", status: "ok", qty: 0, unit: "UN", shoppingToday: false, weekendKit: false, tagHealth: null },
      { id: "manteiga", name: "Manteiga", group: "Laticínios & ovos", status: "ok", qty: 0, unit: "UN", shoppingToday: false, weekendKit: false, tagHealth: null },
      { id: "ovo", name: "Ovo", group: "Laticínios & ovos", status: "ok", qty: 0, unit: "UN", shoppingToday: false, weekendKit: false, tagHealth: null }
    ],

    freezer: [
      { id: "filezinho", name: "Filezinho", group: "Proteínas congeladas", status: "ok", qty: 0, unit: "UN", shoppingToday: false, weekendKit: false, tagHealth: null },
      { id: "peito-frango", name: "Peito de frango", group: "Proteínas congeladas", status: "ok", qty: 0, unit: "UN", shoppingToday: false, weekendKit: false, tagHealth: null },
      { id: "sobrecoxa", name: "Sobrecoxa", group: "Proteínas congeladas", status: "ok", qty: 0, unit: "UN", shoppingToday: false, weekendKit: false, tagHealth: null },
      { id: "frango-desfiado", name: "Frango desfiado", group: "Proteínas congeladas", status: "ok", qty: 0, unit: "UN", shoppingToday: false, weekendKit: false, tagHealth: null },
      { id: "musculo", name: "Músculo", group: "Proteínas congeladas", status: "ok", qty: 0, unit: "UN", shoppingToday: false, weekendKit: false, tagHealth: null },
      { id: "coxao-mole", name: "Coxão mole", group: "Proteínas congeladas", status: "ok", qty: 0, unit: "UN", shoppingToday: false, weekendKit: false, tagHealth: null },
      { id: "carne-moida", name: "Carne moída", group: "Proteínas congeladas", status: "ok", qty: 0, unit: "UN", shoppingToday: false, weekendKit: false, tagHealth: null },

      { id: "arroz-pronto", name: "Arroz pronto", group: "Comida pronta", status: "ok", qty: 0, unit: "UN", shoppingToday: false, weekendKit: false, tagHealth: null },
      { id: "feijao-pronto", name: "Feijão pronto", group: "Comida pronta", status: "ok", qty: 0, unit: "UN", shoppingToday: false, weekendKit: false, tagHealth: null },
      { id: "legumes-prontos", name: "Legumes prontos", group: "Comida pronta", status: "ok", qty: 0, unit: "UN", shoppingToday: false, weekendKit: false, tagHealth: null },
      { id: "paes-congelados", name: "Pães congelados", group: "Comida pronta", status: "ok", qty: 0, unit: "UN", shoppingToday: false, weekendKit: false, tagHealth: null },

      { id: "batata-airfryer", name: "Batata p/ airfryer", group: "Outros congelados", status: "ok", qty: 0, unit: "UN", shoppingToday: false, weekendKit: false, tagHealth: null },
      { id: "hamburguer-frango", name: "Hambúrguer de frango", group: "Outros congelados", status: "ok", qty: 0, unit: "UN", shoppingToday: false, weekendKit: false, tagHealth: null },
      { id: "hamburguer-carne", name: "Hambúrguer de carne", group: "Outros congelados", status: "ok", qty: 0, unit: "UN", shoppingToday: false, weekendKit: false, tagHealth: null }
    ],

    despensa: [
      { id: "arroz", name: "Arroz", group: "Grãos & bases", status: "ok", qty: 0, unit: "UN", shoppingToday: false, weekendKit: false, tagHealth: null },
      { id: "macarrao", name: "Macarrão", group: "Grãos & bases", status: "ok", qty: 0, unit: "UN", shoppingToday: false, weekendKit: false, tagHealth: null },
      { id: "feijao-vermelho", name: "Feijão vermelho", group: "Grãos & bases", status: "ok", qty: 0, unit: "UN", shoppingToday: false, weekendKit: false, tagHealth: null },
      { id: "milho-pipoca", name: "Milho (pipoca)", group: "Grãos & bases", status: "ok", qty: 0, unit: "UN", shoppingToday: false, weekendKit: false, tagHealth: null },
      { id: "grao-de-bico", name: "Grão-de-bico", group: "Grãos & bases", status: "ok", qty: 0, unit: "UN", shoppingToday: false, weekendKit: false, tagHealth: null },
      { id: "lentilha", name: "Lentilha", group: "Grãos & bases", status: "ok", qty: 0, unit: "UN", shoppingToday: false, weekendKit: false, tagHealth: null },
      { id: "tapioca", name: "Tapioca", group: "Grãos & bases", status: "ok", qty: 0, unit: "UN", shoppingToday: false, weekendKit: false, tagHealth: null },
      { id: "polvilho", name: "Polvilho", group: "Grãos & bases", status: "ok", qty: 0, unit: "UN", shoppingToday: false, weekendKit: false, tagHealth: null },
      { id: "flocao", name: "Flocão", group: "Grãos & bases", status: "ok", qty: 0, unit: "UN", shoppingToday: false, weekendKit: false, tagHealth: null },

      { id: "cafe-grao", name: "Café grão", group: "Café da manhã & lanches", status: "ok", qty: 0, unit: "UN", shoppingToday: false, weekendKit: false, tagHealth: null },
      { id: "cafe-capsula", name: "Café cápsula", group: "Café da manhã & lanches", status: "ok", qty: 0, unit: "UN", shoppingToday: false, weekendKit: false, tagHealth: null },
      { id: "granola", name: "Granola", group: "Café da manhã & lanches", status: "ok", qty: 0, unit: "UN", shoppingToday: false, weekendKit: false, tagHealth: null },

      { id: "farinha-aveia", name: "Farinha de aveia", group: "Farinha & fermentos", status: "ok", qty: 0, unit: "UN", shoppingToday: false, weekendKit: false, tagHealth: null },
      { id: "fermento-pao", name: "Fermento pão", group: "Farinha & fermentos", status: "ok", qty: 0, unit: "UN", shoppingToday: false, weekendKit: false, tagHealth: null },
      { id: "gelatina", name: "Gelatina", group: "Farinha & fermentos", status: "ok", qty: 0, unit: "UN", shoppingToday: false, weekendKit: false, tagHealth: null },

      { id: "biscoito-polvilho", name: "Biscoito de polvilho (Creck)", group: "Biscoitos & torradas", status: "ok", qty: 0, unit: "UN", shoppingToday: false, weekendKit: false, tagHealth: null },
      { id: "cream-cracker", name: "Cream cracker", group: "Biscoitos & torradas", status: "ok", qty: 0, unit: "UN", shoppingToday: false, weekendKit: false, tagHealth: null },
      { id: "torrada", name: "Torrada", group: "Biscoitos & torradas", status: "ok", qty: 0, unit: "UN", shoppingToday: false, weekendKit: false, tagHealth: null },

      { id: "sal", name: "Sal", group: "Temperos & conservas", status: "ok", qty: 0, unit: "UN", shoppingToday: false, weekendKit: false, tagHealth: null },
      { id: "acucar", name: "Açúcar", group: "Temperos & conservas", status: "ok", qty: 0, unit: "UN", shoppingToday: false, weekendKit: false, tagHealth: null },
      { id: "azeite-unico", name: "Azeite tipo único", group: "Temperos & conservas", status: "ok", qty: 0, unit: "UN", shoppingToday: false, weekendKit: false, tagHealth: null },
      { id: "vinagre-alcool", name: "Vinagre álcool", group: "Temperos & conservas", status: "ok", qty: 0, unit: "UN", shoppingToday: false, weekendKit: false, tagHealth: null },
      { id: "louro", name: "Louro", group: "Temperos & conservas", status: "ok", qty: 0, unit: "UN", shoppingToday: false, weekendKit: false, tagHealth: null },
      { id: "mostarda-amarela", name: "Mostarda amarela", group: "Temperos & conservas", status: "ok", qty: 0, unit: "UN", shoppingToday: false, weekendKit: false, tagHealth: null },
      { id: "mostarda-mel", name: "Mostarda e mel", group: "Temperos & conservas", status: "ok", qty: 0, unit: "UN", shoppingToday: false, weekendKit: false, tagHealth: null },
      { id: "palmito", name: "Palmito", group: "Temperos & conservas", status: "ok", qty: 0, unit: "UN", shoppingToday: false, weekendKit: false, tagHealth: null },
      { id: "sardinha", name: "Sardinha", group: "Temperos & conservas", status: "ok", qty: 0, unit: "UN", shoppingToday: false, weekendKit: false, tagHealth: null },
      { id: "atum-natural", name: "Atum ralado natural", group: "Temperos & conservas", status: "ok", qty: 0, unit: "UN", shoppingToday: false, weekendKit: false, tagHealth: null },
      { id: "milho-enlatado", name: "Milho (enlatado)", group: "Temperos & conservas", status: "ok", qty: 0, unit: "UN", shoppingToday: false, weekendKit: false, tagHealth: null },

      { id: "quadradinho-70", name: "Quadradinho 70%", group: "Snacks & doces", status: "ok", qty: 0, unit: "UN", shoppingToday: false, weekendKit: false, tagHealth: null },
      { id: "pacoca-nuts", name: "Paçoca nuts integral", group: "Snacks & doces", status: "ok", qty: 0, unit: "UN", shoppingToday: false, weekendKit: false, tagHealth: null },

      { id: "spa-vovo", name: "Spa vovó", group: "Outros secos", status: "ok", qty: 0, unit: "UN", shoppingToday: false, weekendKit: false, tagHealth: null },
      { id: "mac", name: "Mac", group: "Outros secos", status: "ok", qty: 0, unit: "UN", shoppingToday: false, weekendKit: false, tagHealth: null }
    ],

    cozinha: [
      { id: "detergente", name: "Detergente", group: "Louça & pia", status: "ok", qty: 0, unit: "UN", shoppingToday: false, weekendKit: false, tagHealth: null },
      { id: "ype-louca", name: "Ypê louça", group: "Louça & pia", status: "ok", qty: 0, unit: "UN", shoppingToday: false, weekendKit: false, tagHealth: null },

      { id: "esponja", name: "Esponja", group: "Panos & apoio", status: "ok", qty: 0, unit: "UN", shoppingToday: false, weekendKit: false, tagHealth: null },
      { id: "perfex", name: "Perfex", group: "Panos & apoio", status: "ok", qty: 0, unit: "UN", shoppingToday: false, weekendKit: false, tagHealth: null },

      { id: "papel-toalha", name: "Papel toalha", group: "Descartáveis", status: "ok", qty: 0, unit: "UN", shoppingToday: false, weekendKit: false, tagHealth: null },
      { id: "guardanapo", name: "Guardanapo", group: "Descartáveis", status: "ok", qty: 0, unit: "UN", shoppingToday: false, weekendKit: false, tagHealth: null },
      { id: "plastico-filme", name: "Plástico filme", group: "Descartáveis", status: "ok", qty: 0, unit: "UN", shoppingToday: false, weekendKit: false, tagHealth: null },
      { id: "papel-aluminio", name: "Papel alumínio", group: "Descartáveis", status: "ok", qty: 0, unit: "UN", shoppingToday: false, weekendKit: false, tagHealth: null },
      { id: "saco-congelar", name: "Saco pra congelar", group: "Descartáveis", status: "ok", qty: 0, unit: "UN", shoppingToday: false, weekendKit: false, tagHealth: null },
      { id: "palito-dente", name: "Palito dente", group: "Descartáveis", status: "ok", qty: 0, unit: "UN", shoppingToday: false, weekendKit: false, tagHealth: null },
      { id: "vela", name: "Vela", group: "Descartáveis", status: "ok", qty: 0, unit: "UN", shoppingToday: false, weekendKit: false, tagHealth: null },
      { id: "fosforo", name: "Fósforo", group: "Descartáveis", status: "ok", qty: 0, unit: "UN", shoppingToday: false, weekendKit: false, tagHealth: null }
    ],

    banheiro: [
      { id: "papel-higienico", name: "Papel higiênico", group: "Higiene & papel", status: "ok", qty: 0, unit: "UN", shoppingToday: false, weekendKit: false, tagHealth: null },
      { id: "saco-lixo-banheiro", name: "Saco de lixo banheiro", group: "Higiene & papel", status: "ok", qty: 0, unit: "UN", shoppingToday: false, weekendKit: false, tagHealth: null },
      { id: "sabonete-maos", name: "Sabonete para mãos", group: "Higiene & papel", status: "ok", qty: 0, unit: "UN", shoppingToday: false, weekendKit: false, tagHealth: null }
    ],

    area: [
      { id: "ariel-liquido", name: "Ariel líquido", group: "Lavanderia", status: "ok", qty: 0, unit: "UN", shoppingToday: false, weekendKit: false, tagHealth: null },
      { id: "amaciante", name: "Amaciante", group: "Lavanderia", status: "ok", qty: 0, unit: "UN", shoppingToday: false, weekendKit: false, tagHealth: null },
      { id: "vanish-liq", name: "Vanish liq", group: "Lavanderia", status: "ok", qty: 0, unit: "UN", shoppingToday: false, weekendKit: false, tagHealth: null },
      { id: "surf-coco-po", name: "Surf coco pó", group: "Lavanderia", status: "ok", qty: 0, unit: "UN", shoppingToday: false, weekendKit: false, tagHealth: null },
      { id: "sabao-barra", name: "Sabão barra", group: "Lavanderia", status: "ok", qty: 0, unit: "UN", shoppingToday: false, weekendKit: false, tagHealth: null },

      { id: "agua-sanitaria", name: "Água sanitária", group: "Limpeza pesada", status: "ok", qty: 0, unit: "UN", shoppingToday: false, weekendKit: false, tagHealth: null },
      { id: "desinfetante", name: "Desinfetante", group: "Limpeza pesada", status: "ok", qty: 0, unit: "UN", shoppingToday: false, weekendKit: false, tagHealth: null },
      { id: "cif", name: "Cif", group: "Limpeza pesada", status: "ok", qty: 0, unit: "UN", shoppingToday: false, weekendKit: false, tagHealth: null },
      { id: "uau-mult", name: "Uau mult", group: "Limpeza pesada", status: "ok", qty: 0, unit: "UN", shoppingToday: false, weekendKit: false, tagHealth: null },
      { id: "desembala-piso", name: "Desembala piso", group: "Limpeza pesada", status: "ok", qty: 0, unit: "UN", shoppingToday: false, weekendKit: false, tagHealth: null },
      { id: "desembala-vidro", name: "Desembala vidro", group: "Limpeza pesada", status: "ok", qty: 0, unit: "UN", shoppingToday: false, weekendKit: false, tagHealth: null },
      { id: "desembala-desengo", name: "Desembala desengo", group: "Limpeza pesada", status: "ok", qty: 0, unit: "UN", shoppingToday: false, weekendKit: false, tagHealth: null },
      { id: "desembala-multiuso", name: "Desembala multiuso", group: "Limpeza pesada", status: "ok", qty: 0, unit: "UN", shoppingToday: false, weekendKit: false, tagHealth: null },

      { id: "saco-lixo-50l", name: "Saco de lixo 50 L", group: "Sacos de lixo", status: "ok", qty: 0, unit: "UN", shoppingToday: false, weekendKit: false, tagHealth: null },
      { id: "saco-sacole", name: "Saco sacole", group: "Sacos de lixo", status: "ok", qty: 0, unit: "UN", shoppingToday: false, weekendKit: false, tagHealth: null }
    ],

    farmacia: [
      { id: "puran", name: "Puran", group: "Medicamentos", status: "ok", qty: 0, unit: "UN", shoppingToday: false, weekendKit: false, tagHealth: null },
      { id: "bup", name: "Bup", group: "Medicamentos", status: "ok", qty: 0, unit: "UN", shoppingToday: false, weekendKit: false, tagHealth: null },
      { id: "sertralina", name: "Sertralina", group: "Medicamentos", status: "ok", qty: 0, unit: "UN", shoppingToday: false, weekendKit: false, tagHealth: null },

      { id: "shampoo", name: "Shampoo", group: "Higiene", status: "ok", qty: 0, unit: "UN", shoppingToday: false, weekendKit: false, tagHealth: null },
      { id: "condicionador", name: "Condicionador", group: "Higiene", status: "ok", qty: 0, unit: "UN", shoppingToday: false, weekendKit: false, tagHealth: null }
    ]
  };

  // === LOCALSTORAGE ===
  function loadState() {
    try {
      const raw = localStorage.getItem("fibroInventoryState");
      if (!raw) return;
      const saved = JSON.parse(raw);
      if (saved && typeof saved === "object") {
        inventoryData = saved;
      }
    } catch (e) {
      console.error("Erro ao carregar estado:", e);
    }
  }

  function saveState() {
    try {
      localStorage.setItem("fibroInventoryState", JSON.stringify(inventoryData));
    } catch (e) {
      console.error("Erro ao salvar estado:", e);
    }
  }

  // === TABS ===
  function setActiveTab(tabId) {
    tabButtons.forEach(btn => {
      const thisTab = btn.getAttribute("data-tab");
      btn.classList.toggle("active", thisTab === tabId);
    });
    Object.keys(tabPanels).forEach(key => {
      const panel = tabPanels[key];
      if (!panel) return;
      panel.classList.toggle("active", key === tabId);
    });
  }

  tabButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const tabId = btn.getAttribute("data-tab");
      if (!tabId) return;
      setActiveTab(tabId);
    });
  });

  // === AMBIENTE ===
  function setActiveEnvChip() {
    envChips.forEach(chip => {
      const env = chip.getAttribute("data-env");
      chip.classList.toggle("active", env === currentEnv);
    });
  }

  envChips.forEach(chip => {
    chip.addEventListener("click", () => {
      const env = chip.getAttribute("data-env");
      if (!env) return;
      currentEnv = env;
      setActiveEnvChip();
      renderInventory();
    });
  });

  // Helper quantidade
  function formatQty(item) {
    const q = (typeof item.qty === "number" && !isNaN(item.qty)) ? item.qty : 0;
    const unit = item.unit || "UN";
    return `Qtd: ${q} ${unit}`;
  }

  // === RENDER INVENTÁRIO ===
  function renderInventory() {
    const items = inventoryData[currentEnv] || [];
    let total = items.length;
    let ok = 0, low = 0, out = 0;

    items.forEach(it => {
      if (it.status === "low") low++;
      else if (it.status === "out") out++;
      else ok++;
    });

    if (summaryBar) {
      summaryBar.innerHTML = `
        Itens: ${total} • 🟢 OK: ${ok} • 🟡 Acabando: ${low} • 🔴 Acabou: ${out}
        <br>
        <span class="summary-food-legend">
          ✅ Anti-inflamatório • ⚠️ Usar com moderação • 🚫 Melhor evitar • 🌙 Kit fim de semana
        </span>
      `;
    }

    if (!inventoryList) return;

    let html = "";
    const sorted = [...items].sort((a, b) => {
      const ga = a.group || "";
      const gb = b.group || "";
      if (ga !== gb) return ga.localeCompare(gb);
      return a.name.localeCompare(b.name);
    });

    const showFoodMeta = ["hortifruti","laticinios","despensa","freezer"].includes(currentEnv);

    let currentGroup = "";
    sorted.forEach(item => {
      if (item.group && item.group !== currentGroup) {
        currentGroup = item.group;
        html += `<div class="group-title">${currentGroup}</div>`;
      }
      const status = item.status || "ok";
      const tagHealth = item.tagHealth || null;
      const weekendActive = item.weekendKit === true;

      let foodTagsHtml = "";
      if (showFoodMeta) {
        if (!tagHealth) {
          foodTagsHtml = `
            <span class="food-tag good" data-tag="good">✅</span>
            <span class="food-tag moderate" data-tag="moderate">⚠️</span>
            <span class="food-tag avoid" data-tag="avoid">🚫</span>
          `;
        } else if (tagHealth === "good") {
          foodTagsHtml = `<span class="food-tag good active" data-tag="good">✅</span>`;
        } else if (tagHealth === "moderate") {
          foodTagsHtml = `<span class="food-tag moderate active" data-tag="moderate">⚠️</span>`;
        } else if (tagHealth === "avoid") {
          foodTagsHtml = `<span class="food-tag avoid active" data-tag="avoid">🚫</span>`;
        }
      }

      html += `
        <div class="item-card" data-env="${currentEnv}" data-id="${item.id}">
          <div class="item-header">
            <div class="item-name-wrapper">
              <div class="item-name">${item.name}</div>
              <div class="item-actions">
                <button class="icon-btn btn-edit" title="Editar">✎</button>
                <button class="icon-btn btn-delete" title="Excluir">🗑</button>
              </div>
            </div>
            <div class="qty-row">
              <button class="qty-btn" data-action="dec">-</button>
              <span class="qty-label">${formatQty(item)}</span>
              <button class="qty-btn" data-action="inc">+</button>
            </div>
          </div>
          <div class="status-row">
            <span class="status-pill ok ${status === "ok" ? "active" : ""}" data-status="ok">🟢</span>
            <span class="status-pill low ${status === "low" ? "active" : ""}" data-status="low">🟡</span>
            <span class="status-pill out ${status === "out" ? "active" : ""}" data-status="out">🔴</span>

            ${showFoodMeta ? `
              <span class="status-sep">•</span>
              ${foodTagsHtml}
              <span class="status-sep">•</span>
              <span class="weekend-pill ${weekendActive ? "active" : ""}" data-weekend="toggle">🌙</span>
            ` : ``}
          </div>
        </div>
      `;
    });

    inventoryList.innerHTML = html;
  }

  // Clique em status (OK / Acabando / Acabou)
  if (inventoryList) {
    inventoryList.addEventListener("click", (e) => {
      const pill = e.target.closest(".status-pill");
      if (!pill) return;
      const card = pill.closest(".item-card");
      if (!card) return;

      const env = card.getAttribute("data-env");
      const id = card.getAttribute("data-id");
      const newStatus = pill.getAttribute("data-status");

      if (!env || !id || !newStatus) return;

      const items = inventoryData[env];
      if (!items) return;

      const item = items.find(it => it.id === id);
      if (!item) return;

      item.status = newStatus;
      saveState();
      renderInventory();
      renderShoppingList();
    });
  }

  // Clique em + / - quantidade
  if (inventoryList) {
    inventoryList.addEventListener("click", (e) => {
      const btn = e.target.closest(".qty-btn");
      if (!btn) return;
      const card = btn.closest(".item-card");
      if (!card) return;

      const env = card.getAttribute("data-env");
      const id = card.getAttribute("data-id");
      const action = btn.getAttribute("data-action");
      if (!env || !id || !action) return;

      const items = inventoryData[env];
      if (!items) return;
      const item = items.find(it => it.id === id);
      if (!item) return;

      let currentQty = (typeof item.qty === "number" && !isNaN(item.qty)) ? item.qty : 0;
      if (action === "inc") {
        currentQty += 1;
      } else if (action === "dec") {
        currentQty = Math.max(0, currentQty - 1);
      }
      item.qty = currentQty;
      if (!item.unit) item.unit = "UN";

      saveState();
      renderInventory();
      renderShoppingList();
    });
  }

  // Clique em EDITAR (✎)
  if (inventoryList) {
    inventoryList.addEventListener("click", (e) => {
      const btn = e.target.closest(".btn-edit");
      if (!btn) return;
      const card = btn.closest(".item-card");
      if (!card) return;

      const env = card.getAttribute("data-env");
      const id = card.getAttribute("data-id");
      if (!env || !id) return;

      const items = inventoryData[env];
      if (!items) return;
      const item = items.find(it => it.id === id);
      if (!item) return;

      editingEnv = env;
      editingId = id;

      if (addItemTitle) addItemTitle.textContent = "Editar item";
      addItemName.value = item.name || "";
      addItemGroup.value = item.group || "";
      addItemQty.value = (typeof item.qty === "number" && !isNaN(item.qty)) ? item.qty : 0;
      addItemUnit.value = item.unit || "UN";

      addModal.classList.add("active");
      addItemName.focus();
    });
  }

  // Clique em EXCLUIR (🗑)
  if (inventoryList) {
    inventoryList.addEventListener("click", (e) => {
      const btn = e.target.closest(".btn-delete");
      if (!btn) return;
      const card = btn.closest(".item-card");
      if (!card) return;

      const env = card.getAttribute("data-env");
      const id = card.getAttribute("data-id");
      if (!env || !id) return;

      const items = inventoryData[env];
      if (!items) return;

      if (!confirm("Excluir este item do inventário?")) return;

      inventoryData[env] = items.filter(it => it.id !== id);
      saveState();
      renderInventory();
      renderShoppingList();
    });
  }

  // Clique em selo alimentar (✅ / ⚠️ / 🚫)
  if (inventoryList) {
    inventoryList.addEventListener("click", (e) => {
      const tagEl = e.target.closest(".food-tag");
      if (!tagEl) return;

      const card = tagEl.closest(".item-card");
      if (!card) return;

      const env = card.getAttribute("data-env");
      const id = card.getAttribute("data-id");
      if (!env || !id) return;

      const items = inventoryData[env];
      if (!items) return;
      const item = items.find(it => it.id === id);
      if (!item) return;

      const selected = tagEl.getAttribute("data-tag");
      if (!selected) return;

      if (item.tagHealth === selected) {
        item.tagHealth = null;
      } else {
        item.tagHealth = selected;
      }

      saveState();
      renderInventory();
    });
  }

  // Clique em Kit fim de semana
  if (inventoryList) {
    inventoryList.addEventListener("click", (e) => {
      const pill = e.target.closest(".weekend-pill");
      if (!pill) return;

      const card = pill.closest(".item-card");
      if (!card) return;

      const env = card.getAttribute("data-env");
      const id = card.getAttribute("data-id");
      if (!env || !id) return;

      const items = inventoryData[env];
      if (!items) return;
      const item = items.find(it => it.id === id);
      if (!item) return;

      item.weekendKit = !item.weekendKit;
      saveState();
      renderInventory();
      renderShoppingList();
    });
  }

  // === SHOPPING MODE ===
  function setShoppingMode(mode) {
    shoppingMode = mode;
    shoppingModeChips.forEach(chip => {
      chip.classList.toggle("active", chip.getAttribute("data-shop") === mode);
    });
    renderShoppingList();
  }

  shoppingModeChips.forEach(chip => {
    chip.addEventListener("click", () => {
      const mode = chip.getAttribute("data-shop");
      if (!mode) return;
      setShoppingMode(mode);
    });
  });

  // === RENDER LISTA DE COMPRAS ===
  function renderShoppingList() {
    if (!shoppingList) return;

    let html = "";
    const envOrder = ["hortifruti","laticinios","freezer","despensa","cozinha","banheiro","area","farmacia"];

    envOrder.forEach(env => {
      const itemsAll = inventoryData[env] || [];
      const filtered = itemsAll.filter(it => {
        const needsBuy = (it.status === "low" || it.status === "out");
        const isToday = it.shoppingToday === true;

        if (shoppingMode === "geral") {
          return needsBuy && !isToday;
        } else if (shoppingMode === "dia") {
          return needsBuy && isToday;
        } else if (shoppingMode === "kit") {
          return it.weekendKit === true;
        }
        return false;
      });

      if (!filtered.length) return;

      html += `<div class="group-title">${envLabels[env] || env}</div>`;

      filtered.forEach(item => {
        const checkboxId = `shop-${env}-${item.id}`;
        let statusText;
        if (item.status === "out") {
          statusText = "🔴 Acabou";
        } else if (item.status === "low") {
          statusText = "🟡 Acabando";
        } else {
          statusText = "🟢 OK";
        }

        const q = (typeof item.qty === "number" && !isNaN(item.qty)) ? item.qty : 0;
        const unit = item.unit || "UN";
        const qtyText = ` • Qtd atual: ${q} ${unit}`;

        let transferBtn = "";
        if (shoppingMode === "geral") {
          transferBtn = `<button class="icon-btn btn-to-today" title="Mover para Compra do dia">🛒</button>`;
        } else if (shoppingMode === "dia") {
          transferBtn = `<button class="icon-btn btn-back-general" title="Voltar para lista geral">↩️</button>`;
        } else if (shoppingMode === "kit") {
          transferBtn = `<button class="icon-btn btn-to-today" title="Mover para Compra do dia">🛒</button>`;
        }

        html += `
          <div class="shopping-item">
            <input type="checkbox" id="${checkboxId}" data-env="${env}" data-id="${item.id}" />
            <label for="${checkboxId}">
              <span>${item.name}</span>
              <span class="hint">Status: ${statusText}${qtyText}</span>
            </label>
            ${transferBtn}
          </div>
        `;
      });
    });

    if (!html) {
      if (shoppingMode === "geral") {
        html = `<p style="font-size:0.85rem; color:#666;">Nenhum item marcado como acabando ou acabado. 🎉</p>`;
      } else if (shoppingMode === "dia") {
        html = `<p style="font-size:0.85rem; color:#666;">Nenhum item na sua Compra do dia. Use o botão 🛒 na lista geral para montar a compra de hoje.</p>`;
      } else {
        html = `<p style="font-size:0.85rem; color:#666;">Nenhum item no Kit Fim de Semana ainda. Toque em “🌙 Kit fim de semana” nos itens do inventário para montar seu kit.</p>`;
      }
    }

    shoppingList.innerHTML = html;
  }

  // Checkbox da lista de compras (item comprado)
  if (shoppingList) {
    shoppingList.addEventListener("change", (e) => {
      const checkbox = e.target.closest("input[type='checkbox']");
      if (!checkbox || !checkbox.checked) return;

      const env = checkbox.getAttribute("data-env");
      const id = checkbox.getAttribute("data-id");
      if (!env || !id) return;

      const items = inventoryData[env];
      if (!items) return;

      const item = items.find(it => it.id === id);
      if (!item) return;

      item.status = "ok";
      item.shoppingToday = false;
      saveState();
      renderInventory();
      renderShoppingList();
    });
  }

  // Botões 🛒 (geral/kit -> dia) e ↩️ (dia -> geral)
  if (shoppingList) {
    shoppingList.addEventListener("click", (e) => {
      const toTodayBtn = e.target.closest(".btn-to-today");
      const backBtn = e.target.closest(".btn-back-general");
      if (!toTodayBtn && !backBtn) return;

      const itemRow = e.target.closest(".shopping-item");
      if (!itemRow) return;
      const checkbox = itemRow.querySelector("input[type='checkbox']");
      if (!checkbox) return;

      const env = checkbox.getAttribute("data-env");
      const id = checkbox.getAttribute("data-id");
      if (!env || !id) return;

      const items = inventoryData[env];
      if (!items) return;
      const item = items.find(it => it.id === id);
      if (!item) return;

      if (toTodayBtn) {
        item.shoppingToday = true;
      } else if (backBtn) {
        item.shoppingToday = false;
      }

      saveState();
      renderShoppingList();
    });
  }

  // === MODAL ADICIONAR / EDITAR ITEM ===
  function openAddModal() {
    editingEnv = null;
    editingId = null;
    if (!addModal) return;
    if (addItemTitle) addItemTitle.textContent = "Novo item";
    addItemName.value = "";
    addItemGroup.value = "";
    addItemQty.value = 0;
    addItemUnit.value = "UN";
    addModal.classList.add("active");
    addItemName.focus();
  }

  function closeAddModal() {
    if (!addModal) return;
    addModal.classList.remove("active");
  }

  if (btnAdd) {
    btnAdd.addEventListener("click", openAddModal);
  }

  if (addItemCancel) {
    addItemCancel.addEventListener("click", closeAddModal);
  }

  if (addModal) {
    addModal.addEventListener("click", (e) => {
      if (e.target === addModal) {
        closeAddModal();
      }
    });
  }

  if (addItemSave) {
    addItemSave.addEventListener("click", () => {
      const name = (addItemName.value || "").trim();
      const group = (addItemGroup.value || "").trim();
      let qty = parseInt(addItemQty.value, 10);
      if (!name) {
        alert("Informe o nome do item 🙂");
        return;
      }
      if (isNaN(qty) || qty < 0) qty = 0;
      const unit = addItemUnit.value || "UN";

      if (editingEnv !== null && editingId !== null) {
        const items = inventoryData[editingEnv];
        if (items) {
          const item = items.find(it => it.id === editingId);
          if (item) {
            item.name = name;
            item.group = group || "";
            item.qty = qty;
            item.unit = unit;
          }
        }
      } else {
        if (!inventoryData[currentEnv]) {
          inventoryData[currentEnv] = [];
        }

        const baseId = name
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/[^a-z0-9]+/g, "-");
        const id = `custom-${baseId}-${Date.now()}`;

        inventoryData[currentEnv].push({
          id,
          name,
          group: group || "",
          status: "ok",
          qty,
          unit,
          shoppingToday: false,
          weekendKit: false,
          tagHealth: null
        });
      }

      saveState();
      closeAddModal();
      renderInventory();
      renderShoppingList();
    });
  }

  // === INICIALIZAÇÃO ===
  loadState();
  setActiveTab("inventario");
  setActiveEnvChip();
  renderInventory();
  setShoppingMode("geral");
});

// ===================== REGISTRO DO SERVICE WORKER =====================
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("sw.js")
      .catch((err) => {
        console.warn("Falha ao registrar service worker:", err);
      });
  });
}
