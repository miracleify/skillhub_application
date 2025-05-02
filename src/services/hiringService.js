import axios from "axios";

export const hireService = async (payload) => {
  try {
    const response = await axios.post(
      "https://skillhub-api-y3gi.onrender.com/api/hiring/hire",
      payload,
      { headers: { "Content-Type": "application/json" } }
    );
    if (response.status === 200 || response.status === 201) {
      return response;
    } else {
      throw new Error(response.data.message || "Submission failed.");
    }
  } catch (err) {
    throw new Error(
      err.response?.data?.message || "Network error. Please try again."
    );
  }
};

