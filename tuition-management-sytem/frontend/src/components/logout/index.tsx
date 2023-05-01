const logout = () => {
  localStorage.removeItem("role");
  localStorage.removeItem("admin");
  localStorage.removeItem("teacher");
  window.location.href = "/";
};

const Logout = () => {
  logout();
  return <div />;
};

export default Logout;
