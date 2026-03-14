// --- STATE ---
const MOBILE_BREAKPOINT = 1070;
const WHATSAPP_PHONE = (window.APP_CONFIG && window.APP_CONFIG.whatsappNumber) || '51978292305';
const CATALOG_PRODUCTS = Array.isArray(window.products)
    ? window.products
    : (typeof productsBase !== 'undefined' && Array.isArray(productsBase) ? productsBase : []);

function roundUpToNearest10(value) {
    return Math.ceil(value / 10) * 10;
}

function getCatalogMaxPrice() {
    const prices = CATALOG_PRODUCTS
        .flatMap(product => getPriceOptions(product).map(option => option.price))
        .filter(price => Number.isFinite(price) && price > 0);

    if (prices.length === 0) return 500;
    return roundUpToNearest10(Math.max(...prices));
}

const CATALOG_MAX_PRICE = getCatalogMaxPrice();

function getItemsPerPage() {
    return window.innerWidth < MOBILE_BREAKPOINT ? 8 : 6;
}

let state = {
    products: [...CATALOG_PRODUCTS],
    cart: [],
    filters: {
        search: "",
        type: [],
        category: [],
        concentration: null,
        maxPrice: CATALOG_MAX_PRICE
    },
    sort: "relevance",
    currentPage: 1,
    itemsPerPage: getItemsPerPage()
};

// --- UTILS ---
function getPriceOptions(product) {
    const numericOptions = Object.entries(product)
        .filter(([key, value]) => /^price(\d+)$/.test(key) && typeof value === 'number')
        .map(([key, value]) => {
            const size = parseInt(key.match(/^price(\d+)$/)[1], 10);
            return {
                key,
                size,
                label: `${size}ml`,
                price: value,
                type: 'decant'
            };
        })
        .sort((a, b) => a.size - b.size);

    const fullBottleOption = typeof product.pricefull === 'number'
        ? [{
            key: 'pricefull',
            size: 'full',
            label: 'Botella Completa',
            price: product.pricefull,
            type: 'bottle'
        }]
        : [];

    return [...numericOptions, ...fullBottleOption];
}

function formatPrice(amount) {
    return `S/. ${amount.toFixed(2)}`;
}

// --- RENDER FUNCTIONS ---
function renderFilters() {
    // Tipos (Types)
    const types = [...new Set(CATALOG_PRODUCTS.map(p => p.type))];
    const typeContainer = document.getElementById('filters-type');
    if(typeContainer) {
        typeContainer.innerHTML = types.map(t => `
            <label class="flex items-center space-x-2 cursor-pointer group hover:bg-white/5 p-1 rounded transition-colors">
                <input type="checkbox" class="form-checkbox text-gior-gold rounded bg-black border-gray-700 focus:ring-0 focus:ring-offset-0" value="${t}" onchange="updateFilter('type', this.value, this.checked)">
                <span class="text-gray-400 text-sm group-hover:text-gior-gold transition-colors">${t}</span>
            </label>
        `).join('');
    }

    // Categorías
    const categories = [...new Set(CATALOG_PRODUCTS.map(p => p.category))];
    const catContainer = document.getElementById('filters-category');
    if(catContainer) {
        catContainer.innerHTML = categories.map(c => `
            <label class="flex items-center space-x-2 cursor-pointer group hover:bg-white/5 p-1 rounded transition-colors">
                <input type="checkbox" class="form-checkbox text-gior-gold rounded bg-black border-gray-700 focus:ring-0 focus:ring-offset-0" value="${c}" onchange="updateFilter('category', this.value, this.checked)">
                <span class="text-gray-400 text-sm group-hover:text-gior-gold transition-colors">${c}</span>
            </label>
        `).join('');
    }

    // Concentraciones
    const concentrations = [...new Set(CATALOG_PRODUCTS.map(p => p.concentration))];
    const concContainer = document.getElementById('filters-concentration');
    if(concContainer) {
        concContainer.innerHTML = concentrations.map(c => `
            <button 
                class="px-3 py-1 bg-black border border-gray-700 text-xs text-gray-400 hover:border-gior-gold hover:text-gior-gold transition-all duration-300 rounded-sm filter-conc-btn" 
                onclick="updateFilter('concentration', '${c}', this)"
                data-val="${c}"
            >${c}</button>
        `).join('');
    }
}

