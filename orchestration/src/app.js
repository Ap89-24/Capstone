import express from "express";
import morgan from "morgan";
import agentRouter from "./routes/agent.route.js";


const app = express();


/**
 * @description -> Middlewares....
 */
app.use(morgan("dev"));
app.use(express.json());


/**
 * @description -> Health checks api....
 */

app.get("/api/status/healthz", async (req, res) => {
    res.status(200).json({ status: "ok" });
});

app.use("/api/ai/agent", agentRouter);


export default app;