import chalk from "chalk";
import { OptionDefinition } from "command-line-usage";

import configStore from "../api/config-store";
import { CommandCategories, Messages } from "../constants";
import { error } from "../helper/consoleWrapper";
import { isCI } from "../helper/isCI";
import terminalWrapper from "../helper/terminalWrapper";
import { CommandDefaultOptions } from "../models";
import { commands } from "./mainCommand";

export default class BaseCommand {
  args: OptionDefinition[];
  description: string;
  usage: string;
  commandCategory: CommandCategories;
  command: keyof typeof commands;
  async run(options?: CommandDefaultOptions): Promise<string> {
    if (!options.apiKey) {
      if (isCI()) {
        error(Messages.apiKeyNotFound);
        const apiKeyAnswer = await terminalWrapper([
          {
            type: 'text',
            name: 'apiKey',
            message: 'Enter your API Key',
          }
        ]);
        if (apiKeyAnswer.apiKey) {
          options.apiKey = apiKeyAnswer.apiKey;
          configStore.set('apiKey', apiKeyAnswer.apiKey);
        }
      }
      else {
        throw new Error(Messages.apiKeyNotFoundInCI);
      }
    }
    if (!options.environment) {
      if (!isCI()) {
        error(Messages.environmentNotFound);
        const environmentAnswer = await terminalWrapper([
          {
            type: "select",
            name: "env",
            message: "Please select the respective environment",
            choices: [{
              title: "EU",
              value: "EU"

            }, {
              title: "US",
              value: "US"
            }, {
              title: "PH",
              value: "PH"
            }]
          }
        ]);
        if (environmentAnswer.env) {
          options.environment = environmentAnswer.env;
          configStore.set('environment', options.environment);
        }
      }
      else {
        configStore.set("environment", null);
      }
    }
    else {
      configStore.set("environment", options.environment);
    }
    return Promise.resolve("");
  }
}