function renderProducts() {
    let filtered = CATALOG_PRODUCTS.filter(p => {
        const options = getPriceOptions(p);
        const isComingSoon = Boolean(p.comingSoon);
        // Búsqueda
        const matchesSearch = p.name.toLowerCase().includes(state.filters.search.toLowerCase()) || 
                              p.house.toLowerCase().includes(state.filters.search.toLowerCase());
        // Tipo
        const matchesType = state.filters.type.length === 0 || state.filters.type.includes(p.type);
        // Categoría
        const matchesCategory = state.filters.category.length === 0 || state.filters.category.includes(p.category);
        // Concentración
        const matchesConc = !state.filters.concentration || p.concentration === state.filters.concentration;
        // Precio (verifica si alguna variante está dentro del presupuesto)
        const matchesPrice = isComingSoon ? true : options.some(o => o.price <= state.filters.maxPrice);

        return matchesSearch && matchesType && matchesCategory && matchesConc && matchesPrice;
    });

    // Ordenamiento
    filtered.sort((a, b) => {
        const priceA = getPriceOptions(a)[0]?.price || 0;
        const priceB = getPriceOptions(b)[0]?.price || 0;
        
        switch(state.sort) {
            case 'price-asc': return priceA - priceB;
            case 'price-desc': return priceB - priceA;
            case 'name-asc': return a.name.localeCompare(b.name);
            default: return 0; // relevance (id order)
        }
    });

    const grid = document.getElementById('product-grid');
    const emptyState = document.getElementById('empty-state');
    const countEl = document.getElementById('items-count');

    if (!grid) return;

    if (filtered.length === 0) {
        grid.innerHTML = '';
        if(countEl) countEl.innerText = 0;
        if(emptyState) emptyState.classList.remove('hidden');
        return;
    }

    if(emptyState) emptyState.classList.add('hidden');
    
    // Paginación
    const totalPages = Math.ceil(filtered.length / state.itemsPerPage);
    state.currentPage = Math.max(1, Math.min(state.currentPage, totalPages));
    
    const start = (state.currentPage - 1) * state.itemsPerPage;
    const end = start + state.itemsPerPage;
    const pageItems = filtered.slice(start, end);
    
    // Actualizar contador con total filtrado
    if(countEl) countEl.innerText = filtered.length;
    
    grid.innerHTML = pageItems.map(product => {
        const options = getPriceOptions(product);
        const defaultOpt = options[0] || null;
        const isSoldOut = Boolean(product.soldOut);
        const isComingSoon = Boolean(product.comingSoon);
        const isDisabled = isSoldOut || isComingSoon || !defaultOpt;
        
        // Badges (Etiquetas)
        let badges = '';
        if (isSoldOut) badges += '<span class="bg-red-600 text-white text-[10px] font-bold px-2 py-1 uppercase tracking-wider">Vendido</span>';
        if (isComingSoon) badges += '<span class="bg-amber-500 text-white text-[10px] font-bold px-2 py-1 uppercase tracking-wider ml-1">Próximamente</span>';
        if (product.topSeller) badges += '<span class="bg-gior-gold text-black text-[10px] font-bold px-2 py-1 uppercase tracking-wider">Top Seller</span>';
        if (product.sale) badges += '<span class="bg-red-600 text-white text-[10px] font-bold px-2 py-1 uppercase tracking-wider ml-1">Oferta</span>';
        if (product.rare) badges += '<span class="bg-purple-600 text-white text-[10px] font-bold px-2 py-1 uppercase tracking-wider ml-1">Rare</span>';

        // Botones de tamaño
        const sizeBtns = options.map((opt, idx) => `
            <button 
                class="size-btn w-full py-1 text-[10px] border border-gray-700 hover:border-gior-gold hover:text-gior-gold transition-colors ${idx === 0 ? 'bg-gior-gold text-black border-gior-gold font-bold' : 'text-gray-400'} ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}"
                data-option-key="${opt.key}"
                onclick="selectSize(this, ${product.id}, '${opt.key}')"
                ${isDisabled ? 'disabled' : ''}
            >${opt.label}</button>
        `).join('');
        const sizeGridClass = options.length > 0 ? `grid-cols-${options.length}` : 'grid-cols-1';

        const displayPrice = isComingSoon
            ? 'Próximamente'
            : defaultOpt
                ? formatPrice(defaultOpt.price)
                : 'Sin precio';

        const selectedLabel = defaultOpt
            ? `${defaultOpt.label}${product.concentration ? ` • ${product.concentration}` : ''}`
            : (isComingSoon ? 'Próximamente' : 'Sin variante');

        const displayPriceDataAttr = defaultOpt ? `data-price="${defaultOpt.price}"` : '';

        return `
        <div class="group bg-gior-card border border-gray-800 hover:border-gior-gold/50 transition-all duration-300 flex flex-col h-full relative overflow-hidden product-card ${isDisabled ? 'opacity-75' : ''}" id="card-${product.id}">
            
            <!-- Área de Imagen -->
            <div class="relative h-64 overflow-hidden bg-gray-900">
                <div class="absolute top-2 left-2 z-10 flex flex-col gap-1">${badges}</div>
                <img src="${product.imgUrl}" alt="${product.name}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-90 group-hover:opacity-100">
                
                <!-- Acciones Overlay -->
                <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3 backdrop-blur-[2px]">
                    <button onclick="openProductModal(${product.id})" class="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center hover:bg-gior-gold transition-colors transform translate-y-4 group-hover:translate-y-0 duration-300 delay-75 shadow-lg">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button onclick="addToCart(${product.id})" ${isDisabled ? 'disabled' : ''} class="w-10 h-10 rounded-full bg-gior-gold text-black flex items-center justify-center hover:bg-white transition-colors transform translate-y-4 group-hover:translate-y-0 duration-300 delay-100 shadow-lg ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}">
                        <i class="fas fa-shopping-cart"></i>
                    </button>
                </div>
            </div>

            <!-- Contenido -->
            <div class="p-5 flex-grow flex flex-col">
                <div class="mb-1 text-[10px] text-gior-gold uppercase tracking-widest font-bold">${product.house}</div>
                <h3 class="text-white font-serif font-bold text-lg leading-tight mb-2 group-hover:text-gior-gold transition-colors truncate">${product.name}</h3>
                <p class="text-gray-500 text-xs line-clamp-2 mb-4 h-8">${product.description}</p>
                
                <!-- Precio y Selección -->
                <div class="mt-auto">
                    <div class="flex justify-between items-end mb-3">
                        <div>
                            <span class="text-gray-400 text-xs block mb-0.5">Precio desde:</span>
                            <span class="text-xl font-bold text-white display-price" ${displayPriceDataAttr}>${displayPrice}</span>
                        </div>
                        <div class="text-right">
                            <span class="text-[10px] text-gray-500 bg-gray-800 px-2 py-1 rounded selected-size-label">${selectedLabel}</span>
                        </div>
                    </div>
                    
                    <div class="grid ${sizeGridClass} gap-1">
                        ${sizeBtns || '<span class="text-[11px] text-gray-500">Sin presentaciones</span>'}
                    </div>
                </div>
            </div>
        </div>`;
    }).join('');
    
    // Renderizar Paginación
    renderPagination(totalPages, filtered.length);
}

