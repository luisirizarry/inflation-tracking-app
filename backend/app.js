"use strict";

/** Express app for jobly. */

const express = require("express");
const cors = require("cors");
const { NotFoundError } = require("./expressError");
const { authenticateJWT } = require("./middleware/auth");
// Routes
const authRoutes = require("./routes/auth");
const categoryRoutes = require("./routes/categories");
const inflationRoutes = require("./routes/inflation");
const trackItemsRoutes = require("./routes/trackedItems");
const userNotificationsRoutes = require("./routes/userNotifications");
const usersRoutes = require("./routes/users");
const userPreferencesRoutes = require("./routes/usersPreferences");

const morgan = require("morgan");

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("tiny"));
app.use(authenticateJWT);

app.use("/auth", authRoutes);
app.use("/categories", categoryRoutes);
app.use("/inflation", inflationRoutes);
app.use("/items", trackItemsRoutes);
app.use("/notifications", userNotificationsRoutes);
app.use("/users", usersRoutes);
app.use("/preferences", userPreferencesRoutes);

app.get("/ping", (req, res) => {
  res.json({ message: "Backend is connected!" });
});

/** Handle 404 errors -- this matches everything */
app.use(function (req, res, next) {
  return next(new NotFoundError());
});

/** Generic error handler; anything unhandled goes here. */
app.use(function (err, req, res, next) {
  if (process.env.NODE_ENV !== "test") console.error(err.stack);
  const status = err.status || 500;
  const message = err.message;

  return res.status(status).json({
    error: { message, status },
  });
});

module.exports = app;
