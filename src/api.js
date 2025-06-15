const BASE_URL = "https://iserver-backend.onrender.com/api/servers";

export async function fetchAllServers() {
  const res = await fetch(BASE_URL);
  return res.json();
}

export async function fetchByRegion(region) {
  const res = await fetch(`${BASE_URL}/region/${region}`);
  return res.json();
}

export async function searchServers(query) {
  const res = await fetch(`${BASE_URL}/search/${query}`);
  return res.json();
}


export const addServer = async (serverData) => {
    const res = await fetch(`${BASE_URL}/add`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(serverData),
    });
    if (!res.ok) throw new Error('Failed to add server');
    return res.json();
  };

  /*export const uploadCSV = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
  
    const res = await fetch(`${BASE_URL}/upload`, {
      method: "POST",
      body: formData,
    });
  
    if (!res.ok) throw new Error("Failed to upload CSV");
    return res.json();
  };*/

  export const uploadCSV = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
  
    const res = await fetch(`${BASE_URL}/upload`, {
      method: "POST",
      body: formData,
    });
  
    if (!res.ok) {
      const errorText = await res.text();
      console.error("Upload error response:", errorText);
      throw new Error("Failed to upload CSV");
    }
  
    return res.json();
  };
  
  