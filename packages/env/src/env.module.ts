import { DynamicModule, Global, Module } from "@nestjs/common";
import { ConfigurableModuleClass } from "./common/module/config.module-definition";
import { EnvService } from "./env.service";
import { ConfigModule } from "@nestjs/config";

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
}
