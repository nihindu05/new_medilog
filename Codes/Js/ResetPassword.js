document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("resetForm");
  const message = document.getElementById("resetMessage");
  const params = new URLSearchParams(window.location.hash.slice(1));
  const accessToken = params.get("access_token");
  const errorDescription = params.get("error_description");

  if (!accessToken) {
    message.textContent = errorDescription
      ? errorDescription.replaceAll("+", " ")
      : "Invalid recovery link. Request a new password recovery email.";
    form.querySelector("button").disabled = true;
  }

  form.addEventListener("submit", async event => {
    event.preventDefault();
    const password = document.getElementById("password").value;
    const confirmation = document.getElementById("confirmPassword").value;

    if (password !== confirmation) {
      message.textContent = "The passwords do not match.";
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:5000/api/reset-password", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({accessToken, password})
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message);
      message.textContent = "Password updated. Redirecting to login…";
      setTimeout(() => window.location.href = "auth.html", 1200);
    } catch (error) {
      message.textContent = error.message || "Unable to update the password.";
    }
  });
});
