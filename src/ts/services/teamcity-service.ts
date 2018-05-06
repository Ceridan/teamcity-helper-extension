import { TeamCity } from "../interfaces/teamcity";

export class TeamCityService implements TeamCity {
  private apiUrl: URL;
  private apiLogin: string;
  private apiPassword: string;

  constructor(apiUrl: string, apiLogin: string, apiPassword: string) {
    this.apiUrl = new URL(apiUrl.replace(/\/?$/, "/"));
    this.apiLogin = apiLogin;
    this.apiPassword = apiPassword;
  }

  getTrigger(triggerId: string, buildTypeId: string): Promise<any> {
    const getTriggerUrl = new URL(`${this.apiUrl}buildTypes/${buildTypeId}/triggers/${triggerId}`);

    return fetch(getTriggerUrl.toString(), {
      method: "GET",
      headers: this.headers
    })
      .then(res => res.json())
      .catch(error => new Error(error));
  }

  private get headers(): Headers {
    return new Headers({
      "Authorization": `Basic ${btoa(this.apiLogin + ":" + this.apiPassword)}`,
      "Accept": "application/json"
    });
  }
}
