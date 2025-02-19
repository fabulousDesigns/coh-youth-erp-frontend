// components/library/library-filters.tsx
import { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import { Button } from '../ui/button';

interface LibraryFiltersProps {
  onSearch: (term: string) => void;
  onFilterChange: (filters: { type?: string }) => void;
}

export function LibraryFilters({ onSearch, onFilterChange }: LibraryFiltersProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('');

  const handleSearch = () => {
    onSearch(searchTerm);
  };

  const handleTypeChange = (type: string) => {
    setSelectedType(type);
    onFilterChange({ type });
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="flex-1 flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search materials..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 pl-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-secondary-400" />
        </div>
        <Button onClick={handleSearch}>Search</Button>
      </div>

      <select
        value={selectedType}
        onChange={(e) => handleTypeChange(e.target.value)}
        className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
      >
        <option value="">All Types</option>
        <option value="document">Documents</option>
        <option value="spreadsheet">Spreadsheets</option>
        <option value="presentation">Presentations</option>
        <option value="image">Images</option>
      </select>
    </div>
  );
}