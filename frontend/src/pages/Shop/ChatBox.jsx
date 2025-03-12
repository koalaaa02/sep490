import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaCommentDots } from "react-icons/fa";

const ChatBox = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <div className="chat">
      {!isChatOpen && (
        <button
          className="btn rounded-circle p-3 shadow"
          onClick={() => setIsChatOpen(!isChatOpen)}
          style={{ zIndex: 9999 }} 
        >
          <FaCommentDots size={24} />
        </button>
      )}
      {isChatOpen && (
        <div
          className="chat-box border rounded shadow bg-white p-3 mt-2"
          style={{ width: "300px" }}
        >
          <div className="d-flex justify-content-between align-items-center border-bottom pb-2">
            <strong>Chat với người bán</strong>
            <button
              className="btn btn-danger"
              size="sm"
              onClick={() => setIsChatOpen(false)}
            >
              X
            </button>
          </div>
          <div className="mt-2" style={{ height: "200px", overflowY: "auto" }}>
            <p className="text-muted">Chưa có tin nhắn...</p>
          </div>
          <input
            type="text"
            className="form-control mt-2"
            placeholder="Nhập tin nhắn..."
          />
        </div>
      )}
    </div>
  );
};

export default ChatBox;
