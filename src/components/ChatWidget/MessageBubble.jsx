import { formatTime } from '../../utils/formatTime.js';

export function MessageBubble({ message, agent }) {
  const isUser = message.role === 'user';

  return (
    <div
      className={`chat-message ${isUser ? 'chat-message--user' : 'chat-message--agent'}`}
    >
      {!isUser && (
        <div className="chat-message__avatar" aria-hidden="true">
          {agent.avatarUrl ? (
            <img src={agent.avatarUrl} alt="" />
          ) : (
            <span>{agent.initials}</span>
          )}
        </div>
      )}
      <div className="chat-message__body">
        <div className="chat-message__bubble">{message.text}</div>
        <time className="chat-message__time" dateTime={message.createdAt}>
          {formatTime(message.createdAt)}
        </time>
      </div>
    </div>
  );
}
