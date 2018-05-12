import { AppConfig } from "./app-config";
import { TeamCityService } from "./services/teamcity-service";
import { TriggerPageHandler } from "./page-handlers/trigger-page-handler";

// Check if we are on the TeamCity page by searching for logo and footer anchor
const teamCityLogoElement = document.querySelector("a.headerLogo i.headerLogoImg");
const teamCityFooterAnchorElement = document.querySelector("div#footer div.column2 > div.columnContent > a");

if (teamCityLogoElement !== null && teamCityFooterAnchorElement !== null
  && (<HTMLAnchorElement>teamCityFooterAnchorElement).href === "https://www.jetbrains.com/teamcity/?fromServer") {

  // Check if we are on the EditTriggers page
  if (TriggerPageHandler.isValidTriggersPage()) {
    AppConfig.getConfig()
      .then(config => {
        const teamCityUrl = document.location.origin;
        const teamCity = new TeamCityService(teamCityUrl, config.teamCityRestApiLogin, config.teamCityRestApiPassword);
        const triggerPageHandler = new TriggerPageHandler(teamCity);
        triggerPageHandler.generateCopyLinks();
      });
  }
}
