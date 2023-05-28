import jwt from "jsonwebtoken"

export const makeJWT = (_id) => {
  return jwt.sign({_id}, process.env.JWT_SECRET, {
    expiresIn: "30d"
  })
}