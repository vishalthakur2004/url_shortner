import dotenv from "dotenv";
dotenv.config({ path: ".env" });

import connectDB from "./config/monogo.config.js";
import { app } from "./app.js"; // where you configure all middlewares & routes

const startServer = async () => {
    try {
        await connectDB();
        console.log("MongoDB connected successfully!");

        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("MongoDB connection failed!", error);
        process.exit(1);
    }
};

startServer();