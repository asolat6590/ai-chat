import { useMemo, useState } from 'react';
import { useChat } from '../../hooks/useChat.js';
import { MOCK_AGENT } from '../../mocks/agent.mock.js';
import { ChatLauncher } from './ChatLauncher.jsx';
import { ChatPanel } from './ChatPanel.jsx';
import './chat-widget.css';

export function ChatWidget({ agent = MOCK_AGENT }) {
  const [isOpen, setIsOpen] = useState(false);
  const [hasClickedLauncher, setHasClickedLauncher] = useState(false);
  const { messages, isLoading, isTyping, sendUserMessage } = useChat();

  const showQuickReplies = useMemo(
    () => !isLoading && messages.length <= 3,
    [isLoading, messages.length],
  );

  const handleLauncherClick = () => {
    setHasClickedLauncher(true);
    setIsOpen((v) => !v);
  };
  const handleClose = () => setIsOpen(false);
  const handleMinimize = () => setIsOpen(false);

  return (
    <div className="chat-widget">
      {isOpen && (
        <ChatPanel
          agent={agent}
          messages={messages}
          isLoading={isLoading}
          isTyping={isTyping}
          onSend={sendUserMessage}
          onMinimize={handleMinimize}
          onClose={handleClose}
          showQuickReplies={showQuickReplies}
        />
      )}
      <ChatLauncher
        isOpen={isOpen}
        onClick={handleLauncherClick}
        attentionPulse={!hasClickedLauncher}
      />
    </div>
  );
}
