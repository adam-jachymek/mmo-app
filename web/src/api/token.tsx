export const getToken = () => {
  return localStorage.getItem("userToken");
};

export const removeToken = () => {
  return localStorage.removeItem("userToken");
};