function renderPagination(totalPages, totalItems) {
    const paginationEl = document.getElementById('pagination');
    if (!paginationEl || totalPages <= 1) {
        if(paginationEl) paginationEl.innerHTML = '';
        return;
    }
    
    let html = '<div class="flex items-center justify-center gap-2 mt-8 flex-wrap">';
    
    // Botón Anterior
    if (state.currentPage > 1) {
        html += `<button onclick="goToPage(${state.currentPage - 1})" class="px-3 py-2 border border-gray-700 text-gray-400 hover:border-gior-gold hover:text-gior-gold transition-colors text-sm"><i class="fas fa-chevron-left"></i></button>`;
    }
    
    // Números de página
    for (let i = 1; i <= totalPages; i++) {
        const isActive = i === state.currentPage;
        const classes = isActive 
            ? 'bg-gior-gold text-black font-bold px-3 py-2' 
            : 'border border-gray-700 text-gray-400 hover:border-gior-gold hover:text-gior-gold px-3 py-2';
        html += `<button onclick="goToPage(${i})" class="${classes} transition-colors text-sm">${i}</button>`;
    }
    
    // Botón Siguiente
    if (state.currentPage < totalPages) {
        html += `<button onclick="goToPage(${state.currentPage + 1})" class="px-3 py-2 border border-gray-700 text-gray-400 hover:border-gior-gold hover:text-gior-gold transition-colors text-sm"><i class="fas fa-chevron-right"></i></button>`;
    }
    
    html += '</div>';
    paginationEl.innerHTML = html;
}

