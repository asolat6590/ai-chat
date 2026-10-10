import { useEffect, useState } from 'react';

const PULSE_INTERVAL_MS = 5000;

function LauncherRipples({ wave }) {
  return (
    <span className="chat-launcher__ripple-host" key={wave} aria-hidden="true">
      <span className="chat-launcher__ripple" />
      <span className="chat-launcher__ripple" />
      <span className="chat-launcher__ripple" />
    </span>
  );
}

export function ChatLauncher({
  isOpen,
  onClick,
  unreadCount = 0,
  attentionPulse = false,
}) {
  const [wave, setWave] = useState(0);
  const showRipples = attentionPulse && !isOpen;

  useEffect(() => {
    if (!showRipples) return undefined;

    const id = window.setInterval(() => {
      setWave((w) => w + 1);
    }, PULSE_INTERVAL_MS);

    return () => window.clearInterval(id);
  }, [showRipples]);

  return (
    <button
      type="button"
      className={`chat-launcher ${isOpen ? 'chat-launcher--open' : ''} ${
        showRipples ? 'chat-launcher--pulse' : ''
      }`}
      onClick={onClick}
      aria-label={isOpen ? 'Закрыть чат' : 'Открыть чат'}
      aria-expanded={isOpen}
    >
      {showRipples && <LauncherRipples wave={wave} />}
      {unreadCount > 0 && !isOpen && (
        <span className="chat-launcher__badge" aria-hidden="true">
          {unreadCount > 9 ? '9+' : unreadCount}
        </span>
      )}
      <span className="chat-launcher__icon" aria-hidden="true">
        {isOpen ? (
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <path
              d="M18 6L6 18M6 6l12 12"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        ) : (
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <path
              d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </span>
    </button>
  );
}
