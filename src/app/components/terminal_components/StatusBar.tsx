import React from 'react'

const statusMessages = {
  receivedQuery: 'Received query.',
  searchingDatabase: 'Searching database...',
  receivedData: 'Received data.',
  thinking: 'Thinking...',
  done: 'Done.',
  error: 'An ERROR has occurred. Please try a new query.',
}
const StatusBar: React.FC<StatusBarProps> = ({ status }) => {
  return (
    <div className="font-mono after:content-[''] after:w-[1rem] after:h-[2rem] background-inherit inline-block">
      {status && statusMessages[status]}
    </div>
  );
};

export default StatusBar;
