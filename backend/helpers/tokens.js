const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");

/** Return signed JWT from user data.
 * 
 * Expected user input: { id, email }
 */

function createToken(user) {
  if (!user.id || !user.email) {
    throw new Error("createToken requires user id and email");
  }
  
  let payload = {
    id: user.id,
    email: user.email,
  };

  return jwt.sign(payload, SECRET_KEY);
}

module.exports = { createToken };
