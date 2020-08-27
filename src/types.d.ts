type QCLanguage = 'C#' | 'F#' | 'VB' | 'Ja' | 'Py';
type QCCompileState = 'InQueue' | 'BuildSuccess' | 'BuildError';

interface QCCollaborator {
  id: number;
  uid: number;
  blivecontrol: boolean;
  epermission: string;
  profileimage: string;
  name: string;
}

interface QCLiveResults {
  eStatus: string;
  sDeployID: string;
  sServerType: string;
  dtLaunched: string;
  dtStopped: string;
  sBrokerage: string;
  sSecurityTypes: string;
  dUnrealized: number;
  dfees: number;
  dnetprofit: number;
  dEquity: number;
  dHoldings: number;
  dCapital: number;
  dVolume: number;
  iTrades: number;
  sErrorMessage: string;
}

interface QCProject {
  projectId: number;
  organizationId: string;
  name: string;
  created: Date;
  modified: Date;
  language: QCLanguage;
  collaborators: QCCollaborator[];
  leanVersionId: number;
  leanPinnedToMaster: boolean;
  liveResults: QCLiveResults;
  libraries: number[];
}

interface QCFile {
  name: string;
  content: string;
  modified: Date;
  isLibrary: boolean;
}

interface QCCompile {
  compileId: string;
  state: QCCompileState;
  logs: string[];
}

interface QCBacktest {
  name: string;
  note?: string;
  backtestId: string;
  completed: boolean;
  progress: number;
  result?: any;
  error?: string;
  stacktrace?: string;
  created: Date;
}

interface QCBacktestReport {
  report: string;
}

interface QCNode {
  id: string;
  name: string;
  projectName: string;
  description: string;
  usedBy: string;
  sku: string;
  busy: boolean;
  price: QCNodePrice;
  speed: number;
  cpu: number;
  ram: number;
}

interface QCNodePrice {
  monthly: number;
  yearly: number;
}

interface QCNodeList {
  backtest: QCNode[];
  research: QCNode[];
  live: QCNode[];
}
