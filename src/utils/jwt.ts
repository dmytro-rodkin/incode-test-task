import jsonwebtoken from "jsonwebtoken";

export const extractUserUUIDFromJWT = (token: string) => {
  const decoded: jsonwebtoken.JwtPayload = jsonwebtoken.decode(
    token
  ) as jsonwebtoken.JwtPayload;
  return decoded.uuid;
};

export const signAccessToken = (uuid: string) => {
  const token = jsonwebtoken.sign({ uuid }, process.env.JWT_SECRET, {
    expiresIn: "10h",
  });
  return token;
};
