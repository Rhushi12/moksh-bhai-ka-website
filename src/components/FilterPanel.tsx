import React, { useState, useEffect } from 'react';
import { useFilter } from '@/contexts/FilterContext';
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
import {
  DIAMOND_SHAPES,
  WHITE_COLORS,
  FANCY_COLORS,
  CLARITY_OPTIONS,
  CUT_OPTIONS,
  SHAPE_CATEGORIES,
  COLOR_CATEGORIES,
  CLARITY_CATEGORIES,
  CUT_CATEGORIES,
  CARAT_RANGE_PRESETS,
  PRICE_RANGE_PRESETS
} from '@/data/filterOptions';

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
  
  const { toast } = useToast();
  const [localCaratRange, setLocalCaratRange] = useState(state.carat_range);
  const [localPriceRange, setLocalPriceRange] = useState(state.price_range);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['shape']));

  // Track changes to show unsaved changes indicator
  useEffect(() => {
    const hasChanges = 
      JSON.stringify(localCaratRange) !== JSON.stringify(state.carat_range) ||
      JSON.stringify(localPriceRange) !== JSON.stringify(state.price_range);
    
    setHasUnsavedChanges(hasChanges);
  }, [localCaratRange, localPriceRange, state.carat_range, state.price_range]);

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
    setLocalCaratRange({ min: 0, max: 50 });
    setLocalPriceRange({ min: 0, max: 1000000 });
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

  return (
    <Sheet open={state.is_filter_panel_open} onOpenChange={toggleFilterPanel}>
      <SheetContent side="right" className="w-[400px] sm:w-[540px] bg-gray-900 border-gray-700">
        <SheetHeader className="border-b border-gray-700 pb-4">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-gray-50 flex items-center">
              <Filter className="h-5 w-5 mr-2" />
              Filters
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
          <div className="space-y-4">
            <button
              onClick={() => toggleSection('shape')}
              className="flex items-center justify-between w-full text-left p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition-all duration-200 transform hover:scale-[1.02]"
            >
              <h3 className="text-sm font-medium text-gray-200">Shape</h3>
              {expandedSections.has('shape') ? (
                <ChevronUp className="h-4 w-4 text-gray-400 transition-transform duration-200" />
              ) : (
                <ChevronDown className="h-4 w-4 text-gray-400 transition-transform duration-200" />
              )}
            </button>
            
            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
              expandedSections.has('shape') ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
            }`}>
              <div className="space-y-3 pl-3">
                {Object.entries(SHAPE_CATEGORIES).map(([category, shapes]) => (
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

          {/* Color Filter */}
          <div className="space-y-4">
            <button
              onClick={() => toggleSection('color')}
              className="flex items-center justify-between w-full text-left p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition-all duration-200 transform hover:scale-[1.02]"
            >
              <h3 className="text-sm font-medium text-gray-200">Color</h3>
              {expandedSections.has('color') ? (
                <ChevronUp className="h-4 w-4 text-gray-400 transition-transform duration-200" />
              ) : (
                <ChevronDown className="h-4 w-4 text-gray-400 transition-transform duration-200" />
              )}
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
                      {WHITE_COLORS.map((color) => (
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
                      {FANCY_COLORS.map((color) => (
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

          {/* Clarity Filter */}
          <div className="space-y-4">
            <button
              onClick={() => toggleSection('clarity')}
              className="flex items-center justify-between w-full text-left p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition-all duration-200 transform hover:scale-[1.02]"
            >
              <h3 className="text-sm font-medium text-gray-200">Clarity</h3>
              {expandedSections.has('clarity') ? (
                <ChevronUp className="h-4 w-4 text-gray-400 transition-transform duration-200" />
              ) : (
                <ChevronDown className="h-4 w-4 text-gray-400 transition-transform duration-200" />
              )}
            </button>
            
            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
              expandedSections.has('clarity') ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
            }`}>
              <div className="space-y-3 pl-3">
                <div className="grid grid-cols-2 gap-2">
                  {CLARITY_OPTIONS.map((clarity) => (
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
            </div>
          </div>

          {/* Cut Filter */}
          <div className="space-y-4">
            <button
              onClick={() => toggleSection('cut')}
              className="flex items-center justify-between w-full text-left p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition-all duration-200 transform hover:scale-[1.02]"
            >
              <h3 className="text-sm font-medium text-gray-200">Cut</h3>
              {expandedSections.has('cut') ? (
                <ChevronUp className="h-4 w-4 text-gray-400 transition-transform duration-200" />
              ) : (
                <ChevronDown className="h-4 w-4 text-gray-400 transition-transform duration-200" />
              )}
            </button>
            
            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
              expandedSections.has('cut') ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
            }`}>
              <div className="space-y-3 pl-3">
                <div className="grid grid-cols-2 gap-2">
                  {CUT_OPTIONS.map((cut) => (
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
            </div>
          </div>

          {/* Carat Range */}
          <div className="space-y-4">
            <button
              onClick={() => toggleSection('carat')}
              className="flex items-center justify-between w-full text-left p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition-all duration-200 transform hover:scale-[1.02]"
            >
              <h3 className="text-sm font-medium text-gray-200">Carat Range</h3>
              {expandedSections.has('carat') ? (
                <ChevronUp className="h-4 w-4 text-gray-400 transition-transform duration-200" />
              ) : (
                <ChevronDown className="h-4 w-4 text-gray-400 transition-transform duration-200" />
              )}
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
                      max={50}
                      min={0}
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
                    {CARAT_RANGE_PRESETS.map((preset) => (
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
              {expandedSections.has('price') ? (
                <ChevronUp className="h-4 w-4 text-gray-400 transition-transform duration-200" />
              ) : (
                <ChevronDown className="h-4 w-4 text-gray-400 transition-transform duration-200" />
              )}
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
                      max={1000000}
                      min={0}
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
                    {PRICE_RANGE_PRESETS.map((preset) => (
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