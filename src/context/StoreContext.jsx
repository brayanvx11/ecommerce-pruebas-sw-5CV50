import React, { createContext, useContext, useState, useEffect } from 'react';
import { initialProducts } from '../data/initialProducts';
import { useAuth } from './AuthContext';
import { 
  db, 
  isFirebaseConfigured, 
  collection, 
  doc, 
  setDoc, 
  updateDoc, 
  onSnapshot 
} from '../services/firebase';

const StoreContext = createContext();

const STORAGE_KEY_PRODUCTS = '0x1tech_products_data';
const STORAGE_KEY_CART = '0x1tech_cart_items';
const STORAGE_KEY_FAVORITES = '0x1tech_user_favorites';
const STORAGE_KEY_ORDERS = '0x1tech_store_orders';

export const StoreProvider = ({ children }) => {
  const { currentUser } = useAuth();

  // Catálogo de productos con resiliencia offline [RFN02]
  const [products, setProducts] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PRODUCTS);
      return saved ? JSON.parse(saved) : initialProducts;
    } catch {
      return initialProducts;
    }
  });

  // Carrito de compras persistente offline [RFN02]
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CART);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Favoritos por usuario
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_FAVORITES);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Pedidos
  const [orders, setOrders] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ORDERS);
      return saved ? JSON.parse(saved) : [
        {
          id: 'ORD-9821',
          createdAt: '2026-10-14T10:30:00Z',
          customer: { id: 'usr-cliente', name: 'Mariana Ramos', email: 'cliente@tienda.com' },
          items: [
            { id: 'prod-1', name: 'Audífonos Inalámbricos Pro ANC', price: 1899, quantity: 1, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80' }
          ],
          total: 1899,
          paymentMethod: 'Tarjeta de Crédito / Débito',
          shippingAddress: 'Av. Reforma 222, Cuauhtémoc, CDMX',
          shippingStatus: 'En camino',
          hasInvoice: true,
          invoiceData: { rfc: 'RAM850312XX1', businessName: 'Mariana Ramos S.A. de C.V.' }
        }
      ];
    } catch {
      return [];
    }
  });

  // Sincronización en tiempo real de productos con Firestore
  useEffect(() => {
    if (!isFirebaseConfigured || !db) return;

    const prodCol = collection(db, 'products');
    const unsubscribe = onSnapshot(prodCol, (snapshot) => {
      if (!snapshot.empty) {
        const firestoreProds = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        setProducts(firestoreProds);
      }
    }, (error) => {
      console.warn("Firestore products listener fallback:", error);
    });

    return () => unsubscribe();
  }, []);

  // Sincronización en tiempo real de órdenes con Firestore
  useEffect(() => {
    if (!isFirebaseConfigured || !db) return;

    const ordersCol = collection(db, 'orders');
    const unsubscribe = onSnapshot(ordersCol, (snapshot) => {
      if (!snapshot.empty) {
        const firestoreOrders = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        setOrders(firestoreOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
      }
    }, (error) => {
      console.warn("Firestore orders listener fallback:", error);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(products));
    } catch (_) {}
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CART, JSON.stringify(cart));
    } catch (_) {}
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_FAVORITES, JSON.stringify(favorites));
    } catch (_) {}
  }, [favorites]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_ORDERS, JSON.stringify(orders));
    } catch (_) {}
  }, [orders]);

  // --- CRUD de Carrito con validación de Stock ---
  const addToCart = (product, quantity = 1) => {
    let finalAdded = 0;
    setCart(prevCart => {
      const existing = prevCart.find(item => item.id === product.id);
      if (existing) {
        const newQty = Math.min(existing.quantity + quantity, product.stock);
        finalAdded = newQty - existing.quantity;
        return prevCart.map(item => 
          item.id === product.id ? { ...item, quantity: newQty } : item
        );
      }
      finalAdded = Math.min(quantity, product.stock);
      return [...prevCart, { ...product, quantity: finalAdded }];
    });
    return finalAdded;
  };

  const updateCartQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    const product = products.find(p => p.id === productId);
    const maxStock = product ? product.stock : 99;
    setCart(prevCart => 
      prevCart.map(item => 
        item.id === productId ? { ...item, quantity: Math.min(quantity, maxStock) } : item
      )
    );
  };

  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // --- Favoritos ---
  const userFavorites = currentUser ? (favorites[currentUser.id] || []) : [];

  const toggleFavorite = (productId) => {
    if (!currentUser) return false;
    let added = false;
    setFavorites(prev => {
      const currentList = prev[currentUser.id] || [];
      const exists = currentList.includes(productId);
      added = !exists;
      const updated = exists 
        ? currentList.filter(id => id !== productId) 
        : [...currentList, productId];
      return { ...prev, [currentUser.id]: updated };
    });
    return added;
  };

  const isFavorite = (productId) => {
    return userFavorites.includes(productId);
  };

  // --- Reseñas y Preguntas ---
  const addReview = async (productId, { rating, comment, user }) => {
    const targetProduct = products.find(p => p.id === productId);
    if (!targetProduct) return;

    const newReview = {
      id: 'rev-' + Date.now(),
      user: user || 'Cliente 0x1 Tech',
      rating: Number(rating),
      comment,
      date: new Date().toISOString().split('T')[0]
    };
    const updatedReviews = [newReview, ...(targetProduct.reviews || [])];
    const newRating = +(updatedReviews.reduce((acc, r) => acc + r.rating, 0) / updatedReviews.length).toFixed(1);

    if (isFirebaseConfigured && db) {
      try {
        await updateDoc(doc(db, 'products', productId), {
          reviews: updatedReviews,
          rating: newRating
        });
      } catch (e) {
        console.warn("Firestore addReview fallback:", e);
      }
    }

    setProducts(prev => prev.map(p => 
      p.id === productId ? { ...p, reviews: updatedReviews, rating: newRating } : p
    ));
  };

  const addQuestion = async (productId, questionText) => {
    const targetProduct = products.find(p => p.id === productId);
    if (!targetProduct) return;

    const newFaq = {
      question: questionText,
      answer: "Tu consulta ha sido enviada al proveedor. El equipo técnico de 0x1 Tech te responderá a la brevedad."
    };
    const updatedFaqs = [...(targetProduct.faqs || []), newFaq];

    if (isFirebaseConfigured && db) {
      try {
        await updateDoc(doc(db, 'products', productId), { faqs: updatedFaqs });
      } catch (e) {
        console.warn("Firestore addQuestion fallback:", e);
      }
    }

    setProducts(prev => prev.map(p => 
      p.id === productId ? { ...p, faqs: updatedFaqs } : p
    ));
  };

  // --- Creación de Pedido y Descuento de Stock ---
  const placeOrder = async ({ items, total, paymentMethod, shippingAddress, hasInvoice, invoiceData }) => {
    const orderId = 'ORD-' + Math.floor(1000 + Math.random() * 9000);
    const newOrder = {
      id: orderId,
      createdAt: new Date().toISOString(),
      customer: {
        id: currentUser ? currentUser.id : 'guest',
        name: currentUser ? currentUser.name : 'Cliente Invitado',
        email: currentUser ? currentUser.email : 'cliente@ejemplo.com'
      },
      items,
      total,
      paymentMethod,
      shippingAddress,
      shippingStatus: 'Procesando',
      hasInvoice,
      invoiceData: hasInvoice ? invoiceData : null
    };

    // Reducir stock
    setProducts(prev => prev.map(p => {
      const purchased = items.find(item => item.id === p.id);
      if (purchased) {
        const updatedStock = Math.max(0, p.stock - purchased.quantity);
        if (isFirebaseConfigured && db) {
          updateDoc(doc(db, 'products', p.id), {
            stock: updatedStock,
            boughtCount: (p.boughtCount || 0) + purchased.quantity
          }).catch(console.warn);
        }
        return { ...p, stock: updatedStock, boughtCount: (p.boughtCount || 0) + purchased.quantity };
      }
      return p;
    }));

    if (isFirebaseConfigured && db) {
      try {
        await setDoc(doc(db, 'orders', orderId), newOrder);
      } catch (e) {
        console.warn("Firestore placeOrder fallback:", e);
      }
    }

    setOrders(prev => [newOrder, ...prev]);
    clearCart();
    return newOrder;
  };

  // --- Actualizar Estado de Envío (Panel Admin) ---
  const updateShippingStatus = async (orderId, newStatus) => {
    if (isFirebaseConfigured && db) {
      try {
        await updateDoc(doc(db, 'orders', orderId), { shippingStatus: newStatus });
      } catch (e) {
        console.warn("Firestore shipping status fallback:", e);
      }
    }
    setOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, shippingStatus: newStatus } : order
    ));
  };

  // --- Actualizar Stock de Producto (Panel Admin) ---
  const updateProductStock = async (productId, newStock) => {
    const parsedStock = Math.max(0, Number(newStock));
    if (isFirebaseConfigured && db) {
      try {
        await updateDoc(doc(db, 'products', productId), { stock: parsedStock });
      } catch (e) {
        console.warn("Firestore stock update fallback:", e);
      }
    }
    setProducts(prev => prev.map(p => 
      p.id === productId ? { ...p, stock: parsedStock } : p
    ));
  };

  // --- Crear nuevo producto (Panel Admin) ---
  const addProduct = async (productData) => {
    const newId = 'prod-' + Date.now();
    const tagsArray = (productData.tagsString || '')
      .split(',')
      .map(t => t.trim().toLowerCase())
      .filter(Boolean);

    const newProduct = {
      id: newId,
      name: productData.name.trim(),
      category: productData.category.trim() || 'General',
      price: Number(productData.price) || 0,
      stock: Number(productData.stock) || 0,
      rating: 5.0,
      image: productData.image.trim() || 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=600&auto=format&fit=crop&q=80',
      description: productData.description.trim() || 'Sin descripción disponible.',
      boughtCount: 0,
      isFeatured: Boolean(productData.isFeatured),
      tags: tagsArray,
      faqs: [],
      reviews: []
    };

    if (isFirebaseConfigured && db) {
      try {
        await setDoc(doc(db, 'products', newId), newProduct);
      } catch (e) {
        console.warn("Firestore addProduct error:", e);
      }
    }

    setProducts(prev => [newProduct, ...prev]);
    return newProduct;
  };

  // --- Función para sembrar catálogo comercial en Firestore ---
  const seedFirestoreProducts = async () => {
    if (!isFirebaseConfigured || !db) {
      throw new Error("Firebase no está configurado en el archivo .env");
    }
    for (const prod of initialProducts) {
      await setDoc(doc(db, 'products', prod.id), prod, { merge: true });
    }
    return true;
  };

  return (
    <StoreContext.Provider value={{
      products,
      cart,
      cartTotal,
      cartCount,
      addToCart,
      updateCartQuantity,
      removeFromCart,
      clearCart,
      userFavorites,
      toggleFavorite,
      isFavorite,
      addReview,
      addQuestion,
      orders,
      placeOrder,
      updateShippingStatus,
      updateProductStock,
      addProduct,
      seedFirestoreProducts
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => useContext(StoreContext);
