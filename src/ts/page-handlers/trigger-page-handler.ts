import { TeamCity } from "../interfaces/teamcity";
import { TeamCityService } from "../services/teamcity-service";

export class TriggerPageHandler {
  static isValidTriggersPage(): boolean {
    return (document.URL.indexOf("editTriggers.html") > 0) && (document.getElementById("buildTriggersTable") !== null);
  }

  private teamCity: TeamCity;
  private triggersTable: HTMLTableElement;

  constructor();
  constructor(teamCity?: TeamCity) {
    this.teamCity = teamCity || new TeamCityService("TEAMCITY_REST_API_URL", "REST_API_LOGIN", "REST_API_PASSWORD");
    this.triggersTable = <HTMLTableElement>document.getElementById("buildTriggersTable");
  }

  generateCopyLinks(): void {
    if (this.triggersTable === null) {
      throw new Error("Triggers table was not found on the page");
    }

    const buildTypeId = this.getBuildTypeId();

    this.triggersTable.querySelectorAll("tr > td.highlight.edit").forEach(cell => {
      const triggerId = this.getTriggerIdFromRow(cell.parentElement);

      cell.removeAttribute("onclick");
      cell.classList.remove("highlight");

      // We have to replace the td element with copy to remove external anonymous click events
      const newCell = cell.cloneNode(true);
      cell.parentNode.replaceChild(newCell, cell);

      const br = document.createElement("br");
      const copyLink = document.createElement("a");
      copyLink.text = "Copy";
      copyLink.href = "#";
      copyLink.addEventListener("click", (event) => {
        event.stopPropagation();

        this.teamCity.getTrigger(triggerId, buildTypeId)
          .then(trigger => this.teamCity.addTrigger(trigger, buildTypeId))
          .then(() => location.reload())
          .catch(error => {
            throw new Error(error);
          });
      });

      newCell.appendChild(br);
      newCell.appendChild(copyLink);
    });
  }

  private getBuildTypeId(): string {
    const title = document.querySelector("#restPageTitle > div[data-buildtypeid]");

    if (!title) {
      throw new Error("Couldn't find build title on the page");
    }

    return title.getAttribute("data-buildtypeid");
  }

  private getTriggerIdFromRow(triggerRowElement: HTMLElement): string {
    const btnSpan = triggerRowElement.querySelector("td > span.btn-group");
    const spanId = (btnSpan && btnSpan.id) ? btnSpan.id : "";

    return spanId.replace("sp_span_triggerActions", "");
  }
}
