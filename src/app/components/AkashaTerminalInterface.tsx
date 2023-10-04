'use client';

import React, { useState } from 'react';
import QueryBar from './QueryBar';
import DataWordCloud from './DataWordCloud';
import AkashaResponse from './AkashaResponse';

const AkashaTerminalInterface: React.FC = () => {
  const [data, setData] = useState<Array<string>>([]);
  const [answer, setAnswer] = useState<string>('');

  const handleQuery = (query: string) => {
    console.log('Hello from handleQuery!');
    if (!query) {
      console.error('This should never occur because the button should be disabled if the query is empty');
      return;
    }

    const eventSource = new EventSource(`/api/query?query=${encodeURIComponent(query)}`);

    eventSource.addEventListener('message', (event: any) => {
      const message = JSON.parse(event.data);
      console.log(`message: ${message}`);

      switch (message.type) {
        case 'snippets':
          console.log('Received snippets.');
          setData(message.data);
          break;
        case 'response':
          setData(message.data['brainstorm'])
          setAnswer(message.data['answer']);
          eventSource.close();  // Close the connection after receiving the answer
          console.log('Received answer and closed connection.')
          break;
        case 'error':
          console.error('Error:', message.data);
          eventSource.close();
          console.log('Closed connection due to error.')
          break;
      }
    });

    // Send the query to the server
    // fetch('/api/query', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({ query }),
    // });
  };

  return (
    <div>
      <QueryBar handleQuery={handleQuery} />
      <DataWordCloud data={data} />
      <AkashaResponse answer={answer} />
    </div>
  );
};


export default AkashaTerminalInterface;