function goToPage(page) {
    state.currentPage = page;
    renderProducts();
    if (window.innerWidth >= MOBILE_BREAKPOINT) {
        document.getElementById('catalogo').scrollIntoView({ behavior: 'smooth' });
    }
}

// --- INTERACTION FUNCTIONS ---

// Filtros
function updateFilter(key, value, element) {
    state.currentPage = 1; // Reset a primera página al filtrar
    if (key === 'type') {
        if (element) { // checked
            state.filters.type.push(value);
        } else { // unchecked
            state.filters.type = state.filters.type.filter(t => t !== value);
        }
    } else if (key === 'category') {
        if (element) { // checked
            state.filters.category.push(value);
        } else { // unchecked
            state.filters.category = state.filters.category.filter(c => c !== value);
        }
    } else if (key === 'concentration') {
        const btns = document.querySelectorAll('.filter-conc-btn');
        
        // Lógica de toggle
        if (state.filters.concentration === value) {
            state.filters.concentration = null;
            element.classList.remove('bg-gior-gold', 'text-black', 'border-gior-gold', 'font-bold');
            element.classList.add('bg-black', 'text-gray-400', 'border-gray-700');
        } else {
            state.filters.concentration = value;
            btns.forEach(b => {
                b.classList.remove('bg-gior-gold', 'text-black', 'border-gior-gold', 'font-bold');
                b.classList.add('bg-black', 'text-gray-400', 'border-gray-700');
            });
            element.classList.remove('bg-black', 'text-gray-400', 'border-gray-700');
            element.classList.add('bg-gior-gold', 'text-black', 'border-gior-gold', 'font-bold');
        }
    }
    renderProducts();
}

// Event Listeners Globales
const sidebarSearch = document.getElementById('sidebar-search');
if(sidebarSearch) {
    sidebarSearch.addEventListener('input', (e) => {
        state.filters.search = e.target.value;
        state.currentPage = 1;
        renderProducts();
    });
}

const navSearch = document.getElementById('nav-search');
if(navSearch) {
    navSearch.addEventListener('input', (e) => {
        state.filters.search = e.target.value;
        state.currentPage = 1;
        if(window.scrollY < 400) document.getElementById('catalogo').scrollIntoView({behavior: 'smooth'});
        renderProducts();
    });
}

const priceRange = document.getElementById('price-range');
if(priceRange) {
    priceRange.addEventListener('input', (e) => {
        state.filters.maxPrice = parseInt(e.target.value);
        state.currentPage = 1;
        document.getElementById('price-display').innerText = `S/. ${state.filters.maxPrice}`;
        renderProducts();
    });
}

const sortSelect = document.getElementById('sort-select');
if(sortSelect) {
    sortSelect.addEventListener('change', (e) => {
        state.sort = e.target.value;
        state.currentPage = 1;
        renderProducts();
    });
}

const resetBtn = document.getElementById('reset-filters');
if(resetBtn) {
    resetBtn.addEventListener('click', () => {
         state.filters = { search: "", type: [], category: [], concentration: null, maxPrice: CATALOG_MAX_PRICE };
         state.currentPage = 1;
         // Reset UI elements
         document.getElementById('price-range').value = CATALOG_MAX_PRICE;
         document.getElementById('price-display').innerText = `S/. ${CATALOG_MAX_PRICE}`;
         if(sidebarSearch) sidebarSearch.value = "";
         document.querySelectorAll('input[type="checkbox"]').forEach(c => c.checked = false);
         document.querySelectorAll('.filter-conc-btn').forEach(b => {
             b.classList.remove('bg-gior-gold', 'text-black'); 
             b.classList.add('bg-black', 'text-gray-400');
         });
         renderProducts();
    });
}

