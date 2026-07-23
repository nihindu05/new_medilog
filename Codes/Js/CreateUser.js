document.addEventListener("DOMContentLoaded", () => {
  lucide.createIcons();

  const form = document.getElementById("createUserForm");
  const roleSelect = document.getElementById("roleSelect");
  const generatedId = document.getElementById("generatedId");
  const username = document.getElementById("username");
  const licenseBox = document.getElementById("licenseBox");
  const message = document.getElementById("formMessage");
  const submitButton = form.querySelector('button[type="submit"]');
  const prefixes = {
    JMO: "J",
    ASSISTANT_JMO: "AJ",
    DOCTOR: "D",
    LAB: "L",
    CLERK: "C"
  };

  roleSelect.addEventListener("change", () => {
    const prefix = prefixes[roleSelect.value];
    generatedId.value = prefix
      ? prefix + (Math.floor(Math.random() * 9000) + 1000)
      : "";
    if (!username.value) username.value = generatedId.value.toLowerCase();
    licenseBox.style.display = ["JMO", "ASSISTANT_JMO", "DOCTOR"]
      .includes(roleSelect.value) ? "flex" : "none";
  });

  form.addEventListener("submit", async event => {
    event.preventDefault();
    message.textContent = "";
    submitButton.disabled = true;
    try {
      const result = await window.MedLogsAPI.post("/admin/users", {
        role: roleSelect.value,
        fullName: document.getElementById("fullName").value.trim(),
        email: document.getElementById("email").value.trim(),
        status: document.getElementById("status").value,
        licenseNumber: document.getElementById("licenseNumber").value.trim(),
        username: username.value.trim(),
        password: document.getElementById("password").value
      });
      message.textContent = result.message;
      form.reset();
      generatedId.value = "";
      setTimeout(() => window.location.href = "UserManagement.html", 900);
    } catch (error) {
      message.textContent = error.message;
    } finally {
      submitButton.disabled = false;
    }
  });
});
