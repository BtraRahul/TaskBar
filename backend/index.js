import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import projectRoutes from "./routes/projectRoutes.js";
import config from "./config.js";

const app = express();

app.use(cors());

mongoose.connect(config.mongoURI, {});

app.use(cors());
app.use(express.json());

app.use("/api/projects", projectRoutes);

app.get("/", (req, res) => {
  res.send("Hello World");
});
const PORT = config.port;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
