import { ConfigurableModuleBuilder } from "@nestjs/common";
interface ConfigModuleOptions {
  folder: string;
}

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } =
  new ConfigurableModuleBuilder<ConfigModuleOptions>().build();
