export const PasswordVerification = (password: string) => {
  let re = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z]).{8,}$/;
  return re.test(password);
};

export const LoginVerification = (login: string) => {
  let re = /^(?=.*[a-z]).{8,}$/;
  return re.test(login);
};
