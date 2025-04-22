import axios from "axios";

export const signInUser = async (formData) => {
  try {
    const response = await axios.post(
      "https://skillhub-api-y3gi.onrender.com/api/auth/signin",
      formData,
      { headers: { "Content-Type": "application/json" } }
    );
    if (response.status === 200) {
      return response;
    } else {
      throw new Error(response.data.message || "Login failed.");
    }
  } catch (err) {
    throw new Error(err.response?.data?.message || "Network error.");
  }
};
