export const getStoredUser = () => {
  try {
    const rawUser = localStorage.getItem("user");
    return rawUser ? JSON.parse(rawUser) : null;
  } catch (error) {
    console.error("Invalid stored user:", error);
    return null;
  }
};

export const isAdminUser = (user = getStoredUser()) => {
  return user?.role === "admin";
};
