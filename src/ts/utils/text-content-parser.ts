export class TextContentParser {
  static extractArtifactPathFromStackTrace(stackTrace: string): { path: string, publishPath: string } {
    if (!stackTrace || stackTrace.indexOf("##teamcity[publishArtifacts") === -1) {
      return null;
    }

    const re = /##teamcity\[publishArtifacts\s*('|")(.+(\\|\/))*((.+)=>(.+)('|")|(.+))\]/;
    const reMatchResult = re.exec(stackTrace);
    const path = reMatchResult.length > 8 ? (reMatchResult[5] || reMatchResult[8]).trim() : "";
    const publishPath = reMatchResult.length > 8 ? (reMatchResult[6] || "").trim() : "";
    const replacedPath = TextContentParser.replaceHexInPath(path);

    return { path: replacedPath, publishPath: publishPath };
  }

  static replaceHexInPath(path: string): string {
    return path.replace(/\|(0x\S{4})/g, (match, g1) => TextContentParser.convertHexToSymbol(g1));
  }

  static convertHexToSymbol(hex: string): string {
    return String.fromCharCode(parseInt(hex));
  }
}
