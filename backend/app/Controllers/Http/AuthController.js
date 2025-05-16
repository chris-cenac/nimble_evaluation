"use strict";

const User = use("App/Models/User");

class AuthController {
  async register({ request, auth, response }) {
    const data = request.only(["username", "email", "password"]);

    try {
      const user = await User.create(data);
      const token = await auth.generate(user);

      return response.status(201).json({
        token: token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
        },
      });
    } catch (error) {
      return response.status(400).json({
        message: "Registration failed",
        error: error.message,
      });
    }
  }

  async login({ request, auth, response }) {
    const { email, password } = request.only(["email", "password"]);

    try {
      const token = await auth.attempt(email, password);
      const user = await User.findBy("email", email);

      if (!user) {
        throw new Error("User not found");
      }

      return response.json({
        token: token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
        },
      });
    } catch (error) {
      return response.status(401).json({
        message: "Invalid credentials",
        error: error.message,
      });
    }
  }
}

module.exports = AuthController;
