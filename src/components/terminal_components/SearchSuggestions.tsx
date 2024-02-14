import { cn } from '@/lib/utils';
import './SearchSuggestion.css';
import { MouseEventHandler } from 'react';

// this page currently assumes that there are always 4 suggestion buttons
// however, it can easily be changes to work for more

// queries to suggest to the user
// make sure the suggestion buttons look right on all screen sizes
// every time they are changed
const suggestedQueries = [
  'What is the meaning of life?',
  'How do I find happiness?',
  'What is the best way to learn a new language?',
  'How do I find a job?',
];

const SearchSuggestions = (props: {
  hide: boolean
  clickSuggestion: (suggestion: string) => void
}) => {
  const hideIfNeeded = props.hide ? 'scale-0 opacity-0' : '';
  const buttonStyle = `
    bg-green-300 dark:bg-green-400 dark:saturate-50
    hover:bg-green-400 dark:hover:bg-green-500
    text-slate-500 dark:text-slate-900
    py-2 px-3 rounded-full
    font-mono
    min-w-max
  `;

  const clickHandlers = suggestedQueries.map((query):MouseEventHandler<HTMLButtonElement>=>{
    return (e)=>{props.clickSuggestion(query)}
  })
  const gridSettings = "sm:max-h-full sm:grid sm:grid-cols-2 sm:grid-rows-2 sm:gap-2"

  return (
    <div className={cn(hideIfNeeded, 'absolute disappearingComponent fadingScrollWidth')}>
      <div className='py-5'/>
      <div className="font-mono text-green-100 dark:text-green-400 text-sm text-center">
        Not sure what to ask? Try these queries!
      </div>
      <div className='py-1'/>
      <div className='overflow-x-scroll maskedOverflow'>
        <div className='flex gap-2 sm:flex-wrap sm:justify-center'>
          <button className={cn(buttonStyle, 'ml-14 sm:ml-0')} onClick={clickHandlers[0]}>
            {suggestedQueries[0]}
          </button>
          <button className={buttonStyle} onClick={clickHandlers[1]}>
            {suggestedQueries[1]}
          </button>
          <button className={buttonStyle} onClick={clickHandlers[2]}>
            {suggestedQueries[2]}
          </button>
          <button className={buttonStyle} onClick={clickHandlers[3]}>
            {suggestedQueries[3]}
          </button>
          <div className='px-7' />
        </div>
      </div>
    </div>
  );
};

export default SearchSuggestions;
