const jwt = require("jsonwebtoken");
const { createToken } = require("./tokens");
const { SECRET_KEY } = require("../config");

describe("createToken", function () {
  test("works with user id and email", function () {
    const token = createToken({ id: 123, email: "test@example.com" });
    const payload = jwt.verify(token, SECRET_KEY);
    expect(payload).toEqual({
      iat: expect.any(Number),
      id: 123,
      email: "test@example.com"
    });
  });

  test("works with additional properties that are ignored", function () {
    const token = createToken({ 
      id: 456, 
      email: "other@example.com",
      extraProperty: "should be ignored" 
    });
    
    const payload = jwt.verify(token, SECRET_KEY);
    expect(payload).toEqual({
      iat: expect.any(Number),
      id: 456,
      email: "other@example.com"
    });
    expect(payload.extraProperty).toBeUndefined();
  });

  test("requires id and email", function () {
    expect(() => createToken({ id: 789 })).toThrow();
    expect(() => createToken({ email: "missing@example.com" })).toThrow();
    expect(() => createToken({})).toThrow();
  });
});