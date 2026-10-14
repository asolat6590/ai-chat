import { ChatWidget } from './components/ChatWidget/ChatWidget.jsx';

function App() {
  return (
    <>
      <header className="demo-header">
        <div className="demo-header__inner">
          <span className="demo-logo">BeautyLine</span>
          <nav className="demo-nav" aria-label="Основное меню">
            <a href="#catalog">Каталог</a>
            <a href="#care">Уход</a>
            <a href="#contact">Контакты</a>
          </nav>
        </div>
      </header>

      <main className="demo-main">
        <section className="demo-hero">
          <h1>Косметика и уход с умным консультантом</h1>
          <p>
            Демо-магазин с чатом в стиле Jivo: ассистент отвечает на вопросы о
            косметике, а по остальным темам направляет к продавцу по телефону.
          </p>
          <a className="demo-cta" href="#catalog">Смотреть каталог</a>
        </section>

        <section id="catalog" className="demo-section">
          <h2>Каталог</h2>
          <ul className="demo-cards">
            <li>
              <img
                className="demo-cards__image"
                src="/catalog/face-care.png?v=3"
                alt="Уход за лицом — маска и уход"
                width={400}
                height={240}
                loading="lazy"
              />
              <h3>Уход за лицом</h3>
              <p>Очищение, сыворотки, кремы и SPF для разных типов кожи.</p>
            </li>
            <li>
              <img
                className="demo-cards__image"
                src="/catalog/hair-care.png?v=1"
                alt="Волосы — уход и блеск"
                width={400}
                height={240}
                loading="lazy"
              />
              <h3>Волосы</h3>
              <p>Шампуни, маски и уход для окрашенных и повреждённых волос.</p>
            </li>
            <li>
              <h3>Макияж</h3>
              <p>Тон, румяна, помады — подбор по типу кожи и финишу.</p>
            </li>
          </ul>
        </section>

        <section id="care" className="demo-section demo-section--muted">
          <h2>Консультация в чате</h2>
          <p>
            Спросите про состав, сочетание активов или подбор ухода — ответит
            Gemini-консультант. Вопросы про оплату, доставку и заказы — по
            телефону продавца.
          </p>
        </section>

        <section id="contact" className="demo-section">
          <h2>Контакты</h2>
          <p>
            Продавец: <a href="tel:+78005551234">+7 (800) 555-12-34</a> ·
            Ежедневно 10:00–20:00
          </p>
        </section>
      </main>

      <footer className="demo-footer">
        <p>© 2026 BeautyLine Demo. Учебный проект.</p>
      </footer>

      <ChatWidget />
    </>
  );
}

export default App;
