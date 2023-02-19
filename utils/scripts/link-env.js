const fs = require("fs");
const path = require("path");

const rootConfigPath = path.resolve(
  path.join(process.cwd(), "../..", "config")
);
const rootAppsPath = path.resolve(path.join(process.cwd(), "../..", "apps"));

const symlinkFile = (apps) => {
  for (let i = 0; i < apps.length; i++) {
    let app = apps[i];
    const appFolderPath = `${rootAppsPath}/${app}`;
    // exist directory
    if (fs.existsSync(appFolderPath)) {
      const configFilePath = rootConfigPath + "/" + app + ".json";
      const configAppPath = appFolderPath + "/config/env.json";

      // only create non-exist file
      if (!fs.existsSync(configAppPath)) {
        // make config folder
        fs.mkdirSync(appFolderPath + "/config");

        // create env json file in config app
        fs.symlinkSync(configFilePath, configAppPath, "file");
        console.log(`Successfully created config file in ../apps/${app}`);
      } else {
        console.log(`Already successufly linked config file in ../apps/${app}`);
      }
    }
  }
};

const linkConfig = () => {
  console.log("Start link env JSON file...");

  if (!fs.existsSync(rootConfigPath))
    throw new Error("Must have config folder container JSON env");

  const apps = fs
    .readdirSync(rootConfigPath)
    .filter((jsonFile) => {
      return fs.statSync(`${rootConfigPath}/${jsonFile}`).isFile();
    })
    .map((app) => {
      return app.replace(".json", "");
    });

  symlinkFile(apps);
};

linkConfig();
