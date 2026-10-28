import { ChatMistralAI } from "@langchain/mistralai";
import { listFiles, readFiles, writeFiles } from "./tools.js";
import { createAgent } from "langchain";



const model = new ChatMistralAI({
    model: "mistral-medium-latest",
    apiKey: process.env.MISTRAL_API_KEY
});


const agent = createAgent({
    model,
    tools: [listFiles, readFiles, writeFiles]
})

await agent.invoke({
    messages: [
        {
            role: "user",
            content: "update the theme of the project to light"
        }
    ]
})