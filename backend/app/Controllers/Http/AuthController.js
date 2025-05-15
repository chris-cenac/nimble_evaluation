"use strict";

const User = use("App/Models/User");

class AuthController {
  async register({ request, response }) {
    const data = request.only(["username", "email", "password"]);
    const user = await User.create(data);
    return response.status(201).json(user);
  }

  async login({ request, auth, response }) {
    const { email, password } = request.only(["email", "password"]);
    const token = await auth.attempt(email, password);
    return response.json(token);
  }
}

module.exports = AuthController;
