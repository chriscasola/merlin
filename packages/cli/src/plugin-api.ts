import { CommanderStatic } from 'commander';

export interface ICLIPlugin {
  install(cli: CommanderStatic): Promise<void>;
}
