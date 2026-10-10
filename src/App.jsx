import { ChatWidget } from './components/ChatWidget/ChatWidget.jsx';

function App() {
  return (
    <>
      <header className="demo-header">
        <div className="demo-header__inner">
          <span className="demo-logo">CloudService</span>
          <nav className="demo-nav" aria-label="Основное меню">
            <a href="#features">Возможности</a>
            <a href="#pricing">Тарифы</a>
            <a href="#contact">Контакты</a>
          </nav>
        </div>
      </header>

      <main className="demo-main">
        <section className="demo-hero">
          <h1>Платформа для вашего бизнеса</h1>
          <p>
            Демо-страница показывает, как на сайт встраивается виджет чата с
            ИИ-ассистентом — в духе Jivo. Нажмите зелёную кнопку в правом нижнем
            углу.
          </p>
          <a className="demo-cta" href="#features">Узнать больше</a>
        </section>

        <section id="features" className="demo-section">
          <h2>Возможности</h2>
          <ul className="demo-cards">
            <li>
              <h3>Быстрый старт</h3>
              <p>Подключение за несколько минут без сложной настройки.</p>
            </li>
            <li>
              <h3>Аналитика</h3>
              <p>Отчёты по обращениям и удовлетворённости клиентов.</p>
            </li>
            <li>
              <h3>Интеграции</h3>
              <p>CRM, почта и мессенджеры в одном окне.</p>
            </li>
          </ul>
        </section>

        <section id="pricing" className="demo-section demo-section--muted">
          <h2>Тарифы</h2>
          <p>
            Спросите ассистента в чате о тарифах — в демо ответы приходят из
            моков, позже их заменит ваш API.
          </p>
        </section>

        <section id="contact" className="demo-section">
          <h2>Контакты</h2>
          <p>support@example-demo.local · Пн–Пт, 9:00–18:00</p>
        </section>
      </main>

      <footer className="demo-footer">
        <p>© 2026 CloudService Demo. Учебный проект.</p>
      </footer>

      <ChatWidget />
    </>
  );
}

export default App;
