import express from "express";
import morgan from "morgan";
import fs from "fs";


const WORKING_DIR = "/workspace";

const app = express();

app.use(morgan("dev"));


app.get("/", (req, res) => {
    return res.status(200).json({
        message: "This is a sandbox agent",
        status: "success"
    });
});


app.get("/list-files", async (req, res) => {
    const elements = await fs.promises.readdir(WORKING_DIR);

    res.status(200).json({
        message: "Elements in working directory",
        elements
    });
});

/**
  @route -> GET/read-files
*/
app.get("/read-files", async (req, res) => {
    const files = req.query.files;

    if (!files) {
        return res.status(400).json({
            message: "No files specified in query parameter",
            status: "error"
        });
    }

    const fileList = files.split(",")

    await Promise.all(fileList.map(async (file) => {
        const filePath = `${WORKING_DIR}/${file}`;
        try {
            const content = await fs.promises.readFile(filePath, "utf-8");
            return {
                [filePath]: content,
            }
        } catch (error) {
            return {
                [filePath]: `Error reading files: ${error.message}`,
            }
        }
    }));
});
export default app;