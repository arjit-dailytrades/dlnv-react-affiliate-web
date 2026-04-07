export const logout = (navigate?: any) => {
  try {
    localStorage.removeItem("t");
    localStorage.removeItem("r");

    // Optional: clear everything
    localStorage.clear();

    // Redirect
    if (navigate) {
      navigate("/login");
    } else {
      window.location.href = "/login";
    }
  } catch (error) {
    console.error("Logout error:", error);
  }
};
