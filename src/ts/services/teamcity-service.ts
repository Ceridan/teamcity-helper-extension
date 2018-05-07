import { TeamCity } from "../interfaces/teamcity";
import { Trigger } from "../models/trigger";

export class TeamCityService implements TeamCity {
  private apiUrl: URL;
  private apiLogin: string;
  private apiPassword: string;

  constructor(apiUrl: string, apiLogin: string, apiPassword: string) {
    this.apiUrl = new URL(apiUrl.replace(/\/?$/, "/"));
    this.apiLogin = apiLogin;
    this.apiPassword = apiPassword;
  }

  getTrigger(triggerId: string, buildTypeId: string): Promise<Trigger> {
    const getTriggerUrl = new URL(`${this.apiUrl}buildTypes/${buildTypeId}/triggers/${triggerId}`);

    return fetch(getTriggerUrl.toString(), {
      method: "GET",
      headers: new Headers({
        "Authorization": this.authorization,
        "Accept": "application/json"
      })
    })
      .then(res => res.json())
      .then(jsonRes => Promise.resolve(<Trigger>jsonRes));
  }

  addTrigger(trigger: Trigger, buildTypeId: string): Promise<boolean> {
    const addTriggerUrl = new URL(`${this.apiUrl}buildTypes/${buildTypeId}/triggers/`);

    // Because we create new trigger based on the existing trigger we should set "id" field to null
    // otherwise it suddenly works like update
    trigger.id = null;

    return fetch(addTriggerUrl.toString(), {
      method: "POST",
      headers: new Headers({
        "Authorization": this.authorization,
        "Content-Type": "application/json"
      }),
      body: JSON.stringify(trigger)
    })
      .then(res => Promise.resolve(true));
  }

  private get authorization(): string {
    return `Basic ${btoa(this.apiLogin + ":" + this.apiPassword)}`;
  }
}
