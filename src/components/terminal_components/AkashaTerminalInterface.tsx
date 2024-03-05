'use client';

import React, { useState, useEffect, useRef } from 'react';
import QueryBar from './QueryBar';
import StatusBar from './StatusBar';
import DataWordCloud from './DataWordCloud';
import AkashaResponse from './AkashaResponse';
import { cn } from '@/lib/utils';

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
  const interfaceRef = useRef<HTMLDivElement>(null);
  const killWordCloud = useRef<boolean>(false);

  useEffect(() => {
    // if url param is present, set access code
    const urlParams = new URLSearchParams(window.location.search);
    const accessCode = urlParams.get('access_code');
    if (accessCode) {
      localStorage.setItem('accessCode', accessCode);
    }
  }, []);

  const handleQuery = async (query: string) => {
    if (!query && process.env['CURR_ENV'] === 'DEV') {
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
    killWordCloud.current = false;

    const response = await fetch(`/api/query`, {
      method: 'POST',
      headers: { 
          'Access-Code': localStorage.getItem('accessCode') || "akasha-web-client",
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    });

    const reader = response.body?.getReader();
    if (!reader) { // make typescript happy
      return;
    }

    const decoder = new TextDecoder();
    let heartbeatTimeout;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const message = JSON.parse(decoder.decode(value));
      switch (message.type) {
        case 'keep-alive':
          clearTimeout(heartbeatTimeout);
          heartbeatTimeout = setTimeout(() => {
              // No heartbeat received for 10 seconds, assume connection drop
              setQueryStatus('error');
              setErrorMsg('Connection dropped unexpectedly. Please try again.');
              killWordCloud.current = true;
              reader.cancel();
          }, 10000);
          break;
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
          clearTimeout(heartbeatTimeout);
          break;
        case 'error':
          setQueryStatus('error');
          setErrorMsg(message.data);
          reader.cancel();
          clearTimeout(heartbeatTimeout);
          
          if (message.data.includes('access code')) {
            localStorage.setItem('accessCode', '');
            (document.activeElement as HTMLInputElement)?.blur();
          }
          break;
      }
    }
  };

  useEffect(() => {
    if (moveQueryBarUp && interfaceRef.current && window.innerWidth < 768) {
      const interfacePosition = interfaceRef.current.offsetTop;
      window.scrollTo({ top: interfacePosition, behavior: 'auto' });
    }
  }, [moveQueryBarUp]);

  useEffect(() => {
    if (!answerIsReady) return;
    setTimeout(() => {
      setQueryStatus('done');
    }, 3000);
  }, [answerIsReady]);

  const acceptingInput = queryStatus === 'done' || queryStatus === 'error' || queryStatus === '';

  return (
    <div ref={interfaceRef} className={cn(queryStatus!=='' ?
      'min-h-[50%] max-h-[50%] md:min-h-[40%] md:max-h-[40%]' :
      'min-h-[20%] max-h-[20%] md:min-h-[0%] md:max-h-[0%]'
    , 'transitionHeight')}>
      <div className={cn(`flex flex-col
        transition-transform
        ease-in-out duration-1000`)
      }>
        <QueryBar handleQuery={handleQuery} acceptingInput={acceptingInput} />
        {queryBarIsUp && (
          <>
          <div className='p-2' />
          <div className='flex justify-center'>
            <div className="transition-all ease-in-out duration-500 responsiveWidth">
              <StatusBar status={queryStatus} errorMsg={errorMsg} />
            </div>
          </div>
          </>
        )}
      </div>

      {(queryBarIsUp && data.info.length > 0) && (
        <div className="transition-opacity ease-in-out duration-500 appear opacity-100">
          <div className='py-6 sm:py-[5vh]' />
          <DataWordCloud data={data} setAnswerIsReady={setAnswerIsReady} setQueryStatus={setQueryStatus} kill={killWordCloud.current}/>
          {answerIsReady && (
            <div className="flex justify-center relative transform transition-opacity ease-in-out duration-500 appear opacity-100 ">
              <AkashaResponse answer={answer} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AkashaTerminalInterface;