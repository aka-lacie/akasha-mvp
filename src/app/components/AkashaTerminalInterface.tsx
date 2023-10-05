'use client';

import React, { useState, useEffect } from 'react';
import QueryBar from './QueryBar';
import DataWordCloud from './DataWordCloud';
import AkashaResponse from './AkashaResponse';

interface DataCloudInputType {
  type: 'snippets' | 'brainstorm' | '',
  info: string[],
}

const AkashaTerminalInterface: React.FC = () => {
  const [data, setData] = useState<DataCloudInputType>({ type: '', info: [] });
  const [answer, setAnswer] = useState<string>('');
  const [queryBarIsUp, setQueryBarIsUp] = useState(false);

  const handleQuery = (query: string) => {
    if (!query) {
      console.error('This should never occur because the button should be disabled if the query is empty');
      return;
    }

    setQueryBarIsUp(true); // once this is set, the query bar stays up until AkashaTerminalInferface is unmounted
    setData({ type: '', info: [] });
    setAnswer('');

    const eventSource = new EventSource(`/api/query?query=${encodeURIComponent(query)}`);

    eventSource.addEventListener('message', (event: any) => {
      const message = JSON.parse(event.data);
      console.log(`message: ${message}`);

      switch (message.type) {
        case 'snippets':
          console.log('Received snippets.');
          setData({type: 'snippets', info: message.data});
          break;
        case 'response':
          setData({type: 'brainstorm', info: message.data['brainstorm']})
          setAnswer(message.data['answer']);
          eventSource.close();
          console.log('Received answer and closed connection.')
          break;
        case 'error':
          console.error('Error:', message.data);
          eventSource.close();
          console.log('Closed connection due to error.')
          break;
      }
    });
  };

  return (
    <div className="transition-all ease-in-out duration-500">
      <div className={`${queryBarIsUp ? 'mt-8' : 'mt-30'} transition-all ease-in-out duration-500`}>
        <QueryBar handleQuery={handleQuery} />
      </div>
      {(data.info.length > 0) && (
        <div className="transition-opacity ease-in-out duration-500 opacity-0 appear opacity-100">
          <DataWordCloud data={data} />
        </div>
      )}
      {answer && (
        <div className="transition-opacity ease-in-out duration-500 opacity-0 appear opacity-100">
          <AkashaResponse answer={answer} />
        </div>
      )}
    </div>
  );
};


export default AkashaTerminalInterface;
