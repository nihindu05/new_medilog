function protectPage(requiredRole) {
  const session = window.MedLogsAPI?.getSession();
  const user = session?.user;
  if (!user) {
    window.location.href = "auth.html";
    return false;
  }
  const required = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
  const roles = user.roles || [user.role].filter(Boolean);
  if (requiredRole && !required.some(role => roles.includes(role))) {
    alert("Access denied. You do not have permission to access this page.");
    window.location.href = "auth.html";
    return false;
  }
  return true;
}

function logout() {
  window.MedLogsAPI?.clearSession();
  window.location.href = "auth.html";
}
