import express from "express";
import morgan from "morgan";
import fs from "fs";
import path from "path";


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

    const results = await Promise.all(fileList.map(async (file) => {
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

    return res.status(200).json({
        message: "File contents",
        files: results
    });
});

/**
  @route -> PATCH/update-files
*/
app.patch("/update-files", async (req, res) => {
    const updates = req.body.updates;

    if (!updates || !Array.isArray(updates)) {
        return res.status(400).json({
            message: "Invalid request body. Expected a json object with an update property containing an array of file updates",
            status: "error"
        });
    };

    const results = await Promise.all(updates.map(async (update) => {
        const { file, content } = update;
        const filePath = path.join(WORKING_DIR, file);
        try {
            await fs.promises.writeFile(filePath, content, "utf-8");
            return {
                [filePath]: "File update successfully"
            }
        } catch (error) {
            return {
                [filePath]: `Error updating files ${error.message}`,
            }
        };
    }));

    return res.status(200).json({
        message: "File update results",
        results
    });
});

/**
  @route -> POST/create-files
*/
app.post("/create-files", async (req, res) => {
    const files = req.body.files;

    if (!files || !Array.isArray(files)) {
        return res.status(400).json({
            message: "Invalid request body. Expected a json object with an update property containing an array of file updates",
            status: "error"
        });
    };

    const results = await Promise.all(files.map(async (fileObj) => {
        const { file, content } = fileObj;
        const filePath = path.join(WORKING_DIR, file);
        try {
            await fs.promises.writeFile(filePath, content, "utf-8");
            return {
                [filePath]: "File created successfully"
            }
        } catch (error) {
            return {
                [filePath]: `Error creating files ${error.message}`,
            }
        };
    }));

    return res.status(200).json({
        message: "File create results",
        results
    });
});
export default app;