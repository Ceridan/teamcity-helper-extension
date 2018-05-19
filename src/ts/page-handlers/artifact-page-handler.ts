export class ArtifactPageHandler {
  static isValidArtifactPage(): boolean {
    return (document.URL.indexOf("viewLog.html") > -1) && (document.URL.indexOf("tab=artifacts") > -1)
      && (document.querySelector("#artifacts_Tab.selected") !== null);
  }

  generateInlineLinks(): void {
    const artifactAnchorElements = document.querySelectorAll("#artifactsTree a");

    for (const element of artifactAnchorElements) {
      const anchorElement = <HTMLAnchorElement>element;

      if (!this.isScreenshotElement(anchorElement)) {
        continue;
      }

      const inlineAnchorElement = document.createElement("a");
      inlineAnchorElement.href = "#";
      inlineAnchorElement.text = "[download and inline screenshots on the test overview tab]";
      inlineAnchorElement.setAttribute("style", "margin-left: 5px; color: blue;");

      inlineAnchorElement.addEventListener("click", (event) => {
        event.stopPropagation();
        this.downloadScreenshots(anchorElement.href);
      });

      anchorElement.parentElement.appendChild(inlineAnchorElement);
    }
  }

  private getBuildIds(): { buildTypeId: string, buildId: string } {
    const url = new URL(location.toString());
    const buildTypeId = url.searchParams.get("buildTypeId");
    const buildId = url.searchParams.get("buildId");

    return { buildTypeId, buildId };
  }

  private downloadScreenshots(fileUrl: string) {
    const build = this.getBuildIds();
    chrome.runtime.sendMessage({
      action: "download",
      url: fileUrl,
      buildTypeId: build.buildTypeId,
      buildId: build.buildId
    });
  }

  private isScreenshotElement(anchorElement: HTMLAnchorElement): boolean {
    return anchorElement.href.indexOf("screenshots") > -1 && anchorElement.href.endsWith(".zip");
  }
}
