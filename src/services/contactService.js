import axios from "axios";

export const sendContactUs = async (formData) => {
  try {
    const response = await axios.post(
      "http://localhost:4000/api/contactUs/send",
      formData,
      { headers: { "Content-Type": "application/json" } }
    );
    return response.data;
  } catch (err) {
    throw new Error(
      err.response?.data?.message || "Failed to send contact message."
    );
  }
};