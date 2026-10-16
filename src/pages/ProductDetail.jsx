import React, { useState } from 'react';
import { ArrowLeft, Star, Heart, ShoppingCart, MessageCircle, HelpCircle, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useAuth } from '../context/AuthContext';

export const ProductDetail = ({ product, onBack, onGoToCart, onRequireLogin }) => {
  const { addToCart, toggleFavorite, isFavorite, addReview, addQuestion } = useStore();
  const { isAuthenticated, currentUser } = useAuth();

  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('reviews'); // 'reviews' | 'faqs'
  
  // Estado para nueva reseña
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [reviewSent, setReviewSent] = useState(false);

  // Estado para nueva pregunta
  const [newQuestion, setNewQuestion] = useState('');
  const [questionSent, setQuestionSent] = useState(false);

  if (!product) return null;

  const favorite = isFavorite(product.id);

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const handleBuyNow = () => {
    if (!isAuthenticated) {
      alert('Para proceder a la compra es necesario iniciar sesión o registrarse.');
      onRequireLogin();
      return;
    }
    addToCart(product, quantity);
    onGoToCart();
  };

  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    addReview(product.id, {
      rating: newRating,
      comment: newComment,
      user: currentUser ? currentUser.name : 'Usuario Verificado'
    });
    setNewComment('');
    setReviewSent(true);
    setTimeout(() => setReviewSent(false), 4000);
  };

  const handleSubmitQuestion = (e) => {
    e.preventDefault();
    if (!newQuestion.trim()) return;
    addQuestion(product.id, newQuestion);
    setNewQuestion('');
    setQuestionSent(true);
    setTimeout(() => setQuestionSent(false), 4000);
  };

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '3rem' }}>
      
      {/* Botón Volver */}
      <button 
        onClick={onBack}
        className="btn-secondary"
        style={{ marginBottom: '1.5rem', padding: '0.4rem 0.8rem', fontSize: '0.9rem' }}
      >
        <ArrowLeft size={16} /> Volver al catálogo
      </button>

      {/* Bloque Superior: Galería y Compra */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3rem', backgroundColor: '#ffffff', padding: '2rem', borderRadius: '1rem', border: '1px solid #e2e8f0', marginBottom: '2.5rem' }}>
        
        {/* Imagen */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8fafc', borderRadius: '0.75rem', overflow: 'hidden', minHeight: '360px' }}>
          <img 
            src={product.image} 
            alt={product.name} 
            style={{ maxWidth: '100%', maxHeight: '400px', objectFit: 'contain' }}
          />
        </div>

        {/* Detalles de Compra */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#2563eb', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
            {product.category}
          </span>
          <h1 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#0f172a', margin: '0 0 0.8rem 0' }}>
            {product.name}
          </h1>

          {/* Calificación y Compras */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.2rem', paddingBottom: '1rem', borderBottom: '1px solid #f1f5f9' }}>
            <div style={{ display: 'flex', alignItems: 'center', color: '#eab308' }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Star 
                  key={star} 
                  size={18} 
                  fill={star <= Math.round(product.rating) ? '#eab308' : 'none'} 
                  color={star <= Math.round(product.rating) ? '#eab308' : '#cbd5e1'} 
                />
              ))}
              <span style={{ fontWeight: 'bold', marginLeft: '0.4rem', color: '#1e293b' }}>{product.rating}</span>
            </div>
            <span style={{ color: '#64748b', fontSize: '0.9rem' }}>
              ({product.reviews?.length || 0} valoraciones)
            </span>
            <span style={{ color: '#94a3b8' }}>•</span>
            <span style={{ color: '#64748b', fontSize: '0.9rem' }}>
              {product.boughtCount || 0} compras realizadas
            </span>
          </div>

          {/* Precio y Stock */}
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
              <span style={{ fontSize: '2.4rem', fontWeight: '800', color: '#0f172a' }}>
                ${product.price.toFixed(2)}
              </span>
              <span style={{ fontSize: '1rem', color: '#64748b' }}>MXN</span>
            </div>
            
            <div style={{ marginTop: '0.5rem' }}>
              {product.stock <= 5 && product.stock > 0 ? (
                <span className="badge badge-warning" style={{ fontSize: '0.85rem' }}>
                  ¡Atención! Solo quedan {product.stock} unidades en almacén.
                </span>
              ) : product.stock === 0 ? (
                <span className="badge" style={{ backgroundColor: '#fee2e2', color: '#991b1b', fontSize: '0.85rem' }}>
                  Producto temporalmente agotado
                </span>
              ) : (
                <span className="badge badge-success" style={{ fontSize: '0.85rem' }}>
                  Disponible en almacén ({product.stock} unidades)
                </span>
              )}
            </div>
          </div>

          <p style={{ color: '#475569', fontSize: '1rem', lineHeight: '1.6', marginBottom: '2rem' }}>
            {product.description}
          </p>

          {/* Selector de cantidad y botones */}
          {product.stock > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: 'auto' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{ fontWeight: '600', color: '#334155' }}>Cantidad:</span>
                <select 
                  value={quantity} 
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  style={{ padding: '0.5rem 1rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', fontSize: '1rem', cursor: 'pointer' }}
                >
                  {[...Array(Math.min(product.stock, 10))].map((_, i) => (
                    <option key={i + 1} value={i + 1}>{i + 1} unidad{i > 0 ? 'es' : ''}</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <button 
                  onClick={handleAddToCart}
                  className="btn-secondary"
                  style={{ flex: 1, padding: '0.8rem 1.2rem', fontSize: '1rem' }}
                >
                  <ShoppingCart size={18} /> Agregar al carrito
                </button>

                <button 
                  onClick={handleBuyNow}
                  className="btn-primary"
                  style={{ flex: 1, padding: '0.8rem 1.2rem', fontSize: '1rem' }}
                >
                  Comprar Ahora
                </button>

                <button 
                  onClick={() => {
                    if (!isAuthenticated) {
                      alert('Debes iniciar sesión para guardar productos en favoritos.');
                      onRequireLogin();
                      return;
                    }
                    toggleFavorite(product.id);
                  }}
                  className="btn-secondary"
                  style={{ padding: '0.8rem' }}
                  title="Marcar como Favorito"
                >
                  <Heart size={20} color={favorite ? '#ef4444' : '#64748b'} fill={favorite ? '#ef4444' : 'none'} />
                </button>
              </div>
            </div>
          ) : (
            <div style={{ padding: '1rem', backgroundColor: '#fef2f2', borderRadius: '0.5rem', color: '#991b1b', fontSize: '0.95rem' }}>
              Este producto no tiene existencias disponibles en este momento.
            </div>
          )}

        </div>
      </div>

      {/* Bloque Inferior: Pestañas de Valoraciones y Dudas al Proveedor */}
      <div style={{ backgroundColor: '#ffffff', borderRadius: '1rem', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
        
        {/* Encabezado de pestañas */}
        <div style={{ display: 'flex', borderBottom: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
          <button 
            onClick={() => setActiveTab('reviews')}
            style={{ 
              flex: 1, padding: '1rem', border: 'none', background: activeTab === 'reviews' ? '#ffffff' : 'transparent',
              fontWeight: '600', color: activeTab === 'reviews' ? '#2563eb' : '#64748b', cursor: 'pointer',
              borderBottom: activeTab === 'reviews' ? '2px solid #2563eb' : 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem'
            }}
          >
            <Star size={18} /> Valoraciones y Comentarios ({product.reviews?.length || 0})
          </button>
          
          <button 
            onClick={() => setActiveTab('faqs')}
            style={{ 
              flex: 1, padding: '1rem', border: 'none', background: activeTab === 'faqs' ? '#ffffff' : 'transparent',
              fontWeight: '600', color: activeTab === 'faqs' ? '#2563eb' : '#64748b', cursor: 'pointer',
              borderBottom: activeTab === 'faqs' ? '2px solid #2563eb' : 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem'
            }}
          >
            <HelpCircle size={18} /> Dudas y Preguntas al Proveedor ({product.faqs?.length || 0})
          </button>
        </div>

        {/* Contenido de Valoraciones */}
        {activeTab === 'reviews' && (
          <div style={{ padding: '2rem' }}>
            
            {/* Formulario para añadir valoración */}
            <div style={{ backgroundColor: '#f8fafc', padding: '1.5rem', borderRadius: '0.75rem', marginBottom: '2rem', border: '1px solid #e2e8f0' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', margin: '0 0 1rem 0', color: '#1e293b' }}>
                Deja tu valoración del producto
              </h3>

              {reviewSent && (
                <div style={{ padding: '0.75rem', backgroundColor: '#dcfce7', color: '#15803d', borderRadius: '0.5rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
                  <CheckCircle2 size={16} /> ¡Muchas gracias! Tu reseña ha sido publicada exitosamente.
                </div>
              )}

              <form onSubmit={handleSubmitReview}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: '500', color: '#475569' }}>Calificación:</span>
                  <div style={{ display: 'flex', gap: '0.25rem' }}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button 
                        type="button" 
                        key={star} 
                        onClick={() => setNewRating(star)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                      >
                        <Star size={22} fill={star <= newRating ? '#eab308' : 'none'} color={star <= newRating ? '#eab308' : '#cbd5e1'} />
                      </button>
                    ))}
                  </div>
                  <span style={{ fontWeight: 'bold', color: '#1e293b', marginLeft: '0.5rem' }}>{newRating} / 5</span>
                </div>

                <textarea 
                  rows={3} 
                  required
                  placeholder="Escribe tu opinión sobre el producto (calidad, tiempo de entrega, experiencia)..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', fontSize: '0.95rem', marginBottom: '1rem', resize: 'vertical' }}
                />

                <button type="submit" className="btn-primary" style={{ fontSize: '0.9rem' }}>
                  <Send size={16} /> Publicar Valoración
                </button>
              </form>
            </div>

            {/* Listado de Reseñas */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {product.reviews && product.reviews.length > 0 ? (
                product.reviews.map((rev) => (
                  <div key={rev.id} style={{ padding: '1.25rem', border: '1px solid #e2e8f0', borderRadius: '0.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <span style={{ fontWeight: 'bold', color: '#1e293b' }}>{rev.user}</span>
                      <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>{rev.date}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginBottom: '0.5rem' }}>
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} size={14} fill={s <= rev.rating ? '#eab308' : 'none'} color={s <= rev.rating ? '#eab308' : '#cbd5e1'} />
                      ))}
                    </div>
                    <p style={{ margin: 0, color: '#334155', fontSize: '0.95rem' }}>{rev.comment}</p>
                  </div>
                ))
              ) : (
                <p style={{ color: '#64748b', textAlign: 'center', padding: '2rem 0' }}>Aún no hay valoraciones. ¡Sé el primero en calificar este producto!</p>
              )}
            </div>

          </div>
        )}

        {/* Contenido de Dudas / Preguntas al Proveedor */}
        {activeTab === 'faqs' && (
          <div style={{ padding: '2rem' }}>
            
            {/* Formulario para enviar duda al proveedor */}
            <div style={{ backgroundColor: '#f8fafc', padding: '1.5rem', borderRadius: '0.75rem', marginBottom: '2rem', border: '1px solid #e2e8f0' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', margin: '0 0 0.5rem 0', color: '#1e293b' }}>
                ¿Tienes alguna duda sobre este producto?
              </h3>
              <p style={{ color: '#64748b', fontSize: '0.9rem', margin: '0 0 1rem 0' }}>
                Envía tu pregunta al proveedor y el equipo de soporte te responderá directamente.
              </p>

              {questionSent && (
                <div style={{ padding: '0.75rem', backgroundColor: '#dcfce7', color: '#15803d', borderRadius: '0.5rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
                  <CheckCircle2 size={16} /> Pregunta enviada al proveedor. Recibirás respuesta pronto.
                </div>
              )}

              <form onSubmit={handleSubmitQuestion}>
                <textarea 
                  rows={2} 
                  required
                  placeholder="Ej: ¿Es compatible con cargador inalámbrico de 15W? ¿Tienen en color negro?"
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', fontSize: '0.95rem', marginBottom: '1rem', resize: 'vertical' }}
                />

                <button type="submit" className="btn-primary" style={{ fontSize: '0.9rem' }}>
                  <MessageCircle size={16} /> Enviar Pregunta al Proveedor
                </button>
              </form>
            </div>

            {/* Listado de Preguntas Frecuentes / Dudas */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {product.faqs && product.faqs.length > 0 ? (
                product.faqs.map((faq, idx) => (
                  <div key={idx} style={{ padding: '1.25rem', border: '1px solid #e2e8f0', borderRadius: '0.5rem', backgroundColor: '#ffffff' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '600', color: '#1e293b', marginBottom: '0.5rem' }}>
                      <HelpCircle size={18} color="#2563eb" />
                      <span>{faq.question}</span>
                    </div>
                    <div style={{ paddingLeft: '1.75rem', color: '#475569', fontSize: '0.95rem', lineHeight: '1.5' }}>
                      {faq.answer}
                    </div>
                  </div>
                ))
              ) : (
                <p style={{ color: '#64748b', textAlign: 'center', padding: '2rem 0' }}>No hay preguntas registradas aún.</p>
              )}
            </div>

          </div>
        )}

      </div>

    </div>
  );
};
