class GlobalEnv {
  mongoUrl: Record<string, unknown>;
}

export class Env extends GlobalEnv {
  host: string;
  port: string;
}
