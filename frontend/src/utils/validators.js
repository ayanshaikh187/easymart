export const validateEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

// Used for SIGNUP / reset (backend also enforces min 8)
export const validatePassword = (password) => {
  return password.length >= 8;
};

export const validateName = (name) => {
  return name.trim().length >= 3;
};

export const validatePhone = (phone) => {
  return /^[0-9+\-\s]{7,15}$/.test(phone);
};
