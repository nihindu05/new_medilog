document.addEventListener("DOMContentLoaded", async () => {
  lucide.createIcons();
  const table = document.getElementById("usersTable");
  const escapeHtml = value => String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
  try {
    const users = await window.MedLogsAPI.get("/admin/users");
    table.innerHTML = users.length
      ? users.map(user => `
          <tr>
            <td>${escapeHtml(user.username)}</td>
            <td>${escapeHtml(user.name)}</td>
            <td>${escapeHtml(user.role || "Unassigned")}</td>
            <td><span class="${user.status === "Active" ? "active-status" : ""}">
              ${escapeHtml(user.status)}
            </span></td>
            <td><button class="view-btn" type="button" data-user-id="${user.id}">View</button></td>
          </tr>
        `).join("")
      : '<tr><td colspan="5">No user accounts found.</td></tr>';
  } catch (error) {
    table.innerHTML = `<tr><td colspan="5">${escapeHtml(error.message)}</td></tr>`;
  }
});
