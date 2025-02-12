import express from "express";
import dotenv from "dotenv";
import aiRoutes from "./routes/ai";
import cors from "cors";

dotenv.config({ path: "./.env" });

const app = express();

app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());

app.get("/", (req, res) => {
  res.send("hello");
});

app.use("/api", aiRoutes);

app.listen(process.env.PORT || 3001, () => {
  console.log("Server running on port 3000");
});
