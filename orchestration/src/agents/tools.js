import axios from "axios";
import { tool } from "langchain";
import * as z from "zod";


/**
 * @description -> Lists all files available in the project directory. The AI agent can use this tool to discover the project's file structure before deciding which files it needs to read or modify.
 */
export const listFiles = tool(
    async ({ }) => {
        const response = await axios.get("http://01a13f4a-a011-7329-b130-92db2c2fbb60.agent.localhost/list-files");

        return JSON.stringify(response.data.files);
    },
    {
        name: "list_files",
        description: "List all the files in the project directory. This is useful for understanding what files are available to work with.",
        schema: z.object({})
    }
);


/**
 * @description -> Reads the contents of one or more specified files. It allows the AI agent to inspect source code, configuration files, and other project files to understand the existing implementation.
 */
export const readFiles = tool(
    async ({ files: [] }) => {
        const response = await axios.get("http://01a13f4a-a011-7329-b130-92db2c2fbb60.agent.localhost/read-files?files=" + files.join(","));

        return JSON.stringify(response.data);
    },
    {
        name: "read_files",
        description: "Read the contents of specified files. This is useful for understanding the content of files that are relevant to the task at hand.",
        schema: z.object({
            files: z.array(z.string()).describe("The list of files absolute paths to read. These should be files that were listed using the list_files tool or created later")
        })
    }
);


/**
 * @description -> Creates new files or replaces the contents of existing files. The agent supplies the file paths and the new content, and the server performs the requested file operations.
 */
export const writeFiles = tool(
    async ({ files }) => {
        const response = await axios.post("http://01a13f4a-a011-7329-b130-92db2c2fbb60.agent.localhost/create-files", {
            updates: files
        })

        return JSON.stringify(response.data.results);
    },
    {
        name: "update_files",
        description: "Update the contents of specified files. This is useful for making changes to files based on the requirements of the task at hand. This tool can also use to create new files by providing a new file name in the file field and the content to be added in the content field.",
        schema: z.object({
            files: z.array(z.object({
                file: z.string().describe("The absolute path of the file to update"),
                content: z.string().describe("The new content for the file, the content should support json format.")
            })).describe("The list of files to update and their new contents")
        })
    }
);