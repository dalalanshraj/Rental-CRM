import dotenv from "dotenv"
import express from "express"
import mongoose from "mongoose"
import cors from "cors"


dotenv.config();

// Custom Routes

import userRoutes from "./routes/userRoutes.js";
import leadsRoutes from "./routes/leadsRoutes.js"
import dealsRoutes from "./routes/dealsRoutes.js";



const app = express();
const MONGO = process.env.MONGO_URI

const PORT = 3000
const allowedOrigins = [
  "http://localhost:5174",
  "http://localhost:5175",
  "http://localhost:5173"
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true
  })
);

app.use(cors());
app.use(express.json());

// Root Test
app.get("/", (req, res) => {
  res.send(" backend is Ready");
});

//  MOUNT ROUTES
app.use("/api/auth", userRoutes)
app.use("/api/leads" , leadsRoutes)
app.use("/api/deals", dealsRoutes);




mongoose.connect(MONGO , {
          serverSelectionTimeoutMS: 3000,
    tls: true,
    ssl: true,
    tlsAllowInvalidCertificates: true, // ⚠️ dev only
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ Database Error:", err.message));

  app.listen(PORT , () => {
          console.log(`Server Running at http://localhost:${PORT}`)
  })

