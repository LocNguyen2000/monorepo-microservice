import { Injectable, Inject } from "@nestjs/common";
import * as fs from "fs";
import _ from "lodash";
import { Path } from "@nestjs/config";
import { ClassConstructor, plainToInstance } from "class-transformer";
import { validateSync } from "class-validator";
import { CustomConfigModuleOptions } from "./common/module/config.module-definition";
@Injectable()
export class EnvService<T extends object> {
  private readonly env: T;

  constructor(
    @Inject("CONFIG_OPTIONS") private options: CustomConfigModuleOptions
  ) {
    const rawJson = this.load(this.options.path);

    // validate config
    this.env = this.validate(
      this.options.class as unknown as ClassConstructor<T>,
      rawJson
    );

    console.log("Load file success", this.env);
  }

  get<K extends Path<T>>(key: K) {
    return key
      .split(".")
      .reduce((total, key) => (total = total[key]), this.env);
  }

  private load(path: string): T {
    // get root apps path
    const configPath = [process.cwd(), path].join("/");

    if (!fs.existsSync(configPath)) throw new Error("Not exist config");

    // read json file (local and global)
    const jsonFile = fs.readFileSync(configPath, "utf-8");

    return JSON.parse(jsonFile || "{}");
  }

  private validate(cls: ClassConstructor<T>, config: T) {
    const validatedConfig = plainToInstance(cls, config, {
      enableImplicitConversion: true,
    });

    if (typeof validatedConfig !== "object") {
      throw new Error("Validated config must be an Object");
    }

    const errors = validateSync(validatedConfig, {
      skipMissingProperties: false,
    });

    if (errors.length > 0) {
      throw new Error(errors.toString());
    }
    return validatedConfig;
  }
}