// Selección de tamaño en tarjeta
function selectSize(btn, productId) {
    if (btn.disabled) return;

    // Actualización Visual
    const card = document.getElementById(`card-${productId}`);
    card.querySelectorAll('.size-btn').forEach(b => {
        b.classList.remove('bg-gior-gold', 'text-black', 'border-gior-gold', 'font-bold');
        b.classList.add('text-gray-400', 'border-gray-700');
    });
    btn.classList.remove('text-gray-400', 'border-gray-700');
    btn.classList.add('bg-gior-gold', 'text-black', 'border-gior-gold', 'font-bold');

    // Actualización Precio y variante
    const product = CATALOG_PRODUCTS.find(p => p.id === productId);
    const optionKey = btn.dataset.optionKey;
    const option = getPriceOptions(product).find(o => o.key === optionKey);
    if (!option) return;

    const priceEl = card.querySelector('.display-price');
    priceEl.innerText = formatPrice(option.price);
    priceEl.dataset.price = option.price;

    // Actualización Label
    const labelEl = card.querySelector('.selected-size-label');
    labelEl.innerText = `${option.label}${product.concentration ? ` • ${product.concentration}` : ''}`;
}

// Lógica Carrito
function toggleCart() {
    const sidebar = document.getElementById('cart-sidebar');
    const overlay = document.getElementById('cart-overlay');
    const isOpen = !sidebar.classList.contains('translate-x-full');

    if (isOpen) {
        sidebar.classList.add('translate-x-full');
        overlay.classList.remove('opacity-100');
        setTimeout(() => overlay.classList.add('hidden'), 300);
    } else {
        overlay.classList.remove('hidden');
        void overlay.offsetWidth; // Force reflow
        overlay.classList.add('opacity-100');
        sidebar.classList.remove('translate-x-full');
    }
}

function addToCart(productId) {
    const card = document.getElementById(`card-${productId}`);
    const product = CATALOG_PRODUCTS.find(p => p.id === productId);
    if (!product || product.soldOut || product.comingSoon) return;
    const productOptions = getPriceOptions(product);
    if (productOptions.length === 0) return;
    
    let selectedPrice, selectedSize, selectedLabel, selectedType, selectedOptionKey;
    
    if (card) {
        // Desde el grid
        const activeBtn = card.querySelector('.size-btn.bg-gior-gold');
        if (activeBtn) {
            selectedOptionKey = activeBtn.dataset.optionKey;
            const selectedOption = productOptions.find(o => o.key === selectedOptionKey);
            if (!selectedOption) return;
            selectedSize = selectedOption.size;
            selectedLabel = selectedOption.label;
            selectedType = selectedOption.type;
            selectedPrice = selectedOption.price;
        } else {
            const opts = productOptions[0];
            selectedSize = opts.size;
            selectedLabel = opts.label;
            selectedType = opts.type;
            selectedPrice = opts.price;
            selectedOptionKey = opts.key;
        }
    } else {
        // Desde el modal
        const opts = productOptions[0];
        selectedSize = opts.size;
        selectedLabel = opts.label;
        selectedType = opts.type;
        selectedPrice = opts.price;
        selectedOptionKey = opts.key;
    }

    const cartItem = state.cart.find(item => item.id === productId && item.optionKey === selectedOptionKey);

    if (cartItem) {
        cartItem.qty++;
    } else {
        state.cart.push({
            id: productId,
            name: product.name,
            img: product.imgUrl,
            optionKey: selectedOptionKey,
            size: selectedSize,
            label: selectedLabel,
            variantType: selectedType,
            price: selectedPrice,
            qty: 1
        });
    }

    updateCartUI();
    showToast(`Se añadió ${product.name} al carrito.`);
    
    // Si el carrito está abierto, renderizar items
    const sidebar = document.getElementById('cart-sidebar');
    if(sidebar && !sidebar.classList.contains('translate-x-full')){
         renderCartItems();
    }
}

