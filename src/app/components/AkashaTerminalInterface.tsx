'use client';

import React, { useState, useEffect } from 'react';
import * as TC from './terminal_components';

interface DataCloudInputType {
  type: 'snippets' | 'brainstorm' | '',
  info: string[],
}

const AkashaTerminalInterface: React.FC = () => {
  const [data, setData] = useState<DataCloudInputType>({ type: '', info: [] });
  const [answer, setAnswer] = useState<string>('');
  const [moveQueryBarUp, setMoveQueryBarUp] = useState(false);
  const [queryBarIsUp, setQueryBarIsUp] = useState(false);
  const [answerIsReady, setAnswerIsReady] = useState(false);
  const [queryStatus, setQueryStatus] = useState<statusCode>('')

  const handleQuery = (query: string) => {
    if (!query) {
      console.error('This should never occur because the button should be disabled if the query is empty');
      return;
    }

    setQueryStatus('receivedQuery');
    if (!moveQueryBarUp) {
      setMoveQueryBarUp(true);
      setTimeout(() => {
        setQueryBarIsUp(true);
      }, 1000);
    }
    setData({ type: '', info: [] });
    setAnswer('');
    setAnswerIsReady(false);

    const eventSource = new EventSource(`/api/query?query=${encodeURIComponent(query)}`);

    eventSource.addEventListener('message', (event: any) => {
      const message = JSON.parse(event.data);
      console.log(`message: ${message}`);

      switch (message.type) {
        case 'snippets':
          console.log('Received snippets.');
          setTimeout(() => {
            setQueryStatus('searchingDatabase');
          }
          , 1000);
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
          setQueryStatus('error');
          eventSource.close();
          console.log('Closed connection due to error.')
          break;
      }
    });
  };

  useEffect(() => {
    if (!answerIsReady) return;
    setTimeout(() => {
      setQueryStatus('done');
    }, 3000);
  }, [answerIsReady]);

  const acceptingInput = queryStatus === 'done' || queryStatus === 'error' || queryStatus === '';

  return (
    <div className={`relative grid grid-rows-6 h-[75vh] w-[70vw] min-w-[250px] transition-all ease-in-out duration-500`}>
      <div className={`z-30 row-start-4 absolute w-full transition-transform ease-in-out duration-1000 ${moveQueryBarUp && 'transform -translate-y-[37.5vh]'}`}>
        <TC.QueryBar handleQuery={handleQuery} acceptingInput={acceptingInput} />
        {queryBarIsUp && (
          <div className="z-40 absolute left-[28%] mt-2 transition-all ease-in-out duration-500">
            <TC.StatusBar status={queryStatus} />
          </div>
        )}
      </div>
  
      {queryBarIsUp && (
        <>
          {(data.info.length > 0) && (
            <div className="relative row-start-2 row-end-7 h-full w-full transition-opacity ease-in-out duration-500 opacity-0 appear opacity-100">
              <TC.DataWordCloud data={data} setAnswerIsReady={setAnswerIsReady} setQueryStatus={setQueryStatus}/>
              {answerIsReady && (
                <div className="z-20 absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-opacity ease-in-out duration-500 opacity-0 appear opacity-100">
                  <TC.AkashaResponse answer={answer} />
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
  
};

export default AkashaTerminalInterface;
