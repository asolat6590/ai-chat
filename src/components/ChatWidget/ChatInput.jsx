import { useEffect, useRef, useState } from 'react';

function createRecognition() {
  const Ctor = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!Ctor) return null;
  const recognition = new Ctor();
  recognition.lang = 'ru-RU';
  recognition.interimResults = true;
  recognition.continuous = false;
  return recognition;
}

export function ChatInput({ onSend, disabled }) {
  const [value, setValue] = useState('');
  const [listening, setListening] = useState(false);
  const [voiceHint, setVoiceHint] = useState('');
  const textareaRef = useRef(null);
  const recognitionRef = useRef(null);
  const transcriptRef = useRef('');
  const voiceSupported = typeof window !== 'undefined'
    && Boolean(window.SpeechRecognition || window.webkitSpeechRecognition);

  const submitText = (text) => {
    const trimmed = text.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue('');
    textareaRef.current?.focus();
  };

  const submit = () => submitText(value);

  useEffect(() => {
    return () => {
      recognitionRef.current?.abort();
    };
  }, []);

  useEffect(() => {
    if (disabled && listening) {
      recognitionRef.current?.stop();
    }
  }, [disabled, listening]);

  const toggleVoice = () => {
    if (disabled) return;
    if (!voiceSupported) {
      setVoiceHint('Голосовой ввод доступен в Chrome или Edge.');
      return;
    }

    if (listening) {
      recognitionRef.current?.stop();
      return;
    }

    const recognition = createRecognition();
    recognitionRef.current = recognition;
    transcriptRef.current = '';
    setVoiceHint('');
    setListening(true);

    recognition.onresult = (event) => {
      let text = '';
      for (let i = 0; i < event.results.length; i += 1) {
        text += event.results[i][0].transcript;
      }
      transcriptRef.current = text;
      setValue(text);
    };

    recognition.onerror = (event) => {
      if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
        setVoiceHint('Разрешите доступ к микрофону, чтобы отправить запрос голосом.');
      } else if (event.error === 'no-speech') {
        setVoiceHint('Речь не распознана. Нажмите микрофон и повторите запрос.');
      } else if (event.error !== 'aborted') {
        setVoiceHint('Не удалось распознать речь. Попробуйте ещё раз.');
      }
    };

    recognition.onend = () => {
      setListening(false);
      const spoken = transcriptRef.current.trim();
      transcriptRef.current = '';
      if (spoken) submitText(spoken);
    };

    try {
      recognition.start();
    } catch {
      setListening(false);
      setVoiceHint('Не удалось включить микрофон. Попробуйте ещё раз.');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  return (
    <div className="chat-input-wrap">
    <div className="chat-input">
      <button
        type="button"
        className={`chat-input__mic ${listening ? 'chat-input__mic--listening' : ''}`}
        disabled={disabled}
        onClick={toggleVoice}
        aria-pressed={listening}
        aria-label={listening ? 'Остановить запись' : 'Сказать запрос голосом'}
        title={voiceSupported ? 'Голосовой запрос' : 'Голос поддерживается в Chrome и Edge'}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M12 14a3 3 0 003-3V6a3 3 0 10-6 0v5a3 3 0 003 3z"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path
            d="M19 11a7 7 0 01-14 0M12 18v3"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </button>
      <textarea
        ref={textareaRef}
        className="chat-input__field"
        placeholder={listening ? 'Слушаю…' : 'Введите сообщение или скажите его…'}
        rows={1}
        value={value}
        disabled={disabled}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        aria-label="Сообщение"
      />
      <button
        type="button"
        className="chat-input__send"
        disabled={disabled || !value.trim()}
        onClick={submit}
        aria-label="Отправить"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M5 12h14M13 6l6 6-6 6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
    {voiceHint && <p className="chat-input__hint">{voiceHint}</p>}
    </div>
  );
}