function removeFromCart(index) {
    state.cart.splice(index, 1);
    updateCartUI();
}

function changeCartQty(index, delta) {
    const item = state.cart[index];
    if (!item) return;

    item.qty += delta;
    if (item.qty <= 0) {
        state.cart.splice(index, 1);
    }

    updateCartUI();
}

function updateCartUI() {
    const count = state.cart.reduce((sum, item) => sum + item.qty, 0);
    const badge = document.getElementById('cart-count');
    if(badge) {
        badge.innerText = count;
        if (count > 0) {
            badge.classList.remove('scale-0');
            badge.classList.add('scale-100', 'animate-pulse-slow');
        } else {
            badge.classList.remove('scale-100', 'animate-pulse-slow');
            badge.classList.add('scale-0');
        }
    }
    
    renderCartItems();
}

function renderCartItems() {
    const container = document.getElementById('cart-items');
    const totalEl = document.getElementById('cart-total');
    
    if (!container || !totalEl) return;

    if (state.cart.length === 0) {
        container.innerHTML = `
            <div class="flex flex-col items-center justify-center h-full text-gray-500 opacity-50">
                <i class="fas fa-shopping-basket text-5xl mb-4"></i>
                <p>Tu carrito está vacío</p>
            </div>`;
        totalEl.innerText = 'S/. 0.00';
        return;
    }

    let total = 0;
    container.innerHTML = state.cart.map((item, index) => {
        total += item.price * item.qty;
        return `
        <div class="flex gap-4 bg-gray-900/50 p-3 rounded border border-gray-800 relative group">
            <img src="${item.img}" class="w-16 h-16 object-cover rounded border border-gray-700">
            <div class="flex-1">
                <h4 class="text-white text-sm font-bold truncate pr-6">${item.name}</h4>
                <p class="text-gior-gold text-xs mb-1">${item.variantType === 'bottle' ? 'Botella' : 'Decant'} • ${item.label || item.size}</p>
                <div class="flex justify-between items-center mt-2">
                        <div class="text-white font-bold text-sm">S/. ${(item.price * item.qty).toFixed(2)}</div>
                        <div class="flex items-center gap-1 bg-black/40 border border-gray-700 rounded px-1 py-0.5">
                            <button onclick="changeCartQty(${index}, -1)" class="w-5 h-5 text-gray-300 hover:text-white">-</button>
                            <div class="text-xs text-gray-300 w-5 text-center">${item.qty}</div>
                            <button onclick="changeCartQty(${index}, 1)" class="w-5 h-5 text-gray-300 hover:text-white">+</button>
                        </div>
                </div>
            </div>
            <button onclick="removeFromCart(${index})" class="absolute top-2 right-2 text-gray-600 hover:text-red-500 transition-colors">
                <i class="fas fa-trash-alt text-xs"></i>
            </button>
        </div>
        `;
    }).join('');
    
    totalEl.innerText = formatPrice(total);
}

