export function ChatHeader({ agent, onMinimize, onClose }) {
  const statusLabel = agent.status === 'online' ? 'Онлайн' : 'Не в сети';

  return (
    <header className="chat-header">
      <div className="chat-header__info">
        <div className="chat-header__avatar" aria-hidden="true">
          {agent.avatarUrl ? (
            <img src={agent.avatarUrl} alt="" width={40} height={40} />
          ) : (
            <span>{agent.initials}</span>
          )}
        </div>
        <div className="chat-header__text">
          <span className="chat-header__name">{agent.name}</span>
          <span className="chat-header__status">
            <span className="chat-header__status-dot" />
            {statusLabel}
          </span>
        </div>
      </div>
      <div className="chat-header__actions">
        <button
          type="button"
          className="chat-header__btn"
          onClick={onMinimize}
          aria-label="Свернуть чат"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
        <button
          type="button"
          className="chat-header__btn"
          onClick={onClose}
          aria-label="Закрыть чат"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M18 6L6 18M6 6l12 12"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>
    </header>
  );
}
