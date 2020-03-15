type QCLanguage = 'C#' | 'F#' | 'VB' | 'Ja' | 'Py';
type QCCompileState = 'InQueue' | 'BuildSuccess' | 'BuildError';

interface QCProject {
  projectId: number;
  name: string;
  created: Date;
  modified: Date;
  language: QCLanguage;
}

interface QCFile {
  name: string;
  content: string;
  modified: Date;
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
