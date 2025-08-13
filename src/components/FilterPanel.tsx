import React, { useState, useEffect, useMemo } from 'react';
import { useFilter } from '@/contexts/FilterContext';
import { useFirebase } from '@/contexts/FirebaseContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Label } from '@/components/ui/label';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { X, RotateCcw, Filter, ChevronDown, ChevronUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { generateDynamicFilterOptions, categorizeFilterOptions } from '@/lib/utils';

export const FilterPanel: React.FC = () => {
  const {
    state,
    setShape,
    setColor,
    setClarity,
    setCut,
    setCaratRange,
    setPriceRange,
    setPriceType,
    setGrowthType,
    setLocation,
    setSupplier,
    toggleFilterPanel,
    resetAllFilters,
    hasActiveFilters,
    getActiveFiltersCount
  } = useFilter();
  
  const { diamonds: firebaseDiamonds } = useFirebase();
  const { toast } = useToast();
  const [localCaratRange, setLocalCaratRange] = useState(state.carat_range);
  const [localPriceRange, setLocalPriceRange] = useState(state.price_range);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['shape']));

  // Generate dynamic filter options based on available diamonds
  const dynamicOptions = useMemo(() => {
    return generateDynamicFilterOptions(firebaseDiamonds || []);
  }, [firebaseDiamonds]);

  // Categorize the dynamic options
  const categorizedOptions = useMemo(() => {
    return categorizeFilterOptions(dynamicOptions);
  }, [dynamicOptions]);

  // Track changes to show unsaved changes indicator
  useEffect(() => {
    const hasChanges = 
      JSON.stringify(localCaratRange) !== JSON.stringify(state.carat_range) ||
      JSON.stringify(localPriceRange) !== JSON.stringify(state.price_range);
    
    setHasUnsavedChanges(hasChanges);
  }, [localCaratRange, localPriceRange, state.carat_range, state.price_range]);

  // Update local ranges when dynamic options change
  useEffect(() => {
    if (dynamicOptions.caratRange) {
      setLocalCaratRange(dynamicOptions.caratRange);
    }
    if (dynamicOptions.priceRange) {
      setLocalPriceRange(dynamicOptions.priceRange);
    }
  }, [dynamicOptions]);

  // Handle shape selection
  const handleShapeToggle = (shape: string) => {
    const newShapes = state.shape.includes(shape)
      ? state.shape.filter(s => s !== shape)
      : [...state.shape, shape];
    setShape(newShapes);
    
    toast({
      title: newShapes.includes(shape) ? 'Shape added' : 'Shape removed',
      description: `${shape} ${newShapes.includes(shape) ? 'added to' : 'removed from'} filters.`,
    });
  };

  // Handle color selection
  const handleColorToggle = (color: string) => {
    const newColors = state.color.includes(color)
      ? state.color.filter(c => c !== color)
      : [...state.color, color];
    setColor(newColors);
    
    toast({
      title: newColors.includes(color) ? 'Color added' : 'Color removed',
      description: `${color} ${newColors.includes(color) ? 'added to' : 'removed from'} filters.`,
    });
  };

  // Handle clarity selection
  const handleClarityToggle = (clarity: string) => {
    const newClarities = state.clarity.includes(clarity)
      ? state.clarity.filter(c => c !== clarity)
      : [...state.clarity, clarity];
    setClarity(newClarities);
    
    toast({
      title: newClarities.includes(clarity) ? 'Clarity added' : 'Clarity removed',
      description: `${clarity} ${newClarities.includes(clarity) ? 'added to' : 'removed from'} filters.`,
    });
  };

  // Handle cut selection
  const handleCutToggle = (cut: string) => {
    const newCuts = state.cut.includes(cut)
      ? state.cut.filter(c => c !== cut)
      : [...state.cut, cut];
    setCut(newCuts);
    
    toast({
      title: newCuts.includes(cut) ? 'Cut added' : 'Cut removed',
      description: `${cut} ${newCuts.includes(cut) ? 'added to' : 'removed from'} filters.`,
    });
  };

  // Handle growth type selection
  const handleGrowthTypeToggle = (type: string) => {
    const newTypes = state.growth_type.includes(type)
      ? state.growth_type.filter(t => t !== type)
      : [...state.growth_type, type];
    setGrowthType(newTypes);
    
    toast({
      title: newTypes.includes(type) ? 'Growth type added' : 'Growth type removed',
      description: `${type} ${newTypes.includes(type) ? 'added to' : 'removed from'} filters.`,
    });
  };

  // Handle location selection
  const handleLocationToggle = (location: string) => {
    const newLocations = state.location.includes(location)
      ? state.location.filter(l => l !== location)
      : [...state.location, location];
    setLocation(newLocations);
    
    toast({
      title: newLocations.includes(location) ? 'Location added' : 'Location removed',
      description: `${location} ${newLocations.includes(location) ? 'added to' : 'removed from'} filters.`,
    });
  };

  // Handle supplier selection
  const handleSupplierToggle = (supplier: string) => {
    const newSuppliers = state.supplier.includes(supplier)
      ? state.supplier.filter(s => s !== supplier)
      : [...state.supplier, supplier];
    setSupplier(newSuppliers);
    
    toast({
      title: newSuppliers.includes(supplier) ? 'Supplier added' : 'Supplier removed',
      description: `${supplier} ${newSuppliers.includes(supplier) ? 'added to' : 'removed from'} filters.`,
    });
  };

  // Apply carat range
  const applyCaratRange = () => {
    setCaratRange(localCaratRange);
    toast({
      title: 'Carat range applied',
      description: `Range set to ${localCaratRange.min}-${localCaratRange.max} carats.`,
    });
  };

  // Apply price range
  const applyPriceRange = () => {
    setPriceRange(localPriceRange);
    toast({
      title: 'Price range applied',
      description: `Range set to ${formatPrice(localPriceRange.min)}-${formatPrice(localPriceRange.max)}.`,
    });
  };

  // Handle carat preset
  const handleCaratPreset = (preset: { min: number; max: number }) => {
    setLocalCaratRange(preset);
    setCaratRange(preset);
    toast({
      title: 'Carat preset applied',
      description: `Range set to ${preset.min}-${preset.max} carats.`,
    });
  };

  // Handle price preset
  const handlePricePreset = (preset: { min: number; max: number }) => {
    setLocalPriceRange(preset);
    setPriceRange(preset);
    toast({
      title: 'Price preset applied',
      description: `Range set to ${formatPrice(preset.min)}-${formatPrice(preset.max)}.`,
    });
  };

  // Handle reset all filters
  const handleResetAllFilters = () => {
    resetAllFilters();
    setLocalCaratRange(dynamicOptions.caratRange || { min: 0, max: 50 });
    setLocalPriceRange(dynamicOptions.priceRange || { min: 0, max: 1000000 });
    setExpandedSections(new Set(['shape']));
    toast({
      title: 'Filters reset',
      description: 'All filters have been cleared.',
    });
  };

  // Toggle section expansion
  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  // Format price for display
  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Generate carat presets based on available range
  const generateCaratPresets = () => {
    const { min, max } = dynamicOptions.caratRange;
    const range = max - min;
    
    if (range <= 1) return [];
    
    const presets = [];
    if (range >= 0.5) presets.push({ label: `Under ${(min + 0.5).toFixed(1)} carats`, min, max: min + 0.5 });
    if (range >= 1) presets.push({ label: `${(min + 0.5).toFixed(1)}-${(min + 1.5).toFixed(1)} carats`, min: min + 0.5, max: min + 1.5 });
    if (range >= 2) presets.push({ label: `${(min + 1.5).toFixed(1)}-${(min + 3.5).toFixed(1)} carats`, min: min + 1.5, max: min + 3.5 });
    if (range >= 5) presets.push({ label: `${(min + 3.5).toFixed(1)}-${(min + 8.5).toFixed(1)} carats`, min: min + 3.5, max: min + 8.5 });
    if (range >= 10) presets.push({ label: `Over ${(min + 8.5).toFixed(1)} carats`, min: min + 8.5, max });
    
    return presets;
  };

  // Generate price presets based on available range
  const generatePricePresets = () => {
    const { min, max } = dynamicOptions.priceRange;
    const range = max - min;
    
    if (range <= 1000) return [];
    
    const presets = [];
    if (range >= 1000) presets.push({ label: `Under $${(min + 1000).toLocaleString()}`, min, max: min + 1000 });
    if (range >= 5000) presets.push({ label: `$${(min + 1000).toLocaleString()} - $${(min + 5000).toLocaleString()}`, min: min + 1000, max: min + 5000 });
    if (range >= 10000) presets.push({ label: `$${(min + 5000).toLocaleString()} - $${(min + 10000).toLocaleString()}`, min: min + 5000, max: min + 10000 });
    if (range >= 25000) presets.push({ label: `$${(min + 10000).toLocaleString()} - $${(min + 25000).toLocaleString()}`, min: min + 10000, max: min + 25000 });
    if (range >= 50000) presets.push({ label: `$${(min + 25000).toLocaleString()} - $${(min + 50000).toLocaleString()}`, min: min + 25000, max: min + 50000 });
    if (range >= 100000) presets.push({ label: `$${(min + 50000).toLocaleString()} - $${(min + 100000).toLocaleString()}`, min: min + 50000, max: min + 100000 });
    if (range >= 100000) presets.push({ label: `Over $${(min + 100000).toLocaleString()}`, min: min + 100000, max });
    
    return presets;
  };

  // Don't render if no diamonds are available
  if (!firebaseDiamonds || firebaseDiamonds.length === 0) {
    return null;
  }

  return (
    <Sheet open={state.is_filter_panel_open} onOpenChange={toggleFilterPanel}>
      <SheetContent side="right" className="w-[400px] sm:w-[540px] bg-gray-900 border-gray-700">
        <SheetHeader className="border-b border-gray-700 pb-4">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-gray-50 flex items-center">
              <Filter className="h-5 w-5 mr-2" />
              Filters
              <Badge variant="secondary" className="ml-2 bg-blue-600 text-white">
                {firebaseDiamonds.length} diamonds
              </Badge>
            </SheetTitle>
            <div className="flex items-center space-x-2">
              {hasActiveFilters() && (
                <Badge variant="secondary" className="bg-gray-700 text-gray-50 border-gray-600">
                  {getActiveFiltersCount()} active
                </Badge>
              )}
              {hasUnsavedChanges && (
                <Badge variant="outline" className="text-yellow-400 border-yellow-400 animate-pulse">
                  Unsaved
                </Badge>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleResetAllFilters}
                className="text-gray-300 hover:text-white hover:bg-gray-700 transition-all duration-200 transform hover:scale-105"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleFilterPanel}
                className="text-gray-300 hover:text-white hover:bg-gray-700 transition-all duration-200 transform hover:scale-105"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </SheetHeader>

        <div className="py-4 space-y-6 max-h-[calc(100vh-120px)] overflow-y-auto custom-scrollbar">
          {/* Shape Filter */}
          {dynamicOptions.shapes.length > 0 && (
            <div className="space-y-4">
              <button
                onClick={() => toggleSection('shape')}
                className="flex items-center justify-between w-full text-left p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition-all duration-200 transform hover:scale-[1.02]"
              >
                <h3 className="text-sm font-medium text-gray-200">Shape</h3>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="text-xs">
                    {dynamicOptions.shapes.length} available
                  </Badge>
                  {expandedSections.has('shape') ? (
                    <ChevronUp className="h-4 w-4 text-gray-400 transition-transform duration-200" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-gray-400 transition-transform duration-200" />
                  )}
                </div>
              </button>
              
              <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
                expandedSections.has('shape') ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
              }`}>
                <div className="space-y-3 pl-3">
                  {Object.entries(categorizedOptions.shapeCategories).map(([category, shapes]) => (
                    <div key={category}>
                      <h4 className="text-sm font-medium text-gray-200 mb-2">{category}</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {shapes.map((shape) => (
                          <div key={shape} className="flex items-center space-x-2">
                            <Checkbox
                              id={`shape-${shape}`}
                              checked={state.shape.includes(shape)}
                              onCheckedChange={() => handleShapeToggle(shape)}
                              className="border-gray-600 data-[state=checked]:bg-gray-50 data-[state=checked]:border-gray-50 transition-all duration-200 transform hover:scale-105"
                            />
                            <Label htmlFor={`shape-${shape}`} className="text-sm text-gray-200 cursor-pointer hover:text-gray-100 transition-colors duration-200">
                              {shape}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Color Filter */}
          {dynamicOptions.colors.length > 0 && (
            <div className="space-y-4">
              <button
                onClick={() => toggleSection('color')}
                className="flex items-center justify-between w-full text-left p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition-all duration-200 transform hover:scale-[1.02]"
              >
                <h3 className="text-sm font-medium text-gray-200">Color</h3>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="text-xs">
                    {dynamicOptions.colors.length} available
                  </Badge>
                  {expandedSections.has('color') ? (
                    <ChevronUp className="h-4 w-4 text-gray-400 transition-transform duration-200" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-gray-400 transition-transform duration-200" />
                  )}
                </div>
              </button>
              
              <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
                expandedSections.has('color') ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
              }`}>
                <div className="space-y-3 pl-3">
                  <Tabs defaultValue="white" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 bg-gray-700 border-gray-600">
                      <TabsTrigger value="white" className="text-white data-[state=active]:bg-gray-600 data-[state=active]:text-white transition-all duration-200">White</TabsTrigger>
                      <TabsTrigger value="fancy" className="text-white data-[state=active]:bg-gray-600 data-[state=active]:text-white transition-all duration-200">Fancy</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="white" className="space-y-2">
                      <div className="grid grid-cols-3 gap-2">
                        {Object.entries(categorizedOptions.colorCategories)
                          .filter(([category]) => category !== 'Fancy')
                          .flatMap(([category, colors]) => colors)
                          .map((color) => (
                            <div key={color} className="flex items-center space-x-2">
                              <Checkbox
                                id={`color-${color}`}
                                checked={state.color.includes(color)}
                                onCheckedChange={() => handleColorToggle(color)}
                                className="border-gray-600 data-[state=checked]:bg-gray-50 data-[state=checked]:border-gray-50 transition-all duration-200 transform hover:scale-105"
                              />
                              <Label htmlFor={`color-${color}`} className="text-sm text-gray-200 cursor-pointer hover:text-gray-100 transition-colors duration-200">
                                {color}
                              </Label>
                            </div>
                          ))}
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="fancy" className="space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        {(categorizedOptions.colorCategories['Fancy'] || []).map((color) => (
                          <div key={color} className="flex items-center space-x-2">
                            <Checkbox
                              id={`color-${color}`}
                              checked={state.color.includes(color)}
                              onCheckedChange={() => handleColorToggle(color)}
                              className="border-gray-600 data-[state=checked]:bg-gray-50 data-[state=checked]:border-gray-50 transition-all duration-200 transform hover:scale-105"
                            />
                            <Label htmlFor={`color-${color}`} className="text-sm text-gray-200 cursor-pointer hover:text-gray-100 transition-colors duration-200">
                              {color}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              </div>
            </div>
          )}

          {/* Clarity Filter */}
          {dynamicOptions.clarities.length > 0 && (
            <div className="space-y-4">
              <button
                onClick={() => toggleSection('clarity')}
                className="flex items-center justify-between w-full text-left p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition-all duration-200 transform hover:scale-[1.02]"
              >
                <h3 className="text-sm font-medium text-gray-200">Clarity</h3>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="text-xs">
                    {dynamicOptions.clarities.length} available
                  </Badge>
                  {expandedSections.has('clarity') ? (
                    <ChevronUp className="h-4 w-4 text-gray-400 transition-transform duration-200" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-gray-400 transition-transform duration-200" />
                  )}
                </div>
              </button>
              
              <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
                expandedSections.has('clarity') ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
              }`}>
                <div className="space-y-3 pl-3">
                  {Object.entries(categorizedOptions.clarityCategories).map(([category, clarities]) => (
                    <div key={category}>
                      <h4 className="text-sm font-medium text-gray-200 mb-2">{category}</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {clarities.map((clarity) => (
                          <div key={clarity} className="flex items-center space-x-2">
                            <Checkbox
                              id={`clarity-${clarity}`}
                              checked={state.clarity.includes(clarity)}
                              onCheckedChange={() => handleClarityToggle(clarity)}
                              className="border-gray-600 data-[state=checked]:bg-gray-50 data-[state=checked]:border-gray-50 transition-all duration-200 transform hover:scale-105"
                            />
                            <Label htmlFor={`clarity-${clarity}`} className="text-sm text-gray-200 cursor-pointer hover:text-gray-100 transition-colors duration-200">
                              {clarity}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Cut Filter */}
          {dynamicOptions.cuts.length > 0 && (
            <div className="space-y-4">
              <button
                onClick={() => toggleSection('cut')}
                className="flex items-center justify-between w-full text-left p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition-all duration-200 transform hover:scale-[1.02]"
              >
                <h3 className="text-sm font-medium text-gray-200">Cut</h3>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="text-xs">
                    {dynamicOptions.cuts.length} available
                  </Badge>
                  {expandedSections.has('cut') ? (
                    <ChevronUp className="h-4 w-4 text-gray-400 transition-transform duration-200" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-gray-400 transition-transform duration-200" />
                  )}
                </div>
              </button>
              
              <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
                expandedSections.has('cut') ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
              }`}>
                <div className="space-y-3 pl-3">
                  {Object.entries(categorizedOptions.cutCategories).map(([category, cuts]) => (
                    <div key={category}>
                      <h4 className="text-sm font-medium text-gray-200 mb-2">{category}</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {cuts.map((cut) => (
                          <div key={cut} className="flex items-center space-x-2">
                            <Checkbox
                              id={`cut-${cut}`}
                              checked={state.cut.includes(cut)}
                              onCheckedChange={() => handleCutToggle(cut)}
                              className="border-gray-600 data-[state=checked]:bg-gray-50 data-[state=checked]:border-gray-50 transition-all duration-200 transform hover:scale-105"
                            />
                            <Label htmlFor={`cut-${cut}`} className="text-sm text-gray-200 cursor-pointer hover:text-gray-100 transition-colors duration-200">
                              {cut}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Growth Type Filter */}
          {dynamicOptions.growthTypes.length > 0 && (
            <div className="space-y-4">
              <button
                onClick={() => toggleSection('growth_type')}
                className="flex items-center justify-between w-full text-left p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition-all duration-200 transform hover:scale-[1.02]"
              >
                <h3 className="text-sm font-medium text-gray-200">Growth Type</h3>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="text-xs">
                    {dynamicOptions.growthTypes.length} available
                  </Badge>
                  {expandedSections.has('growth_type') ? (
                    <ChevronUp className="h-4 w-4 text-gray-400 transition-transform duration-200" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-gray-400 transition-transform duration-200" />
                  )}
                </div>
              </button>
              
              <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
                expandedSections.has('growth_type') ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
              }`}>
                <div className="space-y-3 pl-3">
                  <div className="grid grid-cols-2 gap-2">
                    {dynamicOptions.growthTypes.map((type) => (
                      <div key={type} className="flex items-center space-x-2">
                        <Checkbox
                          id={`growth-type-${type}`}
                          checked={state.growth_type.includes(type)}
                          onCheckedChange={() => handleGrowthTypeToggle(type)}
                          className="border-gray-600 data-[state=checked]:bg-gray-50 data-[state=checked]:border-gray-50 transition-all duration-200 transform hover:scale-105"
                        />
                        <Label htmlFor={`growth-type-${type}`} className="text-sm text-gray-200 cursor-pointer hover:text-gray-100 transition-colors duration-200">
                          {type}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Location Filter */}
          {dynamicOptions.locations.length > 0 && (
            <div className="space-y-4">
              <button
                onClick={() => toggleSection('location')}
                className="flex items-center justify-between w-full text-left p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition-all duration-200 transform hover:scale-[1.02]"
              >
                <h3 className="text-sm font-medium text-gray-200">Location</h3>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="text-xs">
                    {dynamicOptions.locations.length} available
                  </Badge>
                  {expandedSections.has('location') ? (
                    <ChevronUp className="h-4 w-4 text-gray-400 transition-transform duration-200" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-gray-400 transition-transform duration-200" />
                  )}
                </div>
              </button>
              
              <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
                expandedSections.has('location') ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
              }`}>
                <div className="space-y-3 pl-3">
                  <div className="grid grid-cols-1 gap-2">
                    {dynamicOptions.locations.map((location) => (
                      <div key={location} className="flex items-center space-x-2">
                        <Checkbox
                          id={`location-${location}`}
                          checked={state.location.includes(location)}
                          onCheckedChange={() => handleLocationToggle(location)}
                          className="border-gray-600 data-[state=checked]:bg-gray-50 data-[state=checked]:border-gray-50 transition-all duration-200 transform hover:scale-105"
                        />
                        <Label htmlFor={`location-${location}`} className="text-sm text-gray-200 cursor-pointer hover:text-gray-100 transition-colors duration-200">
                          {location}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Supplier Filter */}
          {dynamicOptions.suppliers.length > 0 && (
            <div className="space-y-4">
              <button
                onClick={() => toggleSection('supplier')}
                className="flex items-center justify-between w-full text-left p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition-all duration-200 transform hover:scale-[1.02]"
              >
                <h3 className="text-sm font-medium text-gray-200">Supplier</h3>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="text-xs">
                    {dynamicOptions.suppliers.length} available
                  </Badge>
                  {expandedSections.has('supplier') ? (
                    <ChevronUp className="h-4 w-4 text-gray-400 transition-transform duration-200" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-gray-400 transition-transform duration-200" />
                  )}
                </div>
              </button>
              
              <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
                expandedSections.has('supplier') ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
              }`}>
                <div className="space-y-3 pl-3">
                  <div className="grid grid-cols-1 gap-2">
                    {dynamicOptions.suppliers.map((supplier) => (
                      <div key={supplier} className="flex items-center space-x-2">
                        <Checkbox
                          id={`supplier-${supplier}`}
                          checked={state.supplier.includes(supplier)}
                          onCheckedChange={() => handleSupplierToggle(supplier)}
                          className="border-gray-600 data-[state=checked]:bg-gray-50 data-[state=checked]:border-gray-50 transition-all duration-200 transform hover:scale-105"
                        />
                        <Label htmlFor={`supplier-${supplier}`} className="text-sm text-gray-200 cursor-pointer hover:text-gray-100 transition-colors duration-200">
                          {supplier}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Carat Range */}
          <div className="space-y-4">
            <button
              onClick={() => toggleSection('carat')}
              className="flex items-center justify-between w-full text-left p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition-all duration-200 transform hover:scale-[1.02]"
            >
              <h3 className="text-sm font-medium text-gray-200">Carat Range</h3>
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="text-xs">
                  {dynamicOptions.caratRange.min.toFixed(1)} - {dynamicOptions.caratRange.max.toFixed(1)} ct
                </Badge>
                {expandedSections.has('carat') ? (
                  <ChevronUp className="h-4 w-4 text-gray-400 transition-transform duration-200" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-gray-400 transition-transform duration-200" />
                )}
              </div>
            </button>
            
            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
              expandedSections.has('carat') ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
            }`}>
              <div className="space-y-4 pl-3">
                <div className="space-y-2">
                  <Label className="text-sm text-gray-200">Custom Range</Label>
                  <div className="space-y-4">
                    <Slider
                      value={[localCaratRange.min, localCaratRange.max]}
                      onValueChange={([min, max]) => setLocalCaratRange({ min, max })}
                      max={dynamicOptions.caratRange.max}
                      min={dynamicOptions.caratRange.min}
                      step={0.1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-gray-300">
                      <span>{localCaratRange.min} ct</span>
                      <span>{localCaratRange.max} ct</span>
                    </div>
                  </div>
                  <Button
                    onClick={applyCaratRange}
                    size="sm"
                    className="w-full bg-gray-700 text-white hover:bg-gray-600 transition-all duration-200 transform hover:scale-105"
                  >
                    Apply Range
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm text-gray-200">Quick Presets</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {generateCaratPresets().map((preset) => (
                      <Button
                        key={preset.label}
                        variant="outline"
                        size="sm"
                        onClick={() => handleCaratPreset(preset)}
                        className="text-white hover:bg-gray-700 hover:text-white bg-gray-700 transition-all duration-200 transform hover:scale-105"
                      >
                        {preset.label}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Price Range */}
          <div className="space-y-4">
            <button
              onClick={() => toggleSection('price')}
              className="flex items-center justify-between w-full text-left p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition-all duration-200 transform hover:scale-[1.02]"
            >
              <h3 className="text-sm font-medium text-gray-200">Price Range</h3>
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="text-xs">
                  {formatPrice(dynamicOptions.priceRange.min)} - {formatPrice(dynamicOptions.priceRange.max)}
                </Badge>
                {expandedSections.has('price') ? (
                  <ChevronUp className="h-4 w-4 text-gray-400 transition-transform duration-200" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-gray-400 transition-transform duration-200" />
                )}
              </div>
            </button>
            
            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
              expandedSections.has('price') ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
            }`}>
              <div className="space-y-4 pl-3">
                <div className="space-y-2">
                  <Label className="text-sm text-gray-200">Price Type</Label>
                  <Tabs value={state.price_type} onValueChange={(value) => setPriceType(value as 'total' | 'per_carat')}>
                    <TabsList className="grid w-full grid-cols-2 bg-gray-700 border-gray-600">
                      <TabsTrigger value="total" className="text-white data-[state=active]:bg-gray-600 data-[state=active]:text-white transition-all duration-200">Total Price</TabsTrigger>
                      <TabsTrigger value="per_carat" className="text-white data-[state=active]:bg-gray-600 data-[state=active]:text-white transition-all duration-200">Per Carat</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm text-gray-200">Custom Range</Label>
                  <div className="space-y-4">
                    <Slider
                      value={[localPriceRange.min, localPriceRange.max]}
                      onValueChange={([min, max]) => setLocalPriceRange({ min, max })}
                      max={dynamicOptions.priceRange.max}
                      min={dynamicOptions.priceRange.min}
                      step={1000}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-gray-300">
                      <span>{formatPrice(localPriceRange.min)}</span>
                      <span>{formatPrice(localPriceRange.max)}</span>
                    </div>
                  </div>
                  <Button
                    onClick={applyPriceRange}
                    size="sm"
                    className="w-full bg-gray-700 text-white hover:bg-gray-600 transition-all duration-200 transform hover:scale-105"
                  >
                    Apply Range
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm text-gray-200">Quick Presets</Label>
                  <div className="grid grid-cols-1 gap-2">
                    {generatePricePresets().map((preset) => (
                      <Button
                        key={preset.label}
                        variant="outline"
                        size="sm"
                        onClick={() => handlePricePreset(preset)}
                        className="text-white hover:bg-gray-700 hover:text-white bg-gray-700 transition-all duration-200 transform hover:scale-105"
                      >
                        {preset.label}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}; 