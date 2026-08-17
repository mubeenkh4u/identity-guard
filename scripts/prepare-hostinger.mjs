import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const out = path.join(root, "hostinger-deploy");

fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(path.join(out, "server", "src"), { recursive: true });
fs.cpSync(path.join(root, "dist"), path.join(out, "dist"), { recursive: true });
fs.copyFileSync(path.join(root, "server", "src", "index.js"), path.join(out, "server", "src", "index.js"));

const pkg = {
  name: "identity-guard-hostinger",
  version: "0.2.2",
  private: true,
  type: "module",
  main: "server/src/index.js",
  engines: { node: ">=20.19 <25" },
  scripts: { start: "node server/src/index.js" },
  dependencies: {
    cors: "^2.8.5",
    dotenv: "^16.4.7",
    express: "^5.1.0"
  }
};

fs.writeFileSync(path.join(out, "package.json"), JSON.stringify(pkg, null, 2) + "\n");
fs.writeFileSync(path.join(out, "README.txt"), "Hostinger production package. Upload the CONTENTS of this folder as a ZIP. Framework: Express. Start: npm start. No build command is required because dist/ is prebuilt.\n");
console.log(`Prepared ${out}`);
console.log("ZIP the contents of hostinger-deploy so package.json is at the archive root.");
