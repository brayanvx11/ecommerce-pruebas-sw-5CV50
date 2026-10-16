export const initialProducts = [
  {
    id: "prod-1",
    name: "Auriculares Inalámbricos Pro ANC",
    price: 1899.00,
    category: "Audio",
    stock: 12,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80",
    description: "Auriculares premium con cancelación activa de ruido, 30 horas de batería y sonido de alta fidelidad.",
    boughtCount: 142,
    isFeatured: true,
    faqs: [
      { question: "¿Tienen garantía?", answer: "Sí, cuentan con 1 año de garantía oficial contra defectos de fábrica." },
      { question: "¿Son resistentes al agua?", answer: "Tienen certificación IPX4 contra salpicaduras y sudor." }
    ],
    reviews: [
      { id: "rev-1", user: "Carlos M.", rating: 5, date: "2026-09-15", comment: "Excelente cancelación de ruido, valen cada centavo." },
      { id: "rev-2", user: "Sofia L.", rating: 4, date: "2026-09-28", comment: "Muy cómodos y la batería dura días." }
    ]
  },
  {
    id: "prod-2",
    name: "Smartwatch Deportivo Apex Fit",
    price: 2499.00,
    category: "Wearables",
    stock: 4, // Stock bajo para alertas de admin (< 5)
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80",
    description: "Monitoreo cardíaco en tiempo real, GPS integrado, pantalla AMOLED y sumergible a 50 metros.",
    boughtCount: 98,
    isFeatured: true,
    faqs: [
      { question: "¿Es compatible con iOS y Android?", answer: "Sí, compatible con dispositivos Android 8.0+ y iOS 13+." }
    ],
    reviews: [
      { id: "rev-3", user: "Mariana R.", rating: 5, date: "2026-10-02", comment: "La pantalla es hermosa y la batería dura más de una semana." }
    ]
  },
  {
    id: "prod-3",
    name: "Teclado Mecánico RGB Custom",
    price: 1350.00,
    category: "Computación",
    stock: 3, // Stock bajo (< 5)
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=80",
    description: "Switches intercambiables en caliente (Hot-swappable), keycaps PBT de doble inyección y retroiluminación RGB.",
    boughtCount: 215,
    isFeatured: true,
    faqs: [
      { question: "¿Qué tipo de switches trae?", answer: "Incluye switches táctiles lubricados de fábrica." }
    ],
    reviews: [
      { id: "rev-4", user: "Daniel V.", rating: 5, date: "2026-09-10", comment: "El sonido es increíble y la calidad de construcción insuperable." }
    ]
  },
  {
    id: "prod-4",
    name: "Mouse Ergonómico Ultra Inalámbrico",
    price: 799.00,
    category: "Computación",
    stock: 25,
    rating: 4.4,
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&auto=format&fit=crop&q=80",
    description: "Diseño ergonómico vertical que reduce la tensión muscular en la muñeca, sensor óptico de alta precisión.",
    boughtCount: 88,
    isFeatured: false,
    faqs: [
      { question: "¿Usa pilas o batería recargable?", answer: "Tiene batería recargable vía USB-C con hasta 3 meses por carga." }
    ],
    reviews: [
      { id: "rev-5", user: "Andrés P.", rating: 4, date: "2026-10-05", comment: "Me quitó el dolor en la mano durante el trabajo de oficina." }
    ]
  },
  {
    id: "prod-5",
    name: "Mochila Antirrobo Ejecutiva Tech",
    price: 1199.00,
    category: "Accesorios",
    stock: 2, // Stock bajo (< 5)
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80",
    description: "Impermeable, puerto de carga USB exterior, compartimento acolchado para laptop de hasta 16 pulgadas y cremalleras ocultas.",
    boughtCount: 160,
    isFeatured: true,
    faqs: [
      { question: "¿Es apta para viajar en cabina de avión?", answer: "Sí, cumple con las medidas estándar de equipaje de mano." }
    ],
    reviews: [
      { id: "rev-6", user: "Valeria G.", rating: 5, date: "2026-08-20", comment: "Súper espaciosa y elegante para la universidad o el trabajo." }
    ]
  },
  {
    id: "prod-6",
    name: "Cámara Web 4K Ultra HD con Micrófono",
    price: 1599.00,
    category: "Computación",
    stock: 18,
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1589739900243-4b52cd9b104e?w=600&auto=format&fit=crop&q=80",
    description: "Resolución 4K a 60fps con enfoque automático inteligente y reducción de ruido ambiental por IA.",
    boughtCount: 75,
    isFeatured: false,
    faqs: [
      { question: "¿Requiere drivers?", answer: "No, es Plug & Play con Windows, Mac y Linux." }
    ],
    reviews: [
      { id: "rev-7", user: "Jorge T.", rating: 4, date: "2026-09-02", comment: "Imagen muy nítida en reuniones de trabajo." }
    ]
  }
];
