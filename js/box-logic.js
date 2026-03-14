// Eliminado bloque placeholder duplicado para evitar que el modal aparezca antes de que termine la animación.
// Configuración
const CARD_WIDTH = 180; // Ancho de cada tarjeta + margen (ajustar según CSS)
const CARD_GAP = 16;    // Gap entre tarjetas
const TOTAL_ITEM_WIDTH = CARD_WIDTH + CARD_GAP;
const VISIBLE_ITEMS = 50; // Cuántos items falsos generamos antes del ganador
const WINNER_INDEX = 40;  // En qué posición caerá el ganador (para dar tiempo a girar)
const SPIN_DURATION = 6;  // Segundos que dura el giro
const BOX_PRODUCTS = Array.isArray(window.products)
    ? window.products
    : (typeof productsBase !== 'undefined' && Array.isArray(productsBase) ? productsBase : []);

// Estado
let isSpinning = false;

// Obtener parámetros de URL (para saber qué caja abrir)
const urlParams = new URLSearchParams(window.location.search);
const boxType = urlParams.get('type') || 'niche'; // default

// Configuración de Cajas (Simulada basándonos en products.js)
// En un app real, esto vendría del backend
const boxConfigs = {
  starter: {
    title: 'Starter Pack',
        price: 149,
    filter: p => p.category === 'Diseñador',
    color: 'blue',
    // Ajusta aquí
    weightsByRarity: { comun:30, raro: 14, legendario: 5 }
  },
  niche: {
    title: 'Niche Elite',
    price: 249,
    filter: p => p.category === 'Nicho',
    color: 'gold',
    // Ajusta aquí
    weightsByRarity: { comun: 30, raro: 12, legendario: 5 }
  },
  arabic: {
    title: 'Colección Árabe',
    price: 99.90,
    filter: p => p.category === 'Arabe',
    color: 'purple',
    // Ajusta aquí
    weightsByRarity: { comun: 30, raro: 15, legendario: 5 }
  }
};

// Rareza y muestreo ponderado
function getRarity(item) {
    // Usa etiqueta explícita si existe; si no, heurística por precio
    if (item.rarity) return item.rarity;
    if (item.price10 > 100) return 'legendario';
    if (item.price10 > 50) return 'raro';
    return 'comun';
}

function pickWeighted(items, weightFn) {
    const weights = items.map(weightFn);
    const total = weights.reduce((a, b) => a + b, 0);
    let r = Math.random() * total;
    for (let i = 0; i < items.length; i++) {
        r -= weights[i];
        if (r <= 0) return items[i];
    }
    return items[items.length - 1];
}

// Inicialización
function initMysteryBoxPage() {
    setupBox();
    document.getElementById('spin-btn').addEventListener('click', startSpin);
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMysteryBoxPage);
} else {
    initMysteryBoxPage();
}

function setupBox() {
    const config = boxConfigs[boxType] || boxConfigs['niche'];
    
    // UI Update
    document.getElementById('box-title').innerText = config.title;
    document.getElementById('box-price').innerText = `S/. ${config.price}.00`;
    
    // Cargar posibles premios (Grid inferior)
    const pool = BOX_PRODUCTS.filter(config.filter);
    // Si no hay suficientes productos, usamos todos como fallback
    const displayPool = pool.length > 0 ? pool : BOX_PRODUCTS;

    const grid = document.getElementById('possible-items');
    grid.innerHTML = displayPool.map(p => `
        <div class="bg-gray-900 border border-gray-800 p-3 rounded flex flex-col items-center opacity-70 hover:opacity-100 transition-opacity">
            <img src="${p.imgUrl}" class="w-16 h-16 object-cover mb-2 rounded">
            <p class="text-xs text-center text-gray-300 font-bold truncate w-full">${p.name}</p>
            <p class="text-[10px] text-${config.color}-400 uppercase">${p.house}</p>
        </div>
    `).join('');

    // Renderizar estado inicial de la ruleta (estática)
    renderStaticStrip(displayPool);
}

function renderStaticStrip(pool) {
    const strip = document.getElementById('roulette-strip');
    // Mostramos unos pocos items estáticos
    let html = '';
    for(let i=0; i<10; i++) {
        const item = pool[Math.floor(Math.random() * pool.length)];
        html += createCardHtml(item);
    }
    strip.innerHTML = html;
}

function createCardHtml(item) {
    const rarity = getRarity(item);
    let borderColor = 'border-gray-700';
    let rarityLabel = 'Común';
    if (rarity === 'legendario') { borderColor = 'border-gior-gold'; rarityLabel = 'Legendario'; }
    else if (rarity === 'raro') { borderColor = 'border-purple-500'; rarityLabel = 'Raro'; }

    return `
        <div class="item-card relative bg-gior-card border-b-4 ${borderColor} h-48 mx-2 flex flex-col items-center justify-center p-2 group shadow-xl">
            <div class="absolute top-2 right-2 text-[10px] font-bold text-gray-500 uppercase">${rarityLabel}</div>
            <img src="${item.imgUrl}" class="w-24 h-24 object-cover rounded mb-3 shadow-lg group-hover:scale-110 transition-transform">
            <div class="text-center w-full">
                <div class="text-[10px] text-gray-400 uppercase tracking-wider truncate">${item.house}</div>
                <div class="text-xs font-bold text-white truncate px-1">${item.name}</div>
            </div>
            <div class="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </div>
    `;
}

