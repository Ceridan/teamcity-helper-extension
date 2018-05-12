import { AppConfig } from "../app-config";
import { Storage } from "../interfaces/storage";
import { ChromeStorageService } from "../services/chrome-storage-service";

export class OptionsPageHandler {
  private storage: Storage;
  private optionInputElementIds = AppConfig.storageKeys;

  constructor();
  constructor(storage?: Storage) {
    this.storage = storage || new ChromeStorageService();
  }

  loadOptions(): void {
    const optionInputElements = {};

    this.optionInputElementIds.forEach(key => {
      optionInputElements[key] = document.getElementById(key);
    });

    document.getElementById("save-options").addEventListener("click" , () => {
      const storageObject = {};

      this.optionInputElementIds.forEach(key => {
        storageObject[key] = (<HTMLInputElement>optionInputElements[key]).value;
      });

      this.storage.setData(storageObject)
        .then(() => chrome.runtime.sendMessage({ action: "options", data: storageObject }))
        .then(() => window.close())
        .catch(error => console.error(error));
    });

    this.storage.getData(this.optionInputElementIds)
      .then(items => {
        this.optionInputElementIds.forEach(key => {
          (<HTMLInputElement>optionInputElements[key]).value = items[key] || "";
        });
      })
      .catch(error => console.error(error));
  }
}
