import express from "express";
import cors from "cors";
import mainRouter from "./routes";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/v1", mainRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// Define a simple route to test if the server is running
app.get("/", (req, res) => {
    res.send("Successfully hit the endpoint!");
});