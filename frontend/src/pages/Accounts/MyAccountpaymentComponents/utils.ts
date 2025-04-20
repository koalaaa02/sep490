export const showNotification = (
  setNotification,
  message,
  type = "success"
) => {
  setNotification({ message, type });
  setTimeout(() => setNotification(null), 3000);
};

export const uploadCertificate = async (shopId, file, token, BASE_URL) => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await fetch(
      `${BASE_URL}/api/provider/shops/${shopId}/uploadRegistrationCertificate`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    );

    if (!response.ok) throw new Error(`Lỗi: ${response.status}`);

    return await response.json();
  } catch (error) {
    console.error("Lỗi khi upload giấy phép:", error);
    throw error;
  }
};
