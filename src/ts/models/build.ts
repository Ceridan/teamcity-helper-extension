export class Build {
  id: string;
  buildTypeId: string;
  number: number;
  status: string;
  state: string;
  composite: boolean;
  branchName: string;
  defaultBranch: boolean;
  href: string;
  webUrl: URL;
}
