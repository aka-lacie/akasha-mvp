import { useState } from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';

const QueryBar: React.FC<QueryBarProps> = ({ handleQuery, acceptingInput }) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isQueryEmpty && acceptingInput) {
      handleQuery(query.trim());
    }
  };

  const handleFocus = () => {
    setIsFocused(true);

    if (!localStorage.getItem('accessCode')) {
      const code = prompt('Please enter your invitation code:');
      if (code) {
        localStorage.setItem('accessCode', code);
      } else {
        (document.activeElement as HTMLInputElement)?.blur();
      }
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const isQueryEmpty = !query.trim().replace(/[^a-zA-Z]/g, '');
  const isExpanded = isFocused || !isQueryEmpty;

  return (
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
          onChange={(e) => setQuery(e.target.value)}
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
  );
};

export default QueryBar;
