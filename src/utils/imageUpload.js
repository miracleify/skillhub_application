export const uploadImageToImgbb = async (file) => {
  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.split(",")[1]);
      reader.onerror = (error) => reject(error);
    });

  const base64 = await toBase64(file);

  const form = new FormData();
  form.append("key", "f2acfbbcda824f11f3a15bdd6ffd9414");
  form.append("image", base64);

  const res = await fetch("https://api.imgbb.com/1/upload", {
    method: "POST",
    body: form,
  });

  const data = await res.json();
  if (!data.success) {
    throw new Error("Image upload failed.");
  }

  return data.data.url;
};
