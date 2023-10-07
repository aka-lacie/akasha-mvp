interface QueryBarProps {
  handleQuery: (query: string) => void;
  acceptingInput: boolean;
}

type statusCodes = 'receivedQuery' | 'searchingDatabase' | 'receivedData' | 'thinking' | 'done' | 'error' | '';

interface StatusBarProps {
  status: statusCodes;
}

interface DataWordCloudProps {
  data: { 
    type: 'snippets' | 'brainstorm' | '',
    info: string[],
  },

  setAnswerIsReady: React.Dispatch<React.SetStateAction<boolean>>,
}

interface Position { x: number, y: number }

interface AkashaResponseProps {
  answer: string;
}

interface ReconstructingTextProps {
  targetString: string;
}
