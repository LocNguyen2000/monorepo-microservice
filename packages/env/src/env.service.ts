import { Injectable } from "@nestjs/common";
import * as fs from "fs";
import _ from "lodash";
import { Path, PathValue } from "@nestjs/config";
@Injectable()
export class EnvService<T> {
  private readonly env: T;

  constructor() {
    // get root apps path
    const configPath = [process.cwd(), "config", "env.json"].join("/");

    if (!fs.existsSync(configPath)) throw new Error("Not exist config");

    // read json file (local and global)
    const jsonFile = fs.readFileSync(configPath, "utf-8");

    this.env = JSON.parse(jsonFile || "{}") as unknown as T;
    console.log("Load file success", this.env);
  }
  get<K extends Path<T>>(key: K) {
    return key
      .split(".")
      .reduce((total, key) => (total = total[key]), this.env);
  }
}
