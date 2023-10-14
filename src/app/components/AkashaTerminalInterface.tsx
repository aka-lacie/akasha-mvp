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
  const [errorMsg, setErrorMsg] = useState<string>('');

  const handleQuery = async (query: string) => {
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
    setErrorMsg('');

    const response = await fetch(`/api/query`, {
      method: 'POST',
      headers: { 
          'Access-Code': localStorage.getItem('accessCode') || '',
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    });

    const reader = response.body?.getReader();
    if (!reader) { // make typescript happy
      return;
    }
    
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      
      const message = JSON.parse(new TextDecoder().decode(value));
      switch (message.type) {
        case 'snippets':
          setTimeout(() => {
            setQueryStatus('searchingDatabase');
          }
          , 1000);
          setData({type: 'snippets', info: message.data});
          break;
        case 'response':
          setData({type: 'brainstorm', info: message.data['brainstorm']})
          setAnswer(message.data['answer']);
          reader.cancel();
          break;
        case 'error':
          setQueryStatus('error');
          setErrorMsg(message.data);
          reader.cancel();
          
          if (message.data.includes('access code')) {
            localStorage.removeItem('accessCode');
            (document.activeElement as HTMLInputElement)?.blur();
          }
          break;
      }
    }
  };

  useEffect(() => {
    if (!answerIsReady) return;
    setTimeout(() => {
      setQueryStatus('done');
    }, 3000);
  }, [answerIsReady]);

  const acceptingInput = queryStatus === 'done' || queryStatus === 'error' || queryStatus === '';

  return (
    <div className={`relative grid grid-rows-6 h-[75vh] w-[70vw] min-w-[250px] max-w-[100vw] transition-all ease-in-out duration-500`}>
      <div className={`z-30 row-start-4 absolute w-full transition-transform ease-in-out duration-1000 ${moveQueryBarUp && 'transform -translate-y-[37.5vh]'}`}>
        <TC.QueryBar handleQuery={handleQuery} acceptingInput={acceptingInput} />
        {queryBarIsUp && (
          <div className="z-40 absolute left-[10%] md:left-[15%] lg:left-[28%] mt-2 transition-all ease-in-out duration-500">
            <TC.StatusBar status={queryStatus} errorMsg={errorMsg} />
          </div>
        )}
      </div>
  
      {(queryBarIsUp && data.info.length > 0) && (
        <div className="relative row-start-2 row-end-7 h-full max-w-full transition-opacity ease-in-out duration-500 opacity-0 appear opacity-100">
          <TC.DataWordCloud data={data} setAnswerIsReady={setAnswerIsReady} setQueryStatus={setQueryStatus}/>
          {answerIsReady && (
            <div className="z-20 absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-opacity ease-in-out duration-500 opacity-0 appear opacity-100">
              <TC.AkashaResponse answer={answer} />
            </div>
          )}
        </div>
      )}
    </div>
  );
  
};

export default AkashaTerminalInterface;
