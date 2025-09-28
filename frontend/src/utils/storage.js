// helpers for token + user storage

export const saveUserToStorage = (user, token) => {
  if (user) localStorage.setItem("user", JSON.stringify(user));
  if (token) localStorage.setItem("token", token);
};

export const getUserFromStorage = () => {
  const raw = localStorage.getItem("user");
  return raw ? JSON.parse(raw) : null;
};

export const getToken = () => {
  return localStorage.getItem("token");
};

export const clearStorage = () => {
  localStorage.removeItem("user");
  localStorage.removeItem("token");
};
