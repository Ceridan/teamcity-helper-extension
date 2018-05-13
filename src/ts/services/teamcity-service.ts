import { TeamCity } from "../interfaces/teamcity";
import { Trigger } from "../models/trigger";

export class TeamCityService implements TeamCity {
  private teamCityUrl: URL;
  private teamCityRestApiUrl: string;
  private apiLogin: string;
  private apiPassword: string;

  constructor(teamCityUrl: string, apiLogin: string, apiPassword: string) {
    this.setTeamCityUrl(teamCityUrl);
    this.setTeamCityRestApiCredentials(apiLogin, apiPassword);
  }

  setTeamCityUrl(teamCityUrl: string): void {
    this.teamCityUrl = new URL(teamCityUrl);
    this.teamCityRestApiUrl = `${this.teamCityUrl.origin}/app/rest`;
  }

  setTeamCityRestApiCredentials(apiLogin: string, apiPassword: string): void {
    this.apiLogin = apiLogin;
    this.apiPassword = apiPassword;
  }

  getTrigger(triggerId: string, buildTypeId: string): Promise<Trigger> {
    const getTriggerUrl = new URL(`${this.teamCityRestApiUrl}/buildTypes/${buildTypeId}/triggers/${triggerId}`);

    return fetch(getTriggerUrl.toString(), {
      method: "GET",
      headers: new Headers({
        "Authorization": this.authorization,
        "Accept": "application/json"
      })
    })
      .then(res => {
        if (res.status === 200) {
          return res.json();
        } else {
          return Promise.reject(res.status);
        }
      })
      .then(jsonRes => Promise.resolve(<Trigger>jsonRes));
  }

  addTrigger(trigger: Trigger, buildTypeId: string): Promise<void> {
    const addTriggerUrl = new URL(`${this.teamCityRestApiUrl}/buildTypes/${buildTypeId}/triggers/`);

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
    .then(res => {
      if (res.status === 200) {
        return Promise.resolve();
      } else {
        return Promise.reject(res.status);
      }
    });
  }

  private get authorization(): string {
    return `Basic ${btoa(this.apiLogin + ":" + this.apiPassword)}`;
  }
}
