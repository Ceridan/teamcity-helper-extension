import { AppConfig } from "./app-config";
import { TeamCityService } from "./services/teamcity-service";
import { TriggerPageHandler } from "./page-handlers/trigger-page-handler";
import { BuildOverviewPageHandler } from "./page-handlers/build-overview-page-handler";

// Check if we are on the TeamCity page by searching for logo and footer anchor
const teamCityLogoElement = document.querySelector("a.headerLogo i.headerLogoImg");
const teamCityFooterAnchorElement = document.querySelector("div#footer div.column2 > div.columnContent > a");

if (teamCityLogoElement !== null && teamCityFooterAnchorElement !== null
  && (<HTMLAnchorElement>teamCityFooterAnchorElement).href === "https://www.jetbrains.com/teamcity/?fromServer") {

  // Check if we are on the one of the target pages
  if (TriggerPageHandler.isValidTriggerPage()) {
    AppConfig.getConfig()
      .then(config => {
        const teamCityUrl = document.location.origin;
        const teamCity = new TeamCityService(teamCityUrl, config.teamCityRestApiLogin, config.teamCityRestApiPassword);
        const triggerPageHandler = new TriggerPageHandler(teamCity);
        triggerPageHandler.generateCopyLinks();
      });
  } else if (BuildOverviewPageHandler.isValidBuildOVerviewPage()) {
    const buildOverviewPageHandler = new BuildOverviewPageHandler();
    buildOverviewPageHandler.inlineScreenshotsToFailedTests();
  }
}
