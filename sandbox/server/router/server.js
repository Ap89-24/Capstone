import app from "../src/app.js";

const PORT = process.env.PORT_NAME || 3000

app.listen(PORT, () => {
    console.log(`Sandbox Router Server is running on ${PORT}`)
})