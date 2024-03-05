import { useState } from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import SearchSuggestions from './SearchSuggestions';

const QueryBar: React.FC<QueryBarProps> = ({ handleQuery, acceptingInput }) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  // when a query is submitted, this value is set to true, causing the search suggestions to be hidden
  const [handledFirstQuery, setHandledFirstQuery] = useState(false);

  // the prop 'handleQuery' must never be called directly
  // instead, use this function to ensure that the search suggestions are simultaneously hidden
  const handleQueryAndHideSuggestions = (query: string) => {handleQuery(query); setHandledFirstQuery(true)};

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isQueryEmpty && acceptingInput) {
      handleQueryAndHideSuggestions(query.trim());
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const isQueryEmpty = !query.trim().replace(/[^a-zA-Z]/g, '');
  const isExpanded = isFocused || !isQueryEmpty;

  return (<>
    <div className={`flex justify-center`}>
      <form
        onSubmit={handleSubmit}
        className="flex rounded-full overflow-hidden transition-all"
      >
        <input
          className={`flex-grow py-2 px-4 rounded-l-full text-black dark:text-white focus:outline-none bg-white dark:bg-gray-700 transition-all ease-in-out duration-300 w-52 ${isExpanded && 'md:w-96'}`}
          type="text"
          placeholder="Search the Irminsul..."
          maxLength={100}
          onFocus={handleFocus}
          onBlur={handleBlur}
          value={query}
          onChange={(e) => {
            e.preventDefault();
            setQuery(e.target.value);
          }}
        />
        <button
          type="submit"
          className={`py-2 px-4 rounded-r-full min-w-[40px] drop-shadow text-white ${(isQueryEmpty || !acceptingInput) ? 'bg-green-300 dark:bg-green-400 dark:saturate-50 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'} transition-all ease-in-out duration-300 w-12 ${isExpanded && 'md:w-16'}`}
          disabled={isQueryEmpty}
        >
          <i className="fas fa-search" />
        </button>
      </form>
    </div>
    <div className='flex justify-center'>
      <SearchSuggestions
        hide={handledFirstQuery}
        clickSuggestion={(suggestedQuery)=>{
          handleQueryAndHideSuggestions(suggestedQuery)
          setQuery(suggestedQuery)
        }}
      />
    </div>
  </>);
};

export default QueryBar;
