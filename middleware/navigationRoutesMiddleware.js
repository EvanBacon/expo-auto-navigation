// Moved from a custom branch of `@expo/metro-config`
const JsonFile = require("@expo/json-file").default;
const fs = require("fs-extra");
const path = require("path");

function pagesForDirectory(dir, root = "") {
  const files = fs.readdirSync(dir);
  if (!files.length) return null;
  const results = {
    pages: [],
    root,
  };

  for (const fileName of files) {
    // skip hidden files and node_modules
    if (fileName.match(/node_modules/) || fileName.match(/^\./)) {
      continue;
    }
    const filePath = path.join(dir, fileName);
    if (fileName.match(/_config\./)) {
      const contents = JsonFile.read(filePath);
      results.config = contents;
      continue;
    }
    const page = {
      name: fileName,
      filePath,
    };
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      const info = pagesForDirectory(
        filePath,
        path.join(root || "", fileName)
      );
      if (!info) {
        continue;
      }
      page.directoryInfo = info;
    }
    results.pages.push(page);
  }

  return results;
}

// Reads the contents of the pages folder and returns it as a navigation config object.
function navigationRoutesMiddleware(projectRoot) {
  const pagesPath = path.join(projectRoot, "pages");

  return function (req, res, next) {
    try {
      const route = req.headers["dir"] || "/";
      if (typeof route !== "string") {
        throw new Error("headers.dir must be a string");
      }
      const dirPath = path.join(pagesPath, route);

      if (!fs.existsSync(dirPath)) {
        throw new Error(`Requested directory does not exist: ${dirPath}`);
      }
      const pages = pagesForDirectory(dirPath);
      res.statusCode = 200;
      res.write(JSON.stringify(pages));
      res.end();
    } catch (error) {
      console.error(`Error getting navigation routes: ${error} ${error.stack}`);
      res.statusCode = 520;
      res.end(
        JSON.stringify({
          error: error.toString(),
        })
      );
    }
  };
}

module.exports = navigationRoutesMiddleware;
