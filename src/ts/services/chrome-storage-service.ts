import { Storage } from "../interfaces/storage";

export class ChromeStorageService implements Storage {
  getData(keys: string|string[]): Promise<object> {
    return new Promise((resolve, reject) => {
      chrome.storage.local.get(keys, items => {
        const error = chrome.runtime.lastError;
        return error ? reject(error) : resolve(items);
      });
    });
  }

  setData(data: object): Promise<void> {
    return new Promise((resolve, reject) => {
      chrome.storage.local.set(data, () => {
        const error = chrome.runtime.lastError;
        return error ? reject(error) : resolve();
      });
    });
  }
}
