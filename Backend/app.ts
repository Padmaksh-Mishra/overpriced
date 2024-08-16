import express, { Request, Response } from "express";
import cors, { CorsOptions } from "cors";

const app = express();

// Middleware for Cross-Origin Resource Sharing
const corsOptions: CorsOptions = {
    origin: "*", // Allow all origins or specify your desired origins
    methods: ["GET", "POST"],
};

app.use(cors(corsOptions));

// Middleware for parsing JSON bodies
app.use(express.json());

// Importing routes
// Uncomment and adjust the path to your router when it's ready
// import mainRouter from "./routes/index";
// app.use("/api/v1", mainRouter);

// Define a simple route to test if the server is running
app.get("/", (req: Request, res: Response) => {
    res.send("Successfully hit the endpoint!");
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// Using /api/v1 allows us to use different routers for all different versions
// Uncomment and adjust the path to your new router when it's ready
// app.use("/api/v2", newRouter);
