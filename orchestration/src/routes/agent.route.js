import Router from "express";
import agent from "../agents/code.agent.js";

const agentRouter = Router();

agentRouter.post("/invoke", async (req, res) => {
    try {
        const { message, projectId } = req.body;

        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Connection', 'keep-alive');
        res.flushHeaders(); // flush the headers to establish SSE with client
        
        const response = await agent.stream(
            { messages: [{ role: "user", content: message }] },
            {
                context: { projectId },
                streamMode: "custom",
            }
        );

        for await (const chunk of response) {
            res.write(`data: ${JSON.stringify(chunk)}\n\n`);
        }
        res.status(200).json({ response });
    } catch (error) {
        console.error("Error invoking agent:", error);
        res.status(500).json({ error: "Failed to invoke agent" });
    }
});

export default agentRouter;