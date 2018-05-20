import { Config } from "./interfaces/config";
import { Storage } from "./interfaces/storage";
import { ChromeStorageService } from "./services/chrome-storage-service";

export class AppConfig {
  static storageKeys = [ "tc-rest-login", "tc-rest-password", "tc-feat-trigger-copy", "tc-feat-inline-screenshot" ];

  static getConfig(storage?: Storage): Promise<Config> {
    storage = storage || new ChromeStorageService();

    return storage.getData(AppConfig.storageKeys)
      .then(items => {
        const config: Config = AppConfig.convertObjectToConfig(items);
        return Promise.resolve(config);
      });
  }

  static convertObjectToConfig(storageObject: object): Config {
    const config: Config = {
      teamCityRestApiLogin: storageObject[AppConfig.storageKeys[0]] || "",
      teamCityRestApiPassword: storageObject[AppConfig.storageKeys[1]] || "",
      isTriggerCopyFeatureEnabled: typeof storageObject[AppConfig.storageKeys[2]] !== "undefined"
        ? storageObject[AppConfig.storageKeys[2]]
        : true,
      isInlineScreenshotFeatureEnabled: typeof storageObject[AppConfig.storageKeys[3]] !== "undefined"
        ? storageObject[AppConfig.storageKeys[3]]
        : true,
    };

    return config;
  }
}