// Lógica Modal
function openProductModal(productId) {
    const product = CATALOG_PRODUCTS.find(p => p.id === productId);
    if (!product) return;

    const modal = document.getElementById('product-modal');
    const opts = getPriceOptions(product);

    // Populate Data
    document.getElementById('modal-img').src = product.imgUrl;
    document.getElementById('modal-title').innerText = product.name;
    document.getElementById('modal-house').innerText = product.house;
    document.getElementById('modal-desc').innerText = product.description;
    document.getElementById('modal-notes').innerText = product.notes;
    
    // Accords Bars
    const accordsContainer = document.getElementById('modal-accords');
    if (product.accordBars) {
        accordsContainer.innerHTML = product.accordBars.map(acc => `
            <div class="flex items-center gap-3 text-xs">
                <span class="w-20 text-right text-gray-400 font-medium">${acc.name}</span>
                <div class="flex-1 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                    <div class="h-full rounded-full" style="width: ${acc.width}%; background-color: ${acc.color};"></div>
                </div>
            </div>
        `).join('');
    } else {
        accordsContainer.innerHTML = '<span class="text-gray-600 text-xs">Información no disponible</span>';
    }

    // Badges
    let badgeHtml = '';
        if (product.soldOut) badgeHtml += '<span class="bg-red-600 text-white px-2 py-1 text-xs font-bold rounded">VENDIDO</span>';
        if (product.comingSoon) badgeHtml += '<span class="bg-amber-500 text-white px-2 py-1 text-xs font-bold rounded">PRÓXIMAMENTE</span>';
        if (product.topSeller) badgeHtml += '<span class="bg-gior-gold text-black px-2 py-1 text-xs font-bold rounded">TOP SELLER</span>';
        if (product.rare) badgeHtml += '<span class="bg-purple-600 text-white px-2 py-1 text-xs font-bold rounded">RARE</span>';
        document.getElementById('modal-badges').innerHTML = badgeHtml;

    // Price Button config
    const addBtn = document.getElementById('modal-add-btn');
    const priceDisplay = document.getElementById('modal-price');
    
    if (!opts[0]) {
        priceDisplay.innerText = product.comingSoon ? 'Próximamente' : 'Sin precio';
        addBtn.disabled = true;
        addBtn.classList.add('opacity-50', 'cursor-not-allowed');
        addBtn.innerText = product.comingSoon ? 'Próximamente' : 'No disponible';
    } else {
        priceDisplay.innerText = formatPrice(opts[0].price);
        addBtn.disabled = Boolean(product.soldOut || product.comingSoon);
        addBtn.classList.remove('opacity-50', 'cursor-not-allowed');
        if (addBtn.disabled) {
            addBtn.classList.add('opacity-50', 'cursor-not-allowed');
        }
        addBtn.innerText = product.soldOut ? 'Vendido' : (product.comingSoon ? 'Próximamente' : 'Agregar');
    }

    addBtn.onclick = () => {
        addToCart(product.id);
        closeProductModal();
    };

    modal.classList.remove('hidden');
}

function closeProductModal() {
    document.getElementById('product-modal').classList.add('hidden');
}

// Toast Notificación
function showToast(message) {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toast-message');
    if (toastMessage && message) {
        toastMessage.innerText = message;
    }
    toast.classList.remove('translate-y-24');
    setTimeout(() => {
        toast.classList.add('translate-y-24');
    }, 3000);
}

function handleCheckoutWhatsApp() {
    if (state.cart.length === 0) {
        showToast('Tu carrito está vacío.');
        return;
    }

    const total = state.cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    let message = "*¡Hola Essence d'Or!*\nQuisiera realizar el siguiente pedido:\n\n";

    state.cart.forEach((item) => {
        const variantLabel = item.variantType === 'bottle' ? `Botella ${item.label}` : `Decant ${item.label}`;
        message += `- ${item.name} | ${variantLabel}\n  Cant: ${item.qty} x S/. ${item.price.toFixed(2)} = S/. ${(item.price * item.qty).toFixed(2)}\n`;
    });

    message += `\n*TOTAL A PAGAR: S/. ${total.toFixed(2)}*`;
    message += '\n\nQuedo atento para coordinar el pago y envío. ¡Gracias!';

    const url = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
}

// --- INIT ---
function initApp() {
    const priceRangeInput = document.getElementById('price-range');
    const priceDisplay = document.getElementById('price-display');

    if (priceRangeInput) {
        priceRangeInput.max = String(CATALOG_MAX_PRICE);
        priceRangeInput.value = String(CATALOG_MAX_PRICE);
    }

    if (priceDisplay) {
        priceDisplay.innerText = `S/. ${CATALOG_MAX_PRICE}`;
    }

    state.filters.maxPrice = CATALOG_MAX_PRICE;

    // Verificar si existen los elementos antes de renderizar
    if(document.getElementById('product-grid')) {
        renderFilters();
        renderProducts();
    }

    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', handleCheckoutWhatsApp);
    }

    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            const nextItems = getItemsPerPage();
            if (nextItems !== state.itemsPerPage) {
                state.itemsPerPage = nextItems;
                state.currentPage = 1;
                renderProducts();
            }
        }, 120);
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}
