const { resolve } = require("path");
const { readFileSync, writeFileSync } = require("fs");

function flattenToObject(obj, prefix = "") {
  return Object.keys(obj).reduce((acc, k) => {
    const pre = prefix.length ? prefix.toUpperCase() + "_" : "";
    if (typeof obj[k] === "object" && obj[k] !== null) {
      Object.assign(acc, flattenToObject(obj[k], pre + k));
    } else {
      acc[pre + k.toUpperCase()] = obj[k];
    }
    return acc;
  }, {});
}

async function main() {
  const inputFilePath = "config/env.json";
  const outpuFilePath = ".env";

  try {
    const config = readFileSync(inputFilePath, "utf-8");

    const env = JSON.parse(config || "{}");

    if (Object.keys(env).length === 0) throw new Error("No env found");

    const flattenEnv = flattenToObject(env, "ADMIN");
    let outputEnv = "";
    for (let key of Object.keys(flattenEnv)) {
      outputEnv += `${key}=${flattenEnv[key]}`;
      outputEnv += "\n";
    }
    writeFileSync(outpuFilePath, outputEnv);
  } catch (error) {
    console.log(error);
  }
}

main();
