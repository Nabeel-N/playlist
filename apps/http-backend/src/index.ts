import express from "express";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import session from "express-session";
import dotenv from "dotenv";
import cors from "cors";

// Import Routes
import playlistRoutes from "./routes/playlist.routes";
import songRoutes from "./routes/song.routes";
import artistRoutes from "./routes/artist.routes";
import podcastRoutes from "./routes/podcastroute";
import episodeRoute from "./routes/episode.route";

// Import Services
import { AuthService } from "./services/auth.service";

dotenv.config();

const app = express();
const authService = new AuthService();

// --- 1. GLOBAL MIDDLEWARE ---
// CORS must be first to handle pre-flight requests from the browser
// in http-backend/src/index.ts
app.use(
  cors({
    origin: "http://localhost:3000", // or "http://127.0.0.1:3000"
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true, // This allows the backend to receive the cookies
  }),
);

// Body parsers must come before routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- 2. SESSION & AUTHENTICATION ---
app.use(
  session({
    secret: process.env.SESSION_SECRET || "secret_key_needs_to_be_complex",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Set to true if using HTTPS
  }),
);

app.use(passport.initialize());
app.use(passport.session());

// Passport Strategy Configuration
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      callbackURL: "http://localhost:8080/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const dbUser = await authService.handleGoogleLogin(profile);
        return done(null, dbUser);
      } catch (e) {
        return done(e, false);
      }
    },
  ),
);

passport.serializeUser((user: any, done) => done(null, user));
passport.deserializeUser((user: any, done) => done(null, user));

// --- 3. ROUTES ---

// Auth Routes
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] }),
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    console.log("User authenticated");
    res.redirect("http://localhost:3000/");
  },
);

// Resource Routes
app.use("/playlist", playlistRoutes);
app.use("/song", songRoutes);
app.use("/artist", artistRoutes);
app.use("/podcast", podcastRoutes);
app.use("/episode", episodeRoute);


const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
