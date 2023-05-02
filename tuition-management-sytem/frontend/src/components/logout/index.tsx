const logout = () => {
  localStorage.removeItem("role");
  localStorage.removeItem("admin");
  localStorage.removeItem("teacher");
  localStorage.removeItem("student");
  window.location.href = "/";
};

const Logout = () => {
  logout();
  return <div />;
};

export default Logout;