function startSpin() {
    if (isSpinning) return;
    isSpinning = true;
    
    const btn = document.getElementById('spin-btn');
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Abriendo...';
    
    // Sonido
    const soundSpin = document.getElementById('sound-spin');
    if(soundSpin) { soundSpin.volume = 0.3; soundSpin.currentTime = 0; soundSpin.play().catch(e=>{}); }

    const config = boxConfigs[boxType] || boxConfigs['niche'];
    const pool = BOX_PRODUCTS.filter(config.filter).length > 0 ? BOX_PRODUCTS.filter(config.filter) : BOX_PRODUCTS;

    // 1. Determinar Ganador (RNG ponderado por rareza)
    const defaultWeights = { comun: 10, raro: 3, legendario: 1 };
    const weights = (config.weightsByRarity) || defaultWeights;
    const winner = pickWeighted(pool, item => weights[getRarity(item)] ?? 1);
    
    // 2. Construir Tira de Animación
    const strip = document.getElementById('roulette-strip');
    let stripHtml = '';
    
    // Generar items previos (relleno)
    for(let i=0; i < WINNER_INDEX; i++) {
        const randomItem = pool[Math.floor(Math.random() * pool.length)];
        stripHtml += createCardHtml(randomItem);
    }
    
    // Insertar Ganador
    stripHtml += createCardHtml(winner);
    
    // Generar items posteriores (relleno final)
    for(let i=0; i < 5; i++) {
        const randomItem = pool[Math.floor(Math.random() * pool.length)];
        stripHtml += createCardHtml(randomItem);
    }
    
    strip.innerHTML = stripHtml;

    // 3. Calcular desplazamiento
    // Queremos que el item WINNER_INDEX quede centrado.
    // El contenedor tiene width 100%. El centro es 50%.
    // El strip empieza en left: 50% (gracias al CSS).
    // Entonces para centrar el item N, debemos movernos hacia la izquierda:
    // N * (ancho + gap) + (ancho/2).
    // Añadimos un pequeño offset aleatorio dentro de la tarjeta para realismo (que no caiga siempre pixel perfect en el centro)
    const randomOffset = Math.floor(Math.random() * (CARD_WIDTH - 20)) - (CARD_WIDTH / 2 - 10);
    const scrollPosition = (WINNER_INDEX * TOTAL_ITEM_WIDTH) + (CARD_WIDTH / 2) + randomOffset;
    
    // 4. Resetear y Forzar Reflow
    strip.style.transition = 'none';
    strip.style.transform = 'translateX(0)';
    strip.offsetHeight; // Trigger reflow

    // 5. Iniciar Animación
    // Cubic-bezier para simular la fricción física (rápido al inicio, muy lento al final)
    strip.style.transition = `transform ${SPIN_DURATION}s cubic-bezier(0.15, 0, 0.10, 1)`; 
    strip.style.transform = `translateX(-${scrollPosition}px)`;

    // 6. Finalizar
    setTimeout(() => {
        showWinner(winner);
        isSpinning = false;
        btn.disabled = false;
        btn.innerHTML = 'Abrir Otra Vez';
    }, SPIN_DURATION * 1000);
}

function showWinner(item) {
    // Parar sonido loop
    const soundSpin = document.getElementById('sound-spin');
    if(soundSpin) { soundSpin.pause(); }
    
    // Sonido Win
    const soundWin = document.getElementById('sound-win');
    if(soundWin) { soundWin.volume = 0.5; soundWin.play().catch(e=>{}); }

    // Rellenar Modal
    document.getElementById('winner-img').src = item.imgUrl;
    document.getElementById('winner-name').innerText = item.name;
    
    const rarity = getRarity(item);
    let rarityText = "COMÚN";
    let colorClass = "text-gray-400";
    if(rarity === 'legendario') { rarityText = "¡LEGENDARIO!"; colorClass = "text-gior-gold"; }
    else if(rarity === 'raro') { rarityText = "RARO"; colorClass = "text-purple-400"; }
    
    const rarityEl = document.getElementById('winner-rarity');
    rarityEl.innerText = rarityText;
    rarityEl.className = `text-sm font-bold uppercase tracking-widest mb-6 ${colorClass}`;

    // Mostrar Modal con animación
    const modal = document.getElementById('winner-modal');
    const backdrop = document.getElementById('modal-backdrop');
    const content = document.getElementById('modal-content');
    
    modal.classList.remove('hidden');
    // Pequeño delay para permitir que el display:block renderice antes de la opacidad
    setTimeout(() => {
        backdrop.classList.remove('opacity-0');
        content.classList.remove('scale-50', 'opacity-0');
        content.classList.add('scale-100', 'opacity-100');
    }, 10);
}