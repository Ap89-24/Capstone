import express from "express";
import morgan from "morgan";


const app = express();


/**
 * @description -> Middlewares....
 */
app.use(morgan("dev"));
app.use(express.json());


/**
 * @description -> Health checks api....
 */
app.get("/api/ai/healthz", async (req, res) => {
    res.status(200).json({ status: "ok" });
});


export default app;