export function QuickReplies({ replies, onSelect, disabled }) {
  if (!replies?.length) return null;

  return (
    <div className="chat-quick-replies" role="group" aria-label="Быстрые ответы">
      {replies.map((label) => (
        <button
          key={label}
          type="button"
          className="chat-quick-replies__chip"
          disabled={disabled}
          onClick={() => onSelect(label)}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
