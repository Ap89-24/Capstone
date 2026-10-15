import axios from "axios";
import { tool } from "langchain";
import * as z from "zod";


export const listFiles = tool(
    async({ }) => {
        const response = await axios.get("http://01a13f4a-a011-7329-b130-92db2c2fbb60.agent.localhost/list-files");

        return response.data.files;
    },
    {
        name: "list_files",
        description: "List all the files in the project directory. This is useful for understanding what files are available to work with.",
        schema: z.object({})
    }
)