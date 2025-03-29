import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaCheckCircle, FaPaperPlane } from "react-icons/fa";
import { BASE_URL } from "../../../Utils/config";

const ChatBox = () => {
  const token = localStorage.getItem("access_token");
  const [data, setData] = useState(null);
  const [selectedChatId, setSelectedChat] = useState(1);

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

  const params = new URLSearchParams({
    page: 1,
    size: 10,
    sortBy: "id",
    direction: "ASC",
    chatRoomId: 1,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
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
      setData(result);
    } catch (error) {
      console.error("Lỗi khi fetch dữ liệu:", error);
    }
  };

  const selectedChat = data?.content?.find(
    (chat) => chat.id === selectedChatId
  );

  return (
    <div className="container p-3" style={{ backgroundColor: "#f8f9fa" }}>
      <div className="row mt-2">
        <div className="col-md-4">
          {data?.content?.map((d) => (
            <div className="list-group mb-1" key={d.id}>
              <div
                key={d.id}
                className={`list-group-item d-flex align-items-center ${
                  selectedChat === d.id ? "selected-chat" : ""
                }`}
                style={{
                  cursor: "pointer",
                  backgroundColor: selectedChat === d.id ? "#d0ebff" : "",
                  color: selectedChat === d.id ? "#fff" : "#000",
                }}
                onClick={() => setSelectedChat(d.id)}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#e9ecef")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor =
                    selectedChat === d.id ? "#d0ebff" : "")
                }
              >
                <img
                  src="https://via.placeholder.com/40"
                  alt="avatar"
                  className="rounded-circle me-2"
                />
                <div className="flex-grow-1">
                  <strong>{d?.sender?.name}</strong>{" "}
                  <FaCheckCircle className="text-danger" />
                  <p
                    className="text-muted mb-0 text-truncate"
                    style={{
                      display: "-webkit-box",
                      WebkitBoxOrient: "vertical",
                      WebkitLineClamp: 1,
                      overflow: "hidden",
                    }}
                  >
                    {d.content}...
                  </p>
                </div>
                <small className="text-muted">
                  {formatTimestamp(d.timestamp)}
                </small>
              </div>
            </div>
          ))}
        </div>

        <div className="col-md-8">
          {selectedChat ? (
            <div className="card">
              <div className="card-header bg-white d-flex align-items-center">
                <img
                  src="https://via.placeholder.com/40"
                  alt="avatar"
                  className="rounded-circle me-2"
                />
                <div>
                  <strong>{selectedChat?.sender?.name}</strong>{" "}
                  <FaCheckCircle className="text-danger" />
                </div>
              </div>
              <div
                className="card-body"
                style={{ height: "450px", overflowY: "auto" }}
              >
                {/* Tin nhắn đi */}
                <div className="d-flex flex-column">
                  <div
                    className="align-self-start bg-light p-2 rounded mb-2"
                    style={{ maxWidth: "75%" }}
                  >
                    <p className="mb-0">{selectedChat?.content}</p>
                    <small className="text-muted">
                      {formatTimestamp(selectedChat?.timestamp)}
                    </small>
                  </div>
                </div>

                {/* Tin nhắn phản hồi */}
                <div className="d-flex flex-column">
                  <div
                    className="align-self-end bg-primary text-white p-2 rounded mb-2"
                    style={{ maxWidth: "75%" }}
                  >
                    <p className="mb-0">
                      Cảm ơn bạn! Mình sẽ liên hệ nếu cần hỗ trợ thêm.
                    </p>
                    <small className="text-light">
                      {formatTimestamp(selectedChat.timestamp)}
                    </small>
                  </div>
                </div>
              </div>

              <div className="card-footer d-flex align-items-center">
                <input
                  type="text"
                  className="form-control me-2"
                  placeholder="Type a message"
                />
                <button className="btn btn-primary">
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
  );
};

export default ChatBox;
