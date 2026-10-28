import express from "express";
import morgan from "morgan";
import fs from "fs";
import path from "path";


const WORKING_DIR = "/workspace";

const app = express();

app.use(morgan("dev"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
/**
  @description -> This is a test api....
 */
app.get("/", (req, res) => {
    return res.status(200).json({
        message: "This is a sandbox agent",
        status: "success"
    });
});

/**
  @route -> GET/list-files
  @description -> Retrieves the list of files within the configured working directory, including files located in nested subdirectories. The API returns file paths relative to the working directory and excludes specified directories such as node_modules, dist, build, and .git.
  @endpoint -> /list-files
*/
app.get("/list-files", async (req, res) => {
    
    const listFiles = async (dir, baseDir) => {
        const entries = await fs.promises.readdir(dir, { withFileTypes: true });
        const files = [];
        for (const entry of entries) {
            const fullPath = path.join(dir, entry.name);
            const relativePath = path.relative(baseDir, fullPath);

            //Exclude certain directories.....
            if (entry.isDirectory() && ['node_modules', 'dist', 'build', '.git'].includes(entry.name)) {
                continue;
            };

            if (entry.isDirectory()) {
                files.push(...await listFiles(fullPath, baseDir));
            } else {
                files.push(relativePath);
            };
        }

        return files;
    }

    try {
        const files = await listFiles(WORKING_DIR, WORKING_DIR);
        res.status(200).json({
            message: 'Files listed successfully',
            files,
        });
    } catch (err) {
        res.status(500).json({
            message: `Error listing files: ${err.message}`,
            status: 'error',
        });
    }
    
});

/**
  @route -> GET/read-files
  @description ->Reads the contents of one or more files from the configured working directory. The API accepts a comma-separated list of relative file paths through the files query parameter and returns the contents of each file. If a file cannot be read, the corresponding result includes an error message.
  @endpoint -> /read-files
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
        const filePath = path.join(WORKING_DIR, file);
        try {
            const content = await fs.promises.readFile(filePath, "utf-8");
            return {
                [filePath.replace(WORKING_DIR, "")]: content,
            }
        } catch (error) {
            return {
                [filePath.replace(WORKING_DIR, "")]: `Error reading files: ${error.message}`,
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
  @description -> Reads the contents of one or more files from the configured working directory. The API accepts a comma-separated list of relative file paths through the files query parameter and returns the contents of each file. If a file cannot be read, the corresponding result includes an error message.
  @endpoint -> /update-files
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
            await fs.promises.mkdir(path.dirname(filePath), { recursive: true });
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
  @description ->  Creates new files within the configured working directory or writes content to files at the specified paths. The API accepts an array of file objects containing relative file paths and their contents. If a specified file already exists, its contents are overwritten.
  @endpoint -> /create-files
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
            await fs.promises.mkdir(path.dirname(filePath), { recursive: true });
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