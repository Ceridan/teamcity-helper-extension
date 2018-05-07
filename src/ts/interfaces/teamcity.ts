import { Trigger } from "../models/trigger";

export interface TeamCity {
  getTrigger(triggerId: string, buildTypeId: string): Promise<Trigger>;
  addTrigger(trigger: Trigger, buildTypeId: string): Promise<boolean>;
}
