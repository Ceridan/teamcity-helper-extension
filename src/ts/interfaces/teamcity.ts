export interface TeamCity {
  getTrigger(triggerId: string, buildTypeId: string): Promise<any>;
}
