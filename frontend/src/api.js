const baseURL = "https://assword-backend.simoncrystal.dev/"

export async function APIloginStart(email) {
  const url = baseURL + "login/start?userEmail=" + encodeURIComponent(email);

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Response status: ${response.status}`);
  }
  return response.json();
}

export async function APIloginValidate(email, authKey) {  }  // GET /login/validate
export async function APIsignup(email, salt, authKey) {
    const response = await fetch(baseURL + "signup", {
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ email, salt, authKey }),
    });

    if (! response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }    
    return response.json();
  }
export async function APIcreateEntry(jwt, title, ciphertext, iv) { }  // POST /entry/new
export async function APIgetEntries(jwt) { } 