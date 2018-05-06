import { TeamCity } from "../interfaces/teamcity";
import { TeamCityService } from "../services/teamcity-service";

export class TriggerPageHandler {
  static triggersPage = "editTriggers.html";
  static triggersTableId = "buildTriggersTable";

  static isValidTriggersPage(): boolean {
    return (document.URL.indexOf(TriggerPageHandler.triggersPage) > 0) && (document.getElementById(TriggerPageHandler.triggersTableId) !== null);
  }

  private teamCity: TeamCity;
  private triggersTable: HTMLTableElement;

  constructor();
  constructor(teamCity?: TeamCity) {
    this.teamCity = teamCity || new TeamCityService("TEAMCITY_REST_API_URL", "REST_API_LOGIN", "REST_API_PASSWORD");
    this.triggersTable = <HTMLTableElement>document.getElementById(TriggerPageHandler.triggersTableId);
  }

  generateCopyLinks(): void {
    if (this.triggersTable === null) {
      throw new Error("Triggers table was not found on the page");
    }

    this.triggersTable.querySelectorAll("tr > td.highlight.edit").forEach(cell => {
      cell.removeAttribute("onclick");
      cell.classList.remove("highlight");

      // We have to replace the td element with copy to remove external anonymous click events
      const newCell = cell.cloneNode(true);
      cell.parentNode.replaceChild(newCell, cell);

      const br = document.createElement("br");
      const copyLink = document.createElement("a");
      copyLink.text = "Copy";
      copyLink.href = "#";

      newCell.appendChild(br);
      newCell.appendChild(copyLink);
    });
  }
}
