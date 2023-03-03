import { DynamicModule, Global, Module } from "@nestjs/common";
import { ConfigurableModuleClass } from "./common/module/config.module-definition";
import { EnvService } from "./env.service";
import { ConfigModule } from "@nestjs/config";
import * as fs from "fs";

@Global()
@Module({})
export class EnvModule extends ConfigurableModuleClass {
  static register(): DynamicModule {
    return {
      module: EnvModule,
      imports: [
        ConfigModule.forRoot({
          ignoreEnvFile: true,
          load: [],
        }),
      ],
      providers: [EnvService],
      exports: [EnvService],
    };
  }
  // private static load() {
  //   // get root apps path
  //   const configPath = [process.cwd(), "config", "env.json"].join("/");

  //   if (!fs.existsSync(configPath)) throw new Error("Not exist config");

  //   // read json file (local and global)
  //   const jsonFile = fs.readFileSync(configPath, "utf-8");

  //   const env = JSON.parse(jsonFile || "{}");

  //   return env;
  // }
}
