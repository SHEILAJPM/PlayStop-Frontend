const Blog = () => (
  <section id="blog" className="reveal" style={{ scrollMarginTop: '80px', padding: '100px 5%', backgroundColor: '#ffffff', position: 'relative' }}>
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '60px' }}>
        <div className="section-badge" style={{ display: 'inline-block', padding: '6px 16px', background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', borderRadius: '20px', fontWeight: '800', fontSize: '0.85rem', marginBottom: '16px', textTransform: 'uppercase' }}>Novedades</div>
        <h2 style={{ fontSize: '3rem', color: '#0f172a', fontWeight: '900', margin: '0 0 16px 0', letterSpacing: '-1px' }}>Blog PlaySpot</h2>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
        {[
          { title: 'Cómo aumentar los ingresos de tu complejo', img: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=500&q=80', date: '24 Oct, 2023' },
          { title: 'El auge del Pádel en Latinoamérica', img: 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=500&q=80', date: '18 Oct, 2023' },
          { title: 'Nuevas funciones de pago dividido', img: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=500&q=80', date: '12 Oct, 2023' }
        ].map((post, i) => (
          <div key={i} className="cancha-card" onClick={() => document.getElementById('contacto').scrollIntoView()} style={{ backgroundColor: '#ffffff', borderRadius: '24px', border: '1px solid #e2e8f0', overflow: 'hidden', cursor: 'pointer' }}>
            <div style={{ height: '200px', backgroundImage: `url(${post.img})`, backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
            <div style={{ padding: '24px' }}>
              <p style={{ margin: '0 0 8px 0', fontSize: '0.85rem', color: '#64748b', fontWeight: '600' }}>{post.date}</p>
              <h3 style={{ margin: '0 0 16px 0', fontSize: '1.2rem', color: '#0f172a', fontWeight: '800' }}>{post.title}</h3>
              <span style={{ color: '#00d084', fontWeight: '700', fontSize: '0.95rem' }}>Leer artículo →</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Blog;