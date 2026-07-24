document.addEventListener("DOMContentLoaded", async () => {
  document.getElementById("logoutBtn")?.addEventListener("click", () => {
    window.MedLogsAPI.clearSession();
    window.location.replace("auth.html");
  });

  window.lucide?.createIcons();

  const table = document.getElementById("adminUsersTable");
  const escapeHtml = value => String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

  try {
    const [stats, users] = await Promise.all([
      window.MedLogsAPI.get("/admin/stats"),
      window.MedLogsAPI.get("/admin/users")
    ]);

    document.getElementById("totalUsers").textContent = stats.totalUsers;
    document.getElementById("activeStaff").textContent = stats.activeStaff;
    document.getElementById("totalCases").textContent = stats.totalCases;
    document.getElementById("pendingReviews").textContent = stats.pendingReviews;

    table.innerHTML = users.length
      ? users.map(user => `
          <tr>
            <td>${escapeHtml(user.username)}</td>
            <td>${escapeHtml(user.name)}</td>
            <td>${escapeHtml(user.role || "Unassigned")}</td>
            <td><span class="${user.status === "Active" ? "active-status" : ""}">
              ${escapeHtml(user.status)}
            </span></td>
            <td><a class="view-btn" href="UserManagement.html">View</a></td>
          </tr>
        `).join("")
      : '<tr><td colspan="5">No user accounts found.</td></tr>';
  } catch (error) {
    table.innerHTML = `<tr><td colspan="5">${escapeHtml(error.message)}</td></tr>`;
  }
});
