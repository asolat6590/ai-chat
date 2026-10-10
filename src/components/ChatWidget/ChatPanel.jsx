import { ChatHeader } from './ChatHeader.jsx';
import { ChatInput } from './ChatInput.jsx';
import { MessageList } from './MessageList.jsx';
import { QuickReplies } from './QuickReplies.jsx';
import { MOCK_QUICK_REPLIES } from '../../mocks/quickReplies.mock.js';

export function ChatPanel({
  agent,
  messages,
  isLoading,
  isTyping,
  onSend,
  onMinimize,
  onClose,
  showQuickReplies,
}) {
  const inputDisabled = isLoading || isTyping;

  return (
    <div className="chat-panel" role="dialog" aria-label="Чат с ассистентом">
      <ChatHeader agent={agent} onMinimize={onMinimize} onClose={onClose} />
      <MessageList
        messages={messages}
        agent={agent}
        isLoading={isLoading}
        isTyping={isTyping}
      />
      {showQuickReplies && (
        <QuickReplies
          replies={MOCK_QUICK_REPLIES}
          onSelect={onSend}
          disabled={inputDisabled}
        />
      )}
      <ChatInput onSend={onSend} disabled={inputDisabled} />
    </div>
  );
}
