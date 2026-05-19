'use client'

import { SearchIcon } from '../icons';
import { InputProps } from '@/types';

interface SearchInputProps
  extends Omit<InputProps, 'label' | 'prefix' | 'prefixClassName' | 'bottomText' | 'bottomClassName' | 'as' | 'rows'> {
    placeholder?: string;
}

const SearchInput = ({
  value,
  onChange,
  className = '',
  containerClassName = '',
  placeholder = 'Search...',
  ...props
}: SearchInputProps) => {
  return (
    <div className={`relative flex items-center ${containerClassName}`}>
      <div className="absolute right-3 text-gray-400 pointer-events-none">
        <SearchIcon size={20} />
      </div>
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full bg-white border-b border-border pr-10 pl-4 py-2 text-sm text-gray-900 focus:outline-none transition-all ${className}`}
        {...props}
      />
    </div>
  );
};

export default SearchInput;
