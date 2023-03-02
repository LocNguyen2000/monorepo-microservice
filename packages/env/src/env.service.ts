import { Injectable } from "@nestjs/common";
import { Env } from "./common";
import * as fs from "fs";
@Injectable()
export class EnvService {
  private readonly env: Env;

  constructor() {
    // get root apps path
    const configPath = [process.cwd(), "config", "env.json"].join("/");

    if (!fs.existsSync(configPath)) throw new Error("Not exist config");

    // read json file (local and global)
    const jsonFile = fs.readFileSync(configPath, "utf-8");

    this.env = JSON.parse(jsonFile || "{}") as unknown as Env;
    console.log(this.env);
  }

  get(key: string) {
    return this.env[key];
  }
}
