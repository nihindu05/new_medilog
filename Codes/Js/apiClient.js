(function () {
  const isLocalFrontend =
    ["127.0.0.1", "localhost"].includes(window.location.hostname) &&
    window.location.port !== "5000";
  const API_BASE_URL =
    window.MEDLOGS_API_URL ||
    (window.location.protocol === "file:" || isLocalFrontend
      ? "http://127.0.0.1:5000/api"
      : `${window.location.origin}/api`);

  const SESSION_KEY = "medlogs_session";

  function getSession() {
    try {
      return JSON.parse(sessionStorage.getItem(SESSION_KEY) || "null");
    } catch {
      return null;
    }
  }

  function setSession(session) {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
    sessionStorage.setItem("user", JSON.stringify(session.user));
    sessionStorage.setItem("currentUser", JSON.stringify(session.user));
  }

  function clearSession() {
    sessionStorage.removeItem(SESSION_KEY);
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("currentUser");
    localStorage.removeItem("user");
    localStorage.removeItem("currentUser");
  }

  async function request(path, options = {}) {
    const session = getSession();
    const headers = new Headers(options.headers || {});
    if (options.body && !headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }
    if (session?.accessToken) {
      headers.set("Authorization", `Bearer ${session.accessToken}`);
    }

    const response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers,
    });
    const payload = await response.json().catch(() => ({}));
    if (response.status === 401) {
      clearSession();
      if (!window.location.pathname.endsWith("/auth.html")) {
        window.location.href = "auth.html";
      }
    }
    if (!response.ok) {
      throw new Error(payload.message || payload.error || `Request failed (${response.status})`);
    }
    return payload;
  }

  window.MedLogsAPI = {
    baseUrl: API_BASE_URL,
    getSession,
    setSession,
    clearSession,
    request,
    get: path => request(path),
    post: (path, data) => request(path, {
      method: "POST",
      body: JSON.stringify(data),
    }),
    patch: (path, data) => request(path, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
  };

  if (!window.location.pathname.endsWith("/auth.html") && !getSession()) {
    window.location.replace("auth.html");
  }
})();
