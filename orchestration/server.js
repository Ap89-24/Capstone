import app from "./src/app.js";


const PORT = process.env.PORT || 30000;

app.listen(PORT, () => {
    console.log(`AI Orchestration Server is running on ${PORT}`)
});