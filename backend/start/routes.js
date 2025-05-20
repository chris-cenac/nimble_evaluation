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
import fs from "fs/promises";
import { marked } from "marked";
const Route = use("Route");

Route.get("/docs", async ({ response }) => {
  // 1. Read the Markdown file
  const md = await fs.readFile("API.md", "utf-8");

  // 2. Convert to HTML
  const htmlBody = marked(md);

  // 3. Tell the client it’s HTML
  response.header("Content-Type", "text/html; charset=utf-8");

  // 4. Send it
  return response.send(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>API Documentation</title>
        <style>
          /* optional: basic styling */
          body { font-family: sans-serif; line-height: 1.6; padding: 2rem; max-width: 800px; margin: auto; }
          pre { background: #f5f5f5; padding: 1rem; overflow: auto; }
          code { font-family: monospace; }
          h1,h2,h3 { margin-top: 2rem; }
          blockquote { color: #555; border-left: 4px solid #ddd; padding-left: 1rem; }
        </style>
      </head>
      <body>${htmlBody}</body>
    </html>
  `);
});
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
