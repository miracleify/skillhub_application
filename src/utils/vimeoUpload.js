export async function uploadVideoToVimeo(file, title, description) {
  const accessToken = process.env.REACT_APP_VIMEO_ACCESS_TOKEN;

  const formData = new FormData();
  formData.append("file_data", file);
  formData.append("name", title);
  formData.append("description", description);

  const response = await fetch("https://api.vimeo.com/me/videos", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/vnd.vimeo.*+json;version=3.4",
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Vimeo upload failed: " + (await response.text()));
  }

  return await response.json();
}