import { DynamicModule, Global, Module } from "@nestjs/common";
import {
  ConfigurableModuleClass,
  CustomConfigModuleOptions,
} from "./common/module/config.module-definition";
import { EnvService } from "./env.service";
import { ConfigModule } from "@nestjs/config";
import { validateSync } from "class-validator";
import { plainToInstance } from "class-transformer";
@Global()
@Module({})
export class EnvModule extends ConfigurableModuleClass {
  static register(options: CustomConfigModuleOptions): DynamicModule {
    return {
      module: EnvModule,
      imports: [],
      providers: [
        EnvService,
        {
          provide: "CONFIG_OPTIONS",
          useValue: options,
        },
      ],
      exports: [EnvService],
    };
  }
}
