import React, { useRef, useState } from "react";
import { Send } from "react-feather";

import robotIcon from "./robot.png";

import styles from "./App.module.css";

function App() {
  const lastMsg = useRef();

  const [messageText, setMessageText] = useState("");
  const [messages, setMessages] = useState([
    {
      from: "ai",
      text: "Hi there! I'm you AI assistant, I'm here to help you out with your questions. Ask me anything you want.",
    },
  ]);
  const [processing, setProcessing] = useState(false);

  const handleSubmission = async () => {
    if (!messageText.trim() || processing) return;

    const tempMessages = [
      ...messages,
      {
        from: "human",
        text: messageText,
      },
    ];
    setMessages(tempMessages);
    setMessageText("");

    setTimeout(() =>
      lastMsg.current.scrollIntoView({
        behavior: "smooth",
      })
    );
    try {
      setProcessing(true);
      const res = await fetch(`http://localhost:5000/chat`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          messages: tempMessages.slice(-6),
        }),
      });
      setProcessing(false);

      const data = await res.json();
      const ans = data.data;

      setMessages((prev) => [
        ...prev,
        {
          from: "ai",
          text: ans,
        },
      ]);
    } catch (err) {
      const error = "Error processing this message, please try in sometime.";
      setMessages((prev) => [
        ...prev,
        {
          from: "ai",
          text: error,
        },
      ]);
    }

    setTimeout(() =>
      lastMsg.current.scrollIntoView({
        behavior: "smooth",
      })
    );
  };

  return (
    <div className={styles.app}>
      <div className={styles.header}>
        <div className={styles.left}>
          <div className={styles.image}>
            <img src={robotIcon} alt="AI" />
          </div>
          <p>AI Assistant</p>
        </div>
      </div>

      <div className={styles.body}>
        {messages.map((msg, index) => (
          <div
            className={`${styles.message} ${
              msg.from == "ai" ? styles.mLeft : styles.mRight
            }`}
            key={index}
          >
            {msg.from == "ai" ? (
              <div>
                <div className={styles.image}>
                  <img src={robotIcon} alt="AI" />
                </div>
              </div>
            ) : (
              ""
            )}
            <p className={styles.text}>{msg.text}</p>
          </div>
        ))}

        {processing ? (
          <div className={styles.typing}>
            <div className={styles.dot} />
            <div className={styles.dot} />
            <div className={styles.dot} />
          </div>
        ) : (
          ""
        )}

        <div ref={lastMsg} />
      </div>

      <div className={styles.footer}>
        <input
          placeholder="Type here..."
          value={messageText}
          onChange={(event) => setMessageText(event.target.value)}
          onKeyUp={(event) => (event.key === "Enter" ? handleSubmission() : "")}
        />

        <div className={styles.btn} onClick={handleSubmission}>
          <div className={styles.icon}>
            <Send />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
