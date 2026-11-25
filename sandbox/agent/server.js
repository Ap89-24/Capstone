import httpServer from "./src/app.js";

const PORT = process.env.PORT_NAME || 3000

httpServer.listen(PORT, () => {
    console.log(`Sandbox Agent Server is running on ${PORT}`)
});