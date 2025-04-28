import "bootstrap/dist/css/bootstrap.min.css";
import { FaCommentDots } from "react-icons/fa";
import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaCheckCircle, FaPaperPlane } from "react-icons/fa";
import { BASE_URL } from "../../Utils/config";
import { useSelector } from "react-redux";
import img from "../../images/member6.jpg";

const ChatBox = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const token = sessionStorage.getItem("access_token");
  const [data, setData] = useState(null);
  const [selectedChatId, setSelectedChat] = useState(null);
  const userId = useSelector((state) => state?.auth?.user?.uid);
  const [messages, setMessages] = useState([]);
  const [selectedShop, setSelectedShop] = useState(null);
  const [messageContent, setMessageContent] = useState("");

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const messageDate = new Date(timestamp);
    const diffInHours = (now - messageDate) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return messageDate.toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else {
      return messageDate.toLocaleDateString("vi-VN");
    }
  };

  const fetchData = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}/api/chat/rooms/buyer/${userId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );
      const result = await response.json();
      setData(result);
      if (result.length > 0) {
        setSelectedChat(result[0].id);
      }
    } catch (error) {
      console.error("Lỗi khi fetch dữ liệu:", error);
    }
  };

  const fetchMessages = async () => {
    try {
      const params = new URLSearchParams({
        page: 1,
        size: 100,
        sortBy: "id",
        direction: "ASC",
        chatRoomId: selectedChatId,
      });

      const response = await fetch(
        `${BASE_URL}/api/chat/messages/?${params.toString()}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      const result = await response.json();
      setMessages(result.content);
    } catch (error) {
      console.error("Lỗi khi fetch tin nhắn:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedChatId) {
      fetchMessages(selectedChatId);
    }
  }, [selectedChatId]);

  const handleSendMessage = async () => {
    if (!messageContent.trim()) return;

    const newMessage = {
      id: Date.now(),
      content: messageContent,
      sender: { id: userId },
      timestamp: new Date().toISOString(),
    };

    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setMessageContent("");

    const param = new URLSearchParams({
      content: messageContent,
      messageType: "TEXT",
      status: "SENT",
      chatRoomId: selectedChatId,
      id: 0,
    });

    try {
      const response = await fetch(
        `${BASE_URL}/api/chat/messages/send?${param.toString()}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        console.error("Gửi tin nhắn thất bại");
        setMessages((prevMessages) =>
          prevMessages.filter((msg) => msg.id !== newMessage.id)
        );
      }
    } catch (error) {
      console.error("Lỗi khi gửi tin nhắn:", error);
    }
  };

  return (
    <div>
      {!isChatOpen && (
        <button
          className="border border-black rounded px-4 py-2 flex items-center gap-2 text-muted"
          onClick={() => setIsChatOpen(!isChatOpen)}
          style={{ backgroundColor: "transparent" }}
        >
          <FaCommentDots size={16} className="me-2" />
          Nhắn tin
        </button>
      )}
      {isChatOpen && (
        <div className="chat" style={{ backgroundColor: "#f8f9fa" }}>
          <div className="d-flex justify-content-between align-items-center p-2">
            <strong>Chat với người bán</strong>
            <button
              className="btn btn-danger btn-sm"
              onClick={() => setIsChatOpen(false)}
            >
              X
            </button>
          </div>

          <div className="row mt-2">
            <div
              className="col-md-4"
              style={{ height: "380px", overflowY: "auto" }}
            >
              {data?.map((d) => (
                <div className="list-group mb-1" key={d.id}>
                  <div
                    key={d.id}
                    className={`list-group-item d-flex align-items-center ${
                      selectedChatId === d.id ? "selected-chat" : ""
                    }`}
                    style={{
                      cursor: "pointer",
                      backgroundColor: selectedChatId === d.id ? "#d0ebff" : "",
                      color: selectedChatId === d.id ? "#fff" : "#000",
                    }}
                    onClick={() => {
                      setSelectedShop(d?.shop?.name);
                      setSelectedChat(d.id);
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = "#e9ecef")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor =
                        selectedChatId === d.id ? "#d0ebff" : "")
                    }
                  >
                    <img
                      src={img}
                      alt="avatar"
                      className="rounded-circle me-2"
                      style={{ height: "50px", width: "50px" }}
                    />
                    <div className="flex-grow-1 d-flex flex-column">
                      <strong className="text-black">{d?.shop?.name}</strong>
                      <small className="text-muted">
                        {formatTimestamp(d.updatedAt)}
                      </small>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="col-md-8">
              {selectedChatId ? (
                <div className="card">
                  <div className="card-header bg-white d-flex align-items-center">
                    <img
                      src="https://via.placeholder.com/40"
                      alt="avatar"
                      className="rounded-circle me-2"
                    />
                    <div>
                      <strong>{selectedShop ? selectedShop : "Shop"}</strong>{" "}
                      <FaCheckCircle className="text-danger" />
                    </div>
                  </div>
                  <div
                    className="card-body"
                    style={{ height: "280px", overflowY: "auto" }}
                  >
                    {messages.map((msg) => (
                      <div key={msg.id} className="d-flex flex-column">
                        <div
                          className={`p-2 rounded mb-2 ${
                            msg.sender.id === userId
                              ? "align-self-end bg-primary text-white"
                              : "align-self-start bg-light"
                          }`}
                          style={{ maxWidth: "75%" }}
                        >
                          <p className="mb-0">{msg.content}</p>
                          <small
                            className={
                              msg.sender.id === userId
                                ? "text-light"
                                : "text-muted"
                            }
                          >
                            {formatTimestamp(msg.timestamp)}
                          </small>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="card-footer d-flex align-items-center">
                    <input
                      type="text"
                      className="form-control me-2"
                      placeholder="Nhập tin nhắn..."
                      value={messageContent}
                      onChange={(e) => setMessageContent(e.target.value)}
                    />
                    <button
                      className="btn btn-primary"
                      onClick={handleSendMessage}
                    >
                      <FaPaperPlane />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center p-5">
                  Chọn một cuộc trò chuyện để xem nội dung
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBox;
