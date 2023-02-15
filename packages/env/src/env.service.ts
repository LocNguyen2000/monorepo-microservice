import { Injectable } from "@nestjs/common";
import { Env as ConfigEnv } from "./common";
import * as fs from "fs";
@Injectable()
export class EnvService {
  private readonly config: ConfigEnv;

  constructor() {
    // get root apps path
    const configPath = [process.cwd(), "config", "env.json"].join("/");

    if (!fs.existsSync(configPath)) throw new Error("Not exist config");

    // read json file (local and global)
    const jsonFile = fs.readFileSync(configPath, "utf-8");

    const config = JSON.parse(jsonFile || "{}");
    console.log(config);

    this.config = config as unknown as ConfigEnv;
  }

  get(key: string) {
    return this.config[key];
  }
}
