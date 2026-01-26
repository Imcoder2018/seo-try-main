"use client";

import { useState, useEffect, useRef } from "react";
import { MapPin, Search, X, ChevronDown, Loader2, Check } from "lucide-react";

interface LocationSelectorProps {
  selectedLocations: string[];
  onLocationChange: (locations: string[]) => void;
}

interface Country {
  country: string;
  iso2: string;
  iso3: string;
}

interface City {
  name: string;
}

export default function LocationSelector({
  selectedLocations,
  onLocationChange,
}: LocationSelectorProps) {
  const [countries, setCountries] = useState<Country[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoadingCountries, setIsLoadingCountries] = useState(false);
  const [isLoadingCities, setIsLoadingCities] = useState(false);
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [filteredCities, setFilteredCities] = useState<string[]>([]);
  const countryRef = useRef<HTMLDivElement>(null);
  const cityRef = useRef<HTMLDivElement>(null);

  // Fetch countries on mount
  useEffect(() => {
    fetchCountries();
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (countryRef.current && !countryRef.current.contains(event.target as Node)) {
        setShowCountryDropdown(false);
      }
      if (cityRef.current && !cityRef.current.contains(event.target as Node)) {
        setShowCityDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter cities based on search query
  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = cities.filter((city) =>
        city.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredCities(filtered.slice(0, 20));
      setShowCityDropdown(filtered.length > 0);
    } else {
      setFilteredCities(cities.slice(0, 20));
      setShowCityDropdown(false);
    }
  }, [searchQuery, cities]);

  const fetchCountries = async () => {
    setIsLoadingCountries(true);
    try {
      const response = await fetch("https://countriesnow.space/api/v0.1/countries/iso");
      const data = await response.json();
      if (data.data) {
        setCountries(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch countries:", error);
      // Fallback to common countries
      setCountries([
        { country: "Pakistan", iso2: "PK", iso3: "PAK" },
        { country: "United States", iso2: "US", iso3: "USA" },
        { country: "United Kingdom", iso2: "GB", iso3: "GBR" },
        { country: "Canada", iso2: "CA", iso3: "CAN" },
        { country: "Australia", iso2: "AU", iso3: "AUS" },
        { country: "India", iso2: "IN", iso3: "IND" },
        { country: "United Arab Emirates", iso2: "AE", iso3: "ARE" },
        { country: "Saudi Arabia", iso2: "SA", iso3: "SAU" },
        { country: "Germany", iso2: "DE", iso3: "DEU" },
        { country: "France", iso2: "FR", iso3: "FRA" },
      ]);
    } finally {
      setIsLoadingCountries(false);
    }
  };

  const fetchCities = async (country: string) => {
    setIsLoadingCities(true);
    setCities([]);
    try {
      const response = await fetch("https://countriesnow.space/api/v0.1/countries/cities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ country }),
      });
      const data = await response.json();
      if (data.data) {
        setCities(data.data);
        setFilteredCities(data.data.slice(0, 20));
      }
    } catch (error) {
      console.error("Failed to fetch cities:", error);
      // Fallback for Pakistan
      if (country === "Pakistan") {
        const pakistanCities = [
          "Islamabad", "Rawalpindi", "Lahore", "Karachi", "Peshawar",
          "Faisalabad", "Multan", "Gujranwala", "Sialkot", "Quetta",
          "Hyderabad", "Abbottabad", "Bahawalpur", "Sargodha", "Sukkur"
        ];
        setCities(pakistanCities);
        setFilteredCities(pakistanCities);
      }
    } finally {
      setIsLoadingCities(false);
    }
  };

  const handleCountrySelect = (country: string) => {
    setSelectedCountry(country);
    setShowCountryDropdown(false);
    setSearchQuery("");
    fetchCities(country);
  };

  const handleCitySelect = (city: string) => {
    if (!selectedLocations.includes(city)) {
      onLocationChange([...selectedLocations, city]);
    }
    setSearchQuery("");
    setShowCityDropdown(false);
  };

  const handleRemoveLocation = (location: string) => {
    onLocationChange(selectedLocations.filter((l) => l !== location));
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      // Add custom location if Enter is pressed
      if (!selectedLocations.includes(searchQuery.trim())) {
        onLocationChange([...selectedLocations, searchQuery.trim()]);
      }
      setSearchQuery("");
      setShowCityDropdown(false);
    }
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
        Target Locations
      </label>

      {/* Country Selector */}
      <div ref={countryRef} className="relative">
        <button
          type="button"
          onClick={() => setShowCountryDropdown(!showCountryDropdown)}
          className="w-full flex items-center justify-between px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-left"
        >
          <span className={selectedCountry ? "text-slate-900 dark:text-slate-100" : "text-slate-500 dark:text-slate-400"}>
            {selectedCountry || "Select a country..."}
          </span>
          {isLoadingCountries ? (
            <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-400" />
          )}
        </button>

        {showCountryDropdown && (
          <div className="absolute z-20 w-full mt-1 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {countries.map((country, index) => (
              <button
                key={`${country.iso2}-${index}`}
                type="button"
                onClick={() => handleCountrySelect(country.country)}
                className={`w-full px-4 py-2 text-left hover:bg-slate-100 dark:hover:bg-slate-600 text-sm ${
                  selectedCountry === country.country
                    ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                    : "text-slate-700 dark:text-slate-300"
                }`}
              >
                {country.country}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* City Search Input */}
      <div ref={cityRef} className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => {
              if (filteredCities.length > 0) setShowCityDropdown(true);
            }}
            onKeyDown={handleSearchKeyDown}
            placeholder={selectedCountry ? `Search cities in ${selectedCountry}...` : "Select a country first, or type any location..."}
            className="w-full pl-10 pr-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder:text-slate-400"
          />
          {isLoadingCities && (
            <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-slate-400" />
          )}
        </div>

        {showCityDropdown && filteredCities.length > 0 && (
          <div className="absolute z-20 w-full mt-1 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {filteredCities.map((city, index) => (
              <button
                key={`city-${index}-${city}`}
                type="button"
                onClick={() => handleCitySelect(city)}
                className={`w-full px-4 py-2 text-left hover:bg-slate-100 dark:hover:bg-slate-600 text-sm flex items-center justify-between ${
                  selectedLocations.includes(city)
                    ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                    : "text-slate-700 dark:text-slate-300"
                }`}
              >
                <span className="flex items-center gap-2">
                  <MapPin className="w-3 h-3" />
                  {city}
                </span>
                {selectedLocations.includes(city) && (
                  <Check className="w-4 h-4 text-blue-600" />
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Selected Locations */}
      {selectedLocations.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedLocations.map((location) => (
            <span
              key={location}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm"
            >
              <MapPin className="w-3 h-3" />
              {location}
              <button
                type="button"
                onClick={() => handleRemoveLocation(location)}
                className="ml-1 hover:bg-blue-200 dark:hover:bg-blue-800 rounded-full p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      {selectedLocations.length === 0 && (
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Select a country to see cities, or type any location and press Enter to add it.
        </p>
      )}
    </div>
  );
}
