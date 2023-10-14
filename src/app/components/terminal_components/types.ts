interface QueryBarProps {
  handleQuery: (query: string) => void;
  acceptingInput: boolean;
}

type statusCode = 'receivedQuery' | 'searchingDatabase' | 'receivedData' | 'thinking' | 'constructingAnswer' | 'done' | 'error' | '';

interface StatusBarProps {
  status: statusCode;
  errorMsg?: string;
}

interface DataWordCloudProps {
  data: { 
    type: 'snippets' | 'brainstorm' | '',
    info: string[],
  },

  setAnswerIsReady: React.Dispatch<React.SetStateAction<boolean>>,
  setQueryStatus: React.Dispatch<React.SetStateAction<statusCode>>,
}

interface Position { x: number, y: number }

interface AkashaResponseProps {
  answer: string;
}

interface ReconstructingTextProps {
  targetString: string;
}
