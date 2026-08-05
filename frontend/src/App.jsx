import { cleanSpeech } from "./utils/speechCleaner";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const chatEndRef = useRef(null);

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

  useEffect(() => {
    if (transcript) {
      setMessage(cleanSpeech(transcript));
    }
  }, [transcript]);

  const startListening = () => {
    resetTranscript();

    SpeechRecognition.startListening({
      continuous: true,
      language: "en-US",
    });
  };

  const stopListening = () => {
    SpeechRecognition.stopListening();
  };

  const speak = (text) => {
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);

    utterance.lang = "en-US";
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.volume = 1;

    const voices = window.speechSynthesis.getVoices();

    const englishVoice =
      voices.find((v) => v.lang === "en-US") ||
      voices.find((v) => v.lang.startsWith("en")) ||
      voices[0];

    if (englishVoice) {
      utterance.voice = englishVoice;
    }

    window.speechSynthesis.speak(utterance);
  };

  const sendMessage = async () => {
    if (!message.trim() || loading) return;

    const text = cleanSpeech(message);

    setMessages((prev) => [
      ...prev,
      {
        sender: "user",
        text,
      },
    ]);

    setMessage("");
    resetTranscript();
    setLoading(true);

    try {
      const res = await axios.post(
        "http://127.0.0.1:5000/chat",
        {
          message: text,
        }
      );

      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: res.data.reply,
        },
      ]);

      speak(res.data.reply);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "Unable to connect to backend.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!browserSupportsSpeechRecognition) {
    return (
      <h2 style={{ textAlign: "center", marginTop: "40px" }}>
        Speech Recognition is not supported in this browser.
      </h2>
    );
  }

  return (
    <div className="app">
      <div className="chat-container">

        <div className="header">
          🎤 Voice Domain Assistant
        </div>

        <div className="chat-box">

          {messages.map((msg, index) => (
            <div
              key={index}
              className={`message ${msg.sender}`}
            >
              <div className="bubble">
                {msg.text}
              </div>
            </div>
          ))}

          {loading && (
            <div className="message bot">
              <div className="bubble loading">
                🤖 Assistant is typing...
              </div>
            </div>
          )}

          <div ref={chatEndRef}></div>

        </div>

        <div className="input-area">

          <textarea
            rows="2"
            value={message}
            placeholder="Ask anything..."
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
          />

          <div className="buttons">

            {!listening ? (
              <button
                onClick={startListening}
                disabled={loading}
              >
                🎤 Start
              </button>
            ) : (
              <button
                onClick={stopListening}
                disabled={loading}
              >
                ⏹ Stop
              </button>
            )}

            <button
              onClick={sendMessage}
              disabled={loading}
            >
              {loading ? "Thinking..." : "Send"}
            </button>

          </div>

          <p className="status">
            {loading
              ? "Generating response..."
              : listening
              ? "🎙 Listening..."
              : "Microphone Off"}
          </p>

        </div>

      </div>
    </div>
  );
}

export default App;