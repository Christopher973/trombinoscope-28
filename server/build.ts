import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";
import { exec } from "child_process";

// Convertir les chemins __dirname et __filename en ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Compiler le TypeScript avec tsc
exec("tsc -p tsconfig.json", { cwd: __dirname }, (error, stdout, stderr) => {
  if (error) {
    console.error(`Erreur de compilation: ${error.message}`);
    return;
  }

  if (stderr) {
    console.error(`stderr: ${stderr}`);
    return;
  }

  console.log(`stdout: ${stdout}`);

  // Convertir les imports .ts en .js dans les fichiers compilés
  const distDir = path.join(__dirname, "dist");
  if (fs.existsSync(distDir)) {
    function processDirectory(directory) {
      fs.readdirSync(directory).forEach((file) => {
        const fullPath = path.join(directory, file);
        if (fs.statSync(fullPath).isDirectory()) {
          processDirectory(fullPath);
        } else if (fullPath.endsWith(".js")) {
          let content = fs.readFileSync(fullPath, "utf8");
          content = content.replace(/from ['"](.+)\.ts['"]/g, "from '$1.js'");
          content = content.replace(
            /import ['"](.+)\.ts['"]/g,
            "import '$1.js'"
          );
          fs.writeFileSync(fullPath, content);
        }
      });
    }

    processDirectory(distDir);
    console.log("Conversion des imports .ts en .js terminée.");
  }
});
