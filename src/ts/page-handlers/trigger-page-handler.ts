import { TeamCity } from "../interfaces/teamcity";
import { Config } from "../interfaces/config";
import { TeamCityService } from "../services/teamcity-service";

export class TriggerPageHandler {
  static isValidTriggerPage(): boolean {
    return (document.URL.indexOf("editTriggers.html") > -1) && (document.getElementById("buildTriggersTable") !== null);
  }

  private teamCity: TeamCity;

  constructor(teamCity: TeamCity) {
    this.teamCity = teamCity;

    chrome.runtime.onMessage.addListener((message, sender) => {
      const config = <Config>message;
      this.teamCity.setTeamCityRestApiCredentials(config.teamCityRestApiLogin, config.teamCityRestApiPassword);
    });
  }

  generateCopyLinks(): void {
    const triggersTable = <HTMLTableElement>document.getElementById("buildTriggersTable");

    if (triggersTable === null) {
      console.error("Triggers table was not found on the page");
      return;
    }

    const buildTypeId = this.getBuildTypeId();

    triggersTable.querySelectorAll("tr > td.highlight.edit").forEach(cell => {
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
        this.copyTriggerRequest(triggerId, buildTypeId);
      });

      newCell.appendChild(br);
      newCell.appendChild(copyLink);
    });
  }

  private copyTriggerRequest(triggerId: string, buildTypeId: string): void {
    this.teamCity.getTrigger(triggerId, buildTypeId)
    .then(trigger => this.teamCity.addTrigger(trigger, buildTypeId))
    .then(() => location.reload())
    .catch(statusCode =>  {
      if (statusCode === 401) {
        console.error(`Request returns the error. Status code: ${statusCode}. You have to enter REST API authorization data on the extension options page.`);
        chrome.runtime.sendMessage({ action: "authorization" });
      } else {
        console.error(`Request returns the error. Status code: ${statusCode}`);
      }
    });
  }

  private getBuildTypeId(): string {
    const title = document.querySelector("#restPageTitle > div[data-buildtypeid]");

    if (!title) {
     console.error("Couldn't find build title on the page");
     return;
    }

    return title.getAttribute("data-buildtypeid");
  }

  private getTriggerIdFromRow(triggerRowElement: HTMLElement): string {
    const btnSpan = triggerRowElement.querySelector("td > span.btn-group");
    const spanId = (btnSpan && btnSpan.id) ? btnSpan.id : "";

    return spanId.replace("sp_span_triggerActions", "");
  }
}
