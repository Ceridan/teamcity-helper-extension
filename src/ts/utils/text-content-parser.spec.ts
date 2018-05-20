import { TextContentParser } from "./text-content-parser";

describe("TextContentParser static class", () => {
  it("should convert hex value to symbol", () => {
    expect(TextContentParser.convertHexToSymbol("0x005A")).toBe("Z");
    expect(TextContentParser.convertHexToSymbol("0x007A")).toBe("z");
    expect(TextContentParser.convertHexToSymbol("0x0416")).toBe("Ж");
    expect(TextContentParser.convertHexToSymbol("0x0436")).toBe("ж");
  });

  it("should replace hex values with symbols in path", () => {
    const pathWithoutHex = "My_test_image.png";

    // "My_test_image.png" translation to Russian: "Моя_тестовая_картинка.png". Teamcity will print it using char codes for Russian symbols
    const pathWithHex = "|0x041c|0x043e|0x044f_|0x0442|0x0435|0x0441|0x0442|0x043e|0x0432|0x0430|0x044f_|0x043a|0x0430|0x0440|0x0442|0x0438|0x043d|0x043a|0x0430.png";

    expect(TextContentParser.replaceHexInPath(pathWithoutHex)).toBe("My_test_image.png");
    expect(TextContentParser.replaceHexInPath(pathWithHex)).toBe("Моя_тестовая_картинка.png");
  });

  it ("should extract artifacts path from the stacktrace", () => {
    const baseStackTrace = "at OpenQA.Selenium.Remote.RemoteWebDriver.UnpackAndThrowOnError(Response errorResponse)\n" +
      "at OpenQA.Selenium.Remote.RemoteWebDriver.Execute(String driverCommandToExecute, Dictionary`2 parameters)\n" +
      "at OpenQA.Selenium.Remote.RemoteWebDriver.FindElement(String mechanism, String value)\n";

    // Artifact should be extracted from the following lines
    const artifactWithPublishFolder = "##teamcity[publishArtifacts 'BuildAgentPath\\|0x041c|0x043e|0x044f_|0x0442|0x0435" +
      "|0x0441|0x0442|0x043e|0x0432|0x0430|0x044f_|0x043a|0x0430|0x0440|0x0442|0x0438|0x043d|0x043a|0x0430.png => screenshots']";

    const artifactWithoutPublishFolder = "##teamcity[publishArtifacts 'BuildAgentPath\\|0x041c|0x043e|0x044f_|0x0442|0x0435" +
      "|0x0441|0x0442|0x043e|0x0432|0x0430|0x044f_|0x043a|0x0430|0x0440|0x0442|0x0438|0x043d|0x043a|0x0430.png']";

    const extractWithPublishFolder = TextContentParser.extractArtifactPathFromStackTrace(baseStackTrace + artifactWithPublishFolder);
    const extractWithoutPublishFolder = TextContentParser.extractArtifactPathFromStackTrace(baseStackTrace + artifactWithoutPublishFolder);

    expect(extractWithPublishFolder.path).toBe("Моя_тестовая_картинка.png");
    expect(extractWithPublishFolder.publishPath).toBe("screenshots");
    expect(extractWithoutPublishFolder.path).toBe("Моя_тестовая_картинка.png");
    expect(extractWithoutPublishFolder.publishPath).toBe("");
  });
});
