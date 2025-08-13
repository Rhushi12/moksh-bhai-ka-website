import React, { useState, useRef, useEffect, useCallback } from 'react';
import { parsePhoneNumber, isValidPhoneNumber, AsYouType } from 'libphonenumber-js';
import { ChevronDown, Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { countries, Country, defaultCountry, filterCountries, findCountryByDialCode } from '@/data/countries';

export interface PhoneInputProps {
  value?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  error?: boolean;
  defaultCountry?: Country;
  required?: boolean;
  name?: string;
  id?: string;
}

export const PhoneInput: React.FC<PhoneInputProps> = ({
  value = '',
  onChange,
  onBlur,
  placeholder = 'Enter phone number',
  className,
  disabled = false,
  error = false,
  defaultCountry: initialCountry = defaultCountry,
  required = false,
  name,
  id,
}) => {
  const [selectedCountry, setSelectedCountry] = useState<Country>(initialCountry);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCountries, setFilteredCountries] = useState(countries);
  const [inputValue, setInputValue] = useState('');
  const [isTypingCountryCode, setIsTypingCountryCode] = useState(false);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Initialize formatter for the selected country
  const formatter = new AsYouType(selectedCountry.code);

  // Update filtered countries when search term changes
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredCountries(countries);
    } else {
      setFilteredCountries(filterCountries(searchTerm));
    }
  }, [searchTerm]);

  // Handle country selection
  const handleCountrySelect = useCallback((country: Country) => {
    setSelectedCountry(country);
    setIsDropdownOpen(false);
    setSearchTerm('');
    
    // Focus back to phone input
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  }, []);

  // Handle phone number input changes
  const handlePhoneNumberChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setInputValue(inputValue);

    // Check if user is typing a country code at the beginning
    if (inputValue.startsWith('+')) {
      const dialCodeMatch = inputValue.match(/^\+\d+/);
      if (dialCodeMatch) {
        const dialCode = dialCodeMatch[0];
        const matchingCountry = findCountryByDialCode(dialCode);
        
        if (matchingCountry && matchingCountry.code !== selectedCountry.code) {
          setSelectedCountry(matchingCountry);
          setIsTypingCountryCode(true);
        }
      }
    }

    // Format the phone number
    const formattedNumber = formatter.input(inputValue);
    const nationalNumber = formattedNumber.replace(selectedCountry.dialCode, '').trim();
    
    setPhoneNumber(nationalNumber);
    
    // Combine country code and national number
    const fullNumber = selectedCountry.dialCode + nationalNumber;
    
    if (onChange) {
      onChange(fullNumber);
    }
  }, [selectedCountry, formatter, onChange]);

  // Handle input focus
  const handleInputFocus = useCallback(() => {
    setIsTypingCountryCode(false);
  }, []);

  // Handle dropdown open/close
  const handleDropdownToggle = useCallback((open: boolean) => {
    setIsDropdownOpen(open);
    if (open) {
      // Focus search input when dropdown opens
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    } else {
      setSearchTerm('');
    }
  }, []);

  // Handle search input changes
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }, []);

  // Clear search
  const handleClearSearch = useCallback(() => {
    setSearchTerm('');
    searchInputRef.current?.focus();
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsDropdownOpen(false);
      setSearchTerm('');
    }
  }, []);

  // Update input value when external value changes
  useEffect(() => {
    if (value) {
      try {
        const parsed = parsePhoneNumber(value);
        if (parsed && parsed.country) {
          const country = findCountryByDialCode('+' + parsed.countryCallingCode);
          if (country) {
            setSelectedCountry(country);
            setPhoneNumber(parsed.nationalNumber || '');
            setInputValue(parsed.nationalNumber || '');
          }
        }
      } catch (error) {
        // If parsing fails, just set the raw value
        setPhoneNumber(value);
        setInputValue(value);
      }
    } else {
      setPhoneNumber('');
      setInputValue('');
    }
  }, [value]);

  return (
    <div className={cn('relative', className)}>
      <div className="flex items-center">
        {/* Country Code Selector */}
        <DropdownMenu open={isDropdownOpen} onOpenChange={handleDropdownToggle}>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              variant="outline"
              className={cn(
                'h-10 rounded-r-none border-r-0 px-3 py-2 text-sm font-medium',
                'flex items-center gap-2 min-w-[100px] sm:min-w-[120px] justify-between',
                'bg-gray-700 border-gray-600 text-gray-50 hover:bg-gray-600',
                error && 'border-destructive',
                disabled && 'opacity-50 cursor-not-allowed'
              )}
              disabled={disabled}
            >
              <span className="text-lg">{selectedCountry.flag}</span>
              <span className="text-xs text-gray-300">{selectedCountry.dialCode}</span>
              <ChevronDown className="h-4 w-4 text-gray-300" />
            </Button>
          </DropdownMenuTrigger>
          
          <DropdownMenuContent
            ref={dropdownRef}
            className="w-80 max-h-80 overflow-hidden bg-gray-800 border-gray-600"
            onKeyDown={handleKeyDown}
          >
            {/* Search Input */}
            <div className="p-2 border-b border-gray-600">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search countries..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="pl-10 pr-8 bg-gray-700 border-gray-600 text-gray-50 focus:border-gray-400 focus:ring-2 focus:ring-gray-400"
                />
                {searchTerm && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                    onClick={handleClearSearch}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </div>

            {/* Countries List */}
            <div className="max-h-60 overflow-y-auto">
              {filteredCountries.length > 0 ? (
                filteredCountries.map((country) => (
                  <DropdownMenuItem
                    key={country.code}
                    onClick={() => handleCountrySelect(country)}
                    className="flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-gray-700 text-gray-50"
                  >
                    <span className="text-lg">{country.flag}</span>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm truncate text-gray-50">{country.name}</div>
                      <div className="text-xs text-gray-400">{country.dialCode}</div>
                    </div>
                  </DropdownMenuItem>
                ))
              ) : (
                <div className="px-3 py-2 text-sm text-gray-400">
                  No countries found
                </div>
              )}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Phone Number Input */}
        <Input
          ref={inputRef}
          type="tel"
          value={inputValue}
          onChange={handlePhoneNumberChange}
          onFocus={handleInputFocus}
          onBlur={onBlur}
          placeholder={placeholder}
          className={cn(
            'rounded-l-none border-l-0 flex-1',
            'bg-gray-700 border-gray-600 text-gray-50 focus:border-gray-400 focus:ring-2 focus:ring-gray-400',
            error && 'border-destructive',
            disabled && 'opacity-50 cursor-not-allowed'
          )}
          disabled={disabled}
          required={required}
          name={name}
          id={id}
        />
      </div>

      {/* Error indicator */}
      {error && (
        <div className="absolute -bottom-5 left-0 text-xs text-red-400">
          Please enter a valid phone number
        </div>
      )}
    </div>
  );
};

export default PhoneInput; 