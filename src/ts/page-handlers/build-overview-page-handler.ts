import { TextContentParser } from "../utils/text-content-parser";

export class BuildOverviewPageHandler {
  private buildId: string;
  private buildTypeId: string;

  constructor() {
    const build = this.getBuildIds();

    this.buildId = build.buildId;
    this.buildTypeId = build.buildTypeId;
  }

  static isValidBuildOVerviewPage(): boolean {
    return (document.URL.indexOf("viewLog.html") > -1) && (document.querySelector("#buildResultsDiv_Tab.selected") !== null);
  }

  inlineScreenshotsToFailedTests() {
    if (!window || !MutationObserver) {
      console.error("MutationObserver is not supported for current browser version");
      return;
    }

    const observerConfig = {
      childList: true,
      subtree: true
    };

    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (mutation.type === "childList") {
          mutation.addedNodes.forEach(addedNode => {
            this.inlineScreenshot(addedNode);
          });
        }
      });
    });

    const testListElement = document.querySelector("table.testList");

    if (testListElement) {
      observer.observe(testListElement, observerConfig);
    }
  }

  private inlineScreenshot(stackTraceNode: Node): void {
    const artifact = TextContentParser.extractArtifactPathFromStackTrace(stackTraceNode.textContent);

    if (!artifact || !artifact.path) {
      return;
    }

    const screenshotImageElement = document.createElement("img");
    screenshotImageElement.src = this.createArtifactImagePath(artifact.path, artifact.publishPath);

    const stackTraceElement = stackTraceNode.parentElement;
    stackTraceElement.parentElement.appendChild(screenshotImageElement);
  }

  private createArtifactImagePath(path: string, publishPath: string) {
    const imageUrl = `/repository/download/${this.buildTypeId}/${this.buildId}:id/${publishPath}/${path}`
      .replace("//", "/");

    return imageUrl;
  }

  private getBuildIds(): { buildTypeId: string, buildId: string } {
    const url = new URL(location.toString());
    const buildTypeId = url.searchParams.get("buildTypeId");
    const buildId = url.searchParams.get("buildId");

    return { buildTypeId, buildId };
  }
}
