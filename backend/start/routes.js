"use strict";

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URLs and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use("Route");

Route.group(() => {
  // Public routes
  Route.get("/patients", "PatientController.index");
  Route.get("/patients/:id", "PatientController.show");

  // Protected routes (require JWT)
  Route.post("/patients", "PatientController.store").middleware(["auth"]);
  Route.put("/patients/:id", "PatientController.update").middleware(["auth"]);
  Route.delete("/patients/:id", "PatientController.destroy").middleware([
    "auth",
  ]);
}).prefix("/api");

Route.group(() => {
  // Register a new user
  Route.post("/auth/register", "AuthController.register");
  // Login to get JWT token
  Route.post("/auth/login", "AuthController.login");
}).prefix("/api");
