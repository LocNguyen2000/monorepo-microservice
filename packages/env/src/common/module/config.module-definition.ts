import { ConfigurableModuleBuilder } from "@nestjs/common";
import { ClassConstructor } from "class-transformer";
export interface CustomConfigModuleOptions {
  path: string;
  class: ClassConstructor<object>;
}

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } =
  new ConfigurableModuleBuilder<CustomConfigModuleOptions>().build();
