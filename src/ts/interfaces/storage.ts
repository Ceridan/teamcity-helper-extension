export interface Storage {
  getData(keys: string|Array<string>): Promise<object>;
  setData(data: object): Promise<void>;
}
