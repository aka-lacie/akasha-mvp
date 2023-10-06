import { useState } from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';

interface QueryBarProps {
  handleQuery: (query: string) => void;
}

const QueryBar: React.FC<QueryBarProps> = ({ handleQuery }) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (query.trim()) {
      handleQuery(query);
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const isExpanded = isFocused || query.trim();

  const isQueryEmpty = !query.trim();

  return (
    <div className={`flex justify-center`}>
      <form
        onSubmit={handleSubmit}
        className="flex rounded-full overflow-hidden transition-all"
      >
        <input
          className={`flex-grow py-2 px-4 rounded-l-full text-black dark:text-white focus:outline-none bg-white dark:bg-gray-700 transition-all ease-in-out duration-300 ${isExpanded ? 'w-96' : 'w-64'}`}
          type="text"
          placeholder="Search the Irminsul..."
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          type="submit"
          className={`py-2 px-4 rounded-r-full drop-shadow text-white ${isQueryEmpty ? 'bg-green-300 dark:bg-green-400 dark:saturate-50 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'} transition-all ease-in-out duration-300 ${isExpanded ? 'w-16' : 'w-12'}`}
          disabled={isQueryEmpty}
        >
          <i className="fas fa-search"></i>
        </button>
      </form>
    </div>
  );
};

export default QueryBar;
