import { Trigger } from "../models/trigger";

export interface TeamCity {
  setTeamCityUrl(teamCityUrl: string): void;
  setTeamCityRestApiCredentials(apiLogin: string, apiPassword: string): void;
  getTrigger(triggerId: string, buildTypeId: string): Promise<Trigger>;
  addTrigger(trigger: Trigger, buildTypeId: string): Promise<void>;
}
