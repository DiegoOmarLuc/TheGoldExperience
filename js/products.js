const productsBase = [
    // ==========================================================
    // PLANTILLA RÁPIDA (copiar/pegar y rellenar)
    // ==========================================================
    // {
    //     id: 999, // number único (obligatorio)
    //     name: "Nombre del perfume", // string (obligatorio)
    //     house: "Casa", // string (obligatorio)
    //     category: "Arabe", // string: Arabe | Diseñador | Nicho | etc.
    //     type: "Decant", // string para filtro visual (opcional)
    //     concentration: "EDP", // string: EDT | EDP | Parfum | etc. (opcional)
    //     description: "Descripción corta", // string (recomendado)
    //     notes: "Notas: ...", // string (opcional)

    //     // PRECIOS / VARIANTES (usa los que quieras)
    //     price3: 20,   // number opcional
    //     price5: 30,   // number opcional
    //     price10: 55,  // number opcional
    //     price15: 75,  // number opcional
    //     price100: 150,// number opcional (también funciona)
    //     pricefull: 280, // number opcional -> muestra "Botella Completa"

    //     // ESTADO DEL PRODUCTO
    //     soldOut: false,    // true = Vendido (no permite comprar)
    //     comingSoon: false, // true = Próximamente (no permite comprar)

    //     // BADGES OPCIONALES
    //     topSeller: false, // true = badge Top Seller
    //     sale: false,      // true = badge Oferta
    //     rare: false,      // true = badge Rare
    //     rarity: "comun", // comun | raro | legendario (mystery boxes)
    //     discount: 0,      // número opcional si usas sale

    //     // IMAGEN / EXTRAS
    //     imgUrl: "https://...", // string URL imagen (obligatorio)
    //     imgColor: "#d4af37",   // opcional

    //     // ACORDES (opcional)
    //     accordBars: [
    //         { name: "Dulce", color: "#f1c40f", width: 100 },
    //         { name: "Amaderado", color: "#5d4037", width: 70 }
    //     ]
    // },

    { 
        id: 2, 
        name: "Asad Bourbon", 
        house: "Lattafa",
        category: "Arabe",
        type: "Botella Sellada",
        concentration: "EDP",
        description: "Elegancia nocturna y especiada. Un clon sobresaliente con una salida picante y secado avainillado.",
        notes: "Pimienta Negra, Piña, Tabaco, Café, Vainilla.",
        pricefull: 170,
        rarity: "comun",
        imgUrl: "https://amanahamh.net/cdn/shop/files/Asad-Bourbon-100ml-Perfume-Eau-de-Parfum-Lattafa_1a9e2a07-ee83-430b-8376-af88782071b0.jpg?v=1735475303",
        sale: true,
        discount: 10,
        accordBars: [
            { name: "Cálido Especiado", color: "#c0392b", width: 100 },
            { name: "Ámbar", color: "#e67e22", width: 85 },
            { name: "Amaderado", color: "#5d4037", width: 75 },
            { name: "Vainilla", color: "#f1c40f", width: 65 },
            { name: "Atalcado", color: "#bdc3c7", width: 50 }
        ]
    },
    // ==========================================
    // PERFUMES ACTIVOS (solo botella completa)
    // ==========================================
    { 
        id: 11, 
        name: "Mandarine Sky", 
        house: "Pendora Scents / Paris Corner",
        category: "Arabe",
        type: "Botella Sellada",
        concentration: "EDP",
        description: "Una fragancia dulce y juguetona con un caramelo adictivo y un toque cítrico vibrante.",
        notes: "Mandarina, Caramelo, Haba Tonka, Salvia, Vetiver.",
        pricefull: 170,
        rarity: "comun",
        imgUrl: "https://www.khanelkhaliliusa.com/cdn/shop/files/Screenshot_2025-07-02_at_4.42.48_PM.png?v=1751489053",
        accordBars: [
            { name: "Dulce", color: "#e91e63", width: 100 },
            { name: "Caramelo", color: "#d35400", width: 90 },
            { name: "Cítrico", color: "#f1c40f", width: 80 },
            { name: "Aromático", color: "#2ecc71", width: 70 },
            { name: "Vainilla", color: "#f39c12", width: 55 }
        ]
    },
    { 
        id: 12, 
        name: "Yara (Pink)", 
        house: "Lattafa",
        category: "Arabe",
        type: "Botella Sellada",
        concentration: "EDP",
        description: "Un batido de fresa y vainilla esponjoso, tropical y ultra femenino.",
        notes: "Orquídea, Heliotropo, Frutas tropicales, Vainilla, Almizcle.",
        pricefull: 150,
        rarity: "comun",
        imgUrl: "https://www.intenseoud.com/cdn/shop/files/21_b67cc975-e856-43db-b935-6f91b4412a60.jpg?v=1728326293",
        topSeller: true,
        accordBars: [
            { name: "Dulce", color: "#ff6b81", width: 100 },
            { name: "Vainilla", color: "#f1c40f", width: 95 },
            { name: "Atalcado", color: "#ffeaa7", width: 85 },
            { name: "Tropical", color: "#ff7f50", width: 75 },
            { name: "Afrutado", color: "#ff4757", width: 60 }
        ]
    },
    { 
        id: 13, 
        name: "Bade'e Al Oud Sublime", 
        house: "Lattafa",
        category: "Arabe",
        type: "Botella Sellada",
        concentration: "EDP",
        description: "Una explosión frutal de manzana y lichi con un fondo floral y amaderado elegante.",
        notes: "Manzana, Lichi, Rosa, Ciruela, Musgo, Vainilla.",
        pricefull: 150,
        rarity: "comun",
        imgUrl: "https://m.media-amazon.com/images/I/61lQASNGZ0L.jpg",
        accordBars: [
            { name: "Afrutado", color: "#e84393", width: 100 },
            { name: "Dulce", color: "#fd79a8", width: 90 },
            { name: "Fresco", color: "#74b9ff", width: 80 },
            { name: "Rosas", color: "#ff7675", width: 70 },
            { name: "Amaderado", color: "#5d4037", width: 60 }
        ]
    },
    { 
        id: 14, 
        name: "Eclaire", 
        house: "Lattafa",
        category: "Arabe",
        type: "Botella Sellada",
        concentration: "EDP",
        description: "Un postre hecho perfume. Caramelo, leche y miel que te envuelven en un aura gourmand irresistible.",
        notes: "Caramelo, Leche, Azúcar, Miel, Flores Blancas, Vainilla.",
        pricefull: 160,
        rarity: "raro",
        imgUrl: "https://www.mybeautyexchange.com/cdn/shop/files/lattafa-eclaire-eau-de-parfum-34-oz-8224663.webp?v=1773420170&width=1000",
        topSeller: true,
        accordBars: [
            { name: "Caramelo", color: "#d35400", width: 100 },
            { name: "Dulce", color: "#ff9f43", width: 95 },
            { name: "Vainilla", color: "#f1c40f", width: 90 },
            { name: "Lactónico", color: "#f5f6fa", width: 85 },
            { name: "Miel", color: "#f39c12", width: 75 }
        ]
    },
    { 
        id: 15, 
        name: "Bade'e Al Oud Honor & Glory", 
        house: "Lattafa",
        category: "Arabe",
        type: "Botella Sellada",
        concentration: "EDP",
        description: "Un crème brûlée de piña exquisito y cremoso, con un toque especiado brillante.",
        notes: "Piña, Crème Brûlée, Canela, Pimienta Negra, Vainilla, Sándalo.",
        pricefull: 150,
        rarity: "comun",
        imgUrl: "https://m.media-amazon.com/images/I/71luMCs9ruL.jpg",
        accordBars: [
            { name: "Dulce", color: "#f1c40f", width: 100 },
            { name: "Vainilla", color: "#f39c12", width: 90 },
            { name: "Afrutado", color: "#ffb142", width: 85 },
            { name: "Cálido Especiado", color: "#c0392b", width: 75 },
            { name: "Lactónico", color: "#f5f6fa", width: 65 }
        ]
    },
    {
        id: 16,
        name: "Aqua Dubai 75 ML",
        house: "Al Haramain",
        category: "Arabe",
        type: "Botella Sellada",
        concentration: "EDP",
        description: "Frescura limpia y elegante con carácter moderno para uso diario.",
        notes: "Cítricos, notas acuáticas, almizcle y maderas suaves.",
        pricefull: 260,
        rarity: "comun",
        imgUrl: "https://perfumescardales.com.ar/wp-content/uploads/2024/12/aqua-dubai-1.jpg",
        accordBars: [
            { name: "Acuático", color: "#00bcd4", width: 100 },
            { name: "Cítrico", color: "#f1c40f", width: 80 },
            { name: "Fresco", color: "#3498db", width: 75 }
        ]
    },
    {
        id: 17,
        name: "Odyssey Aqua 100 ML",
        house: "Armaf",
        category: "Arabe",
        type: "Botella Sellada",
        concentration: "EDP",
        description: "Aroma acuático versátil, limpio y con buena proyección.",
        notes: "Pomelo, notas marinas, lavanda y maderas.",
        pricefull: 170,
        rarity: "comun",
        imgUrl: "https://guateselectos.com/cdn/shop/files/IMG-3508.jpg?v=1770395270&width=1214",
        accordBars: [
            { name: "Acuático", color: "#00bcd4", width: 95 },
            { name: "Aromático", color: "#2ecc71", width: 80 },
            { name: "Amaderado", color: "#5d4037", width: 60 }
        ]
    },
    {
        id: 18,
        name: "Erba Pura 100 ML",
        house: "Xerjoff",
        category: "Nicho",
        type: "Botella Sellada",
        concentration: "EDP",
        description: "Frutal premium de alto impacto con estela intensa y larga duración.",
        notes: "Cítricos sicilianos, frutas mediterráneas, ámbar y almizcle blanco.",
        pricefull: 980,
        rarity: "legendario",
        imgUrl: "https://parfumexquis.us/cdn/shop/files/XerjoffErbaPura_2.jpg?v=1742329168&width=2048",
        accordBars: [
            { name: "Afrutado", color: "#e74c3c", width: 100 },
            { name: "Dulce", color: "#f39c12", width: 85 },
            { name: "Almizclado", color: "#ecf0f1", width: 70 }
        ]
    }

    // ==========================================
    // OTROS PRODUCTOS OCULTOS (comentados)
    // Para volver a mostrarlos, descomenta y pega arriba.
    // ==========================================
    // {
    //     id: 1,
    //     name: "Invictus Victory Elixir",
    //     house: "Paco Rabanne",
    //     category: "Diseñador",
    //     type: "Decant",
    //     concentration: "Parfum Intense",
    //     description: "La expresión máxima de la victoria. Un aroma rico, potente y extremadamente duradero.",
    //     notes: "Incienso, Vainilla, Haba Tonka, Ámbar.",
    //     price5: 55,
    //     price10: 95,
    //     rarity: "comun",
    //     imgUrl: "https://fragrancehouse.co.uk/wp-content/uploads/2023/02/Paco-Rabanne-Invictus-Victory-Elixir-Eau-de-Parfum-Intense-Ad-1.jpg",
    //     topSeller: true,
    //     accordBars: [
    //         { name: "Vainilla", color: "#f1c40f", width: 100 },
    //         { name: "Ámbar", color: "#e67e22", width: 90 },
    //         { name: "Dulce", color: "#d35400", width: 80 },
    //         { name: "Cálido Especiado", color: "#c0392b", width: 70 },
    //         { name: "Atalcado", color: "#ecf0f1", width: 60 }
    //     ]
    // },
    // {
    //     id: 3,
    //     name: "Amber Oud Gold Edition",
    //     house: "Al Haramain",
    //     category: "Arabe",
    //     type: "Decant",
    //     concentration: "EDP",
    //     description: "Una explosión frutal y dulce. Lujoso, llamativo y con una duración nuclear.",
    //     notes: "Bergamota, Melón, Piña, Vainilla, Almizcle.",
    //     price5: 35,
    //     price10: 60,
    //     rarity: "raro",
    //     imgUrl: "https://labelleperfumes.com/cdn/shop/files/al-haramain-amber-oud-gold-edition--2_800x.webp?v=1728333728",
    //     accordBars: [
    //         { name: "Dulce", color: "#f1c40f", width: 100 },
    //         { name: "Afrutado", color: "#e74c3c", width: 90 },
    //         { name: "Ozónico", color: "#bdc3c7", width: 75 },
    //         { name: "Ámbar", color: "#e67e22", width: 60 },
    //         { name: "Almizclado", color: "#ecf0f1", width: 50 }
    //     ]
    // },
    // {
    //     id: 4,
    //     name: "Xerjoff Torino 21",
    //     house: "Xerjoff",
    //     category: "Nicho",
    //     type: "Decant",
    //     concentration: "EDP",
    //     description: "Frescura deportiva de alta gama. Menta vibrante y cítricos que evocan las canchas de tenis.",
    //     notes: "Menta, Limón, Albahaca, Tomillo, Lavanda.",
    //     pricefull: 990,
    //     soldOut: true,
    //     rarity: "legendario",
    //     imgUrl: "https://www.luxeperfumery.com/cdn/shop/files/image_1800x1800_a26efdb7-41ec-44e0-8d7d-5c6377f5307b.jpg?v=1709838208",
    //     accordBars: [
    //         { name: "Aromático", color: "#27ae60", width: 100 },
    //         { name: "Cítrico", color: "#f1c40f", width: 90 },
    //         { name: "Verde", color: "#2ecc71", width: 85 },
    //         { name: "Especiado Fresco", color: "#3498db", width: 70 },
    //         { name: "Herbal", color: "#16a085", width: 60 }
    //     ]
    // },
    // {
    //     id: 5,
    //     name: "Hawas Ice",
    //     house: "Rasasi",
    //     category: "Arabe",
    //     type: "Decant",
    //     concentration: "EDP",
    //     description: "La bestia del verano, ahora más helada. Ciruela y cítricos con un toque extra de menta.",
    //     notes: "Manzana, Limón Italiano, Ciruela, Menta, Maderas.",
    //     price5: 25,
    //     price10: 45,
    //     rarity: "comun",
    //     imgUrl: "https://perfuminate.com/wp-content/uploads/2025/06/rasas-hawas-ice-1.jpg",
    //     accordBars: [
    //         { name: "Afrutado", color: "#8e44ad", width: 100 },
    //         { name: "Fresco", color: "#3498db", width: 90 },
    //         { name: "Acuático", color: "#00bcd4", width: 80 },
    //         { name: "Dulce", color: "#f1c40f", width: 70 },
    //         { name: "Cítrico", color: "#f39c12", width: 60 }
    //     ]
    // },
    // {
    //     id: 6,
    //     name: "Stronger With You Intensely",
    //     house: "Giorgio Armani",
    //     category: "Diseñador",
    //     type: "Decant",
    //     concentration: "EDP",
    //     description: "Seducción gourmand. Un abrazo cálido de toffee y canela perfecto para citas.",
    //     notes: "Pimienta Rosa, Toffee, Canela, Vainilla, Tonka.",
    //     price5: 60,
    //     price10: 110,
    //     rarity: "raro",
    //     imgUrl: "https://m.media-amazon.com/images/I/A11LbamXjBL.png",
    //     topSeller: true,
    //     accordBars: [
    //         { name: "Dulce", color: "#e91e63", width: 100 },
    //         { name: "Vainilla", color: "#f1c40f", width: 95 },
    //         { name: "Cálido Especiado", color: "#c0392b", width: 85 },
    //         { name: "Ámbar", color: "#e67e22", width: 75 },
    //         { name: "Caramelo", color: "#d35400", width: 65 }
    //     ]
    // },
    // {
    //     id: 7,
    //     name: "Valentino Born in Roma",
    //     house: "Valentino",
    //     category: "Diseñador",
    //     type: "Decant",
    //     concentration: "EDT",
    //     description: "Estilo italiano moderno. Una mezcla única de notas minerales, saladas y florales amaderadas.",
    //     notes: "Sal, Hojas de Violeta, Jengibre, Salvia, Vetiver.",
    //     price5: 50,
    //     price10: 90,
    //     rarity: "comun",
    //     imgUrl: "https://images.unsplash.com/photo-1557121669-b59dd3369de1?auto=format&fit=crop&w=800&q=80",
    //     accordBars: [
    //         { name: "Mineral", color: "#95a5a6", width: 100 },
    //         { name: "Amaderado", color: "#5d4037", width: 85 },
    //         { name: "Acuático", color: "#3498db", width: 75 },
    //         { name: "Floral", color: "#e91e63", width: 65 },
    //         { name: "Salado", color: "#bdc3c7", width: 50 }
    //     ]
    // },
    // {
    //     id: 8,
    //     name: "The Most Wanted EDP Intense",
    //     house: "Azzaro",
    //     category: "Diseñador",
    //     type: "Decant",
    //     concentration: "EDP Intense",
    //     description: "El arma de seducción definitiva. Cardamomo picante y un fondo dulce adictivo.",
    //     notes: "Cardamomo, Toffee, Amberwood.",
    //     price5: 45,
    //     price10: 85,
    //     rarity: "comun",
    //     imgUrl: "https://images.unsplash.com/photo-1620025979509-f14d8f286895?auto=format&fit=crop&w=800&q=80",
    //     accordBars: [
    //         { name: "Cálido Especiado", color: "#c0392b", width: 100 },
    //         { name: "Dulce", color: "#f39c12", width: 90 },
    //         { name: "Caramelo", color: "#d35400", width: 80 },
    //         { name: "Amaderado", color: "#5d4037", width: 70 },
    //         { name: "Ámbar", color: "#e67e22", width: 60 }
    //     ]
    // },
    // {
    //     id: 9,
    //     name: "Le Beau",
    //     house: "Jean Paul Gaultier",
    //     category: "Diseñador",
    //     type: "Decant",
    //     concentration: "EDT",
    //     description: "El paraíso en una botella. Coco fresco y madera que transportan a una playa tropical.",
    //     notes: "Bergamota, Coco, Haba Tonka.",
    //     price5: 50,
    //     price10: 95,
    //     rarity: "raro",
    //     imgUrl: "https://images.unsplash.com/photo-1585827367352-d5cb69424751?auto=format&fit=crop&w=800&q=80",
    //     accordBars: [
    //         { name: "Coco", color: "#ecf0f1", width: 100 },
    //         { name: "Vainilla", color: "#f1c40f", width: 85 },
    //         { name: "Dulce", color: "#f39c12", width: 75 },
    //         { name: "Aromático", color: "#2ecc71", width: 60 },
    //         { name: "Cítrico", color: "#e67e22", width: 50 }
    //     ]
    // },
    // {
    //     id: 10,
    //     name: "Acqua Di Gio",
    //     house: "Giorgio Armani",
    //     category: "Diseñador",
    //     type: "Decant",
    //     concentration: "EDT",
    //     description: "El clásico atemporal. La fragancia marina por excelencia, fresca y limpia.",
    //     notes: "Lima, Limón, Jazmín, Notas Marinas, Cedro.",
    //     price5: 40,
    //     price10: 75,
    //     rarity: "comun",
    //     imgUrl: "https://images.unsplash.com/photo-1585223945484-934c9f1311b1?auto=format&fit=crop&w=800&q=80",
    //     accordBars: [
    //         { name: "Cítrico", color: "#f1c40f", width: 100 },
    //         { name: "Aromático", color: "#2ecc71", width: 90 },
    //         { name: "Marino", color: "#3498db", width: 85 },
    //         { name: "Especiado Fresco", color: "#1abc9c", width: 70 },
    //         { name: "Floral", color: "#e91e63", width: 50 }
    //     ]
    // }
];