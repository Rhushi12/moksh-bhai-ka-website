import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useFirebase } from '@/contexts/FirebaseContext';
import { Category, Subcategory, BUILT_IN_CATEGORIES } from '@/lib/categoryServices';
import { 
  Plus, 
  Edit3, 
  Trash2, 
  X, 
  Save, 
  Gem, 
  Sparkles, 
  Clock, 
  Scissors, 
  Star, 
  Crown, 
  Zap,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

// Custom Diamond Icon Component
const CustomDiamondIcon: React.FC<{ size?: number | string; className?: string }> = ({ size = 24, className = "" }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="square"
      strokeLinejoin="miter"
      role="img"
      aria-label="Diamond"
      className={className}
    >
      <path d="M7 2h10l5 6-10 14L2 8 7 2z" />
      <path d="M2 8h20" />
      <path d="M7 2l5 6 5-6" />
      <path d="M2 8l10 14 10-14" />
      <path d="M12 8v14" />
    </svg>
  );
};

// CVD Lab-Grown Diamond Icon
const CVDLabDiamondIcon: React.FC<{ size?: number | string; className?: string }> = ({ size = 24, className = "" }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      role="img"
      aria-label="Lab-grown diamond with circuit nodes"
      className={className}
    >
      <path d="M12 3L21 12L12 21L3 12Z"/>
      <path d="M12 3L8 12L12 21M12 3L16 12"/>
      <circle cx="4" cy="12" r="1"/>
      <circle cx="20" cy="12" r="1"/>
      <circle cx="12" cy="22" r="1"/>
      <path d="M4 12h3M20 12h-3M12 22v-2"/>
    </svg>
  );
};

// Antique Diamond Icon
const AntiqueDiamondIcon: React.FC<{ size?: number | string; className?: string }> = ({ size = 24, className = "" }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      role="img"
      aria-label="Antique diamond with crown"
      className={className}
    >
      <path d="M6 6.5l2 2 2-3 2 3 2-2 2 2v1H6v-1z"/>
      <circle cx="8" cy="6" r=".6"/>
      <circle cx="12" cy="5" r=".6"/>
      <circle cx="16" cy="6" r=".6"/>
      <path d="M12 8L19 13L12 21L5 13z"/>
      <path d="M12 8L8 13L12 21M12 8L16 13"/>
    </svg>
  );
};

// Antique Cutout Diamond Icon
const AntiqueCutoutDiamondIcon: React.FC<{ size?: number | string; className?: string }> = ({ size = 24, className = "" }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      role="img"
      aria-label="Diamond with scissors for cutting"
      className={className}
    >
      <path d="M12 3L21 12L12 21L3 12Z"/>
      <path d="M12 3L8 12L12 21M12 3L16 12"/>
      <path d="M6 6l3 3M18 6l-3 3"/>
      <path d="M6 18l3-3M18 18l-3-3"/>
    </svg>
  );
};

interface CategoryManagementProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CategoryFormData {
  value: string;
  displayLabel: string;
  description: string;
  color: string;
  icon: string;
  subcategories: Omit<Subcategory, 'id'>[];
}

const ICON_OPTIONS = [
  { value: 'custom-diamond', label: 'Natural Diamond', icon: CustomDiamondIcon },
  { value: 'lab-diamond', label: 'Lab-Grown Diamond', icon: CVDLabDiamondIcon },
  { value: 'vintage-diamond', label: 'Antique Diamond', icon: AntiqueDiamondIcon },
  { value: 'cutout-diamond', label: 'Cutout Diamond', icon: AntiqueCutoutDiamondIcon },
  { value: 'gem', label: 'Gem', icon: Gem },
  { value: 'sparkles', label: 'Sparkles', icon: Sparkles },
  { value: 'clock', label: 'Clock', icon: Clock },
  { value: 'scissors', label: 'Scissors', icon: Scissors },
  { value: 'star', label: 'Star', icon: Star },
  { value: 'crown', label: 'Crown', icon: Crown },
  { value: 'zap', label: 'Zap', icon: Zap }
];

const COLOR_OPTIONS = [
  '#8B5CF6', '#F97316', '#06B6D4', '#10B981', '#EF4444', '#F59E0B', '#8B5CF6',
  '#EC4899', '#06B6D4', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#F97316'
];

export const CategoryManagement: React.FC<CategoryManagementProps> = ({ isOpen, onClose }) => {
  const { toast } = useToast();
  const { categories, addCategory, updateCategory, deleteCategory } = useFirebase();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState<CategoryFormData>({
    value: '',
    displayLabel: '',
    description: '',
    color: '#8B5CF6',
    icon: 'gem',
    subcategories: []
  });
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  // Reset form when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setIsFormOpen(false);
      setEditingCategory(null);
      setFormData({
        value: '',
        displayLabel: '',
        description: '',
        color: '#8B5CF6',
        icon: 'gem',
        subcategories: []
      });
    }
  }, [isOpen]);

  const handleAddCategory = () => {
    setEditingCategory(null);
    setFormData({
      value: '',
      displayLabel: '',
      description: '',
      color: '#8B5CF6',
      icon: 'gem',
      subcategories: []
    });
    setIsFormOpen(true);
  };

  const handleEditCategory = (category: Category) => {
    if (category.isBuiltIn) {
      toast({
        title: "Cannot Edit Built-in Categories",
        description: "Built-in categories are system defaults and cannot be modified.",
        variant: "destructive"
      });
      return;
    }

    setEditingCategory(category);
    setFormData({
      value: category.value,
      displayLabel: category.displayLabel,
      description: category.description,
      color: category.color,
      icon: category.icon,
      subcategories: category.subcategories.map(sub => ({ name: sub.name, description: sub.description, count: sub.count }))
    });
    setIsFormOpen(true);
  };

  const handleDeleteCategory = async (category: Category) => {
    if (category.isBuiltIn) {
      toast({
        title: "Cannot Delete Built-in Categories",
        description: "Built-in categories are system defaults and cannot be removed.",
        variant: "destructive"
      });
      return;
    }

    if (window.confirm(`Are you sure you want to delete "${category.displayLabel}"? This action cannot be undone.`)) {
      try {
        await deleteCategory(category.id);
        toast({
          title: "Category Deleted",
          description: `"${category.displayLabel}" has been successfully deleted.`,
        });
      } catch (error) {
        toast({
          title: "Delete Failed",
          description: "Failed to delete category. Please try again.",
          variant: "destructive"
        });
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.value.trim() || !formData.displayLabel.trim() || !formData.description.trim()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id, {
          ...formData,
          subcategories: formData.subcategories.map((sub, index) => ({
            id: editingCategory.subcategories[index]?.id || `sub-${Date.now()}-${index}`,
            ...sub
          }))
        });
        toast({
          title: "Category Updated",
          description: `"${formData.displayLabel}" has been successfully updated.`,
        });
      } else {
        await addCategory({
          ...formData,
          subcategories: formData.subcategories.map((sub, index) => ({
            id: `sub-${Date.now()}-${index}`,
            ...sub
          }))
        });
        toast({
          title: "Category Created",
          description: `"${formData.displayLabel}" has been successfully created.`,
        });
      }
      
      setIsFormOpen(false);
      setEditingCategory(null);
    } catch (error) {
      toast({
        title: "Operation Failed",
        description: editingCategory ? "Failed to update category." : "Failed to create category.",
        variant: "destructive"
      });
    }
  };

  const addSubcategory = () => {
    setFormData(prev => ({
      ...prev,
      subcategories: [...prev.subcategories, { name: '', description: '', count: 0 }]
    }));
  };

  const removeSubcategory = (index: number) => {
    setFormData(prev => ({
      ...prev,
      subcategories: prev.subcategories.filter((_, i) => i !== index)
    }));
  };

  const updateSubcategory = (index: number, field: keyof Omit<Subcategory, 'id'>, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      subcategories: prev.subcategories.map((sub, i) => 
        i === index ? { ...sub, [field]: value } : sub
      )
    }));
  };

  const toggleCategoryExpansion = (categoryId: string) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  const getIconComponent = (iconName: string) => {
    const iconMap: { [key: string]: any } = {
      'gem': Gem,
      'sparkles': Sparkles,
      'clock': Clock,
      'scissors': Scissors,
      'star': Star,
      'crown': Crown,
      'zap': Zap,
      'custom-diamond': CustomDiamondIcon,
      'lab-diamond': CVDLabDiamondIcon,        // New CVD icon
      'vintage-diamond': AntiqueDiamondIcon,   // New Antique icon
      'cutout-diamond': AntiqueCutoutDiamondIcon // New Cutout icon
    };
    return iconMap[iconName] || Gem;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Category Management</DialogTitle>
          <p className="text-gray-600">Manage diamond categories and subcategories</p>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header Actions */}
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              {categories.length} categories • {categories.filter(c => !c.isBuiltIn).length} custom
            </div>
            <Button onClick={handleAddCategory} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Add New Category
            </Button>
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((category) => {
              const IconComponent = getIconComponent(category.icon);
              const isExpanded = expandedCategories.has(category.id);
              
              return (
                <Card key={category.id} className="relative overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-10 h-10 rounded-lg flex items-center justify-center text-white"
                          style={{ backgroundColor: category.color }}
                        >
                          <IconComponent className="w-5 h-5" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{category.displayLabel}</CardTitle>
                          <div className="flex items-center space-x-2 mt-1">
                            {category.isBuiltIn ? (
                              <Badge variant="secondary" className="text-xs">Built-in</Badge>
                            ) : (
                              <Badge variant="outline" className="text-xs">Custom</Badge>
                            )}
                            <Badge variant="outline" className="text-xs">
                              {category.subcategories.length} subcategories
                            </Badge>
                          </div>
                        </div>
                      </div>
                      
                      {!category.isBuiltIn && (
                        <div className="flex space-x-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditCategory(category)}
                            className="h-8 w-8 p-0 text-gray-600 hover:text-blue-600"
                          >
                            <Edit3 className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteCategory(category)}
                            className="h-8 w-8 p-0 text-gray-600 hover:text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <p className="text-gray-600 text-sm mb-3">{category.description}</p>
                    
                    {/* Subcategories Section */}
                    {category.subcategories.length > 0 && (
                      <div>
                        <button
                          onClick={() => toggleCategoryExpansion(category.id)}
                          className="flex items-center justify-between w-full text-left text-sm font-medium text-gray-700 hover:text-gray-900"
                        >
                          <span>Subcategories</span>
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                        
                        {isExpanded && (
                          <div className="mt-2 space-y-2">
                            {category.subcategories.map((subcategory) => (
                              <div key={subcategory.id} className="bg-gray-50 rounded-lg p-2">
                                <div className="font-medium text-sm">{subcategory.name}</div>
                                <div className="text-xs text-gray-600">{subcategory.description}</div>
                                <div className="text-xs text-gray-500 mt-1">
                                  Count: {subcategory.count}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Add/Edit Category Form */}
          {isFormOpen && (
            <Card className="border-2 border-blue-200 bg-blue-50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">
                    {editingCategory ? 'Edit Category' : 'Add New Category'}
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsFormOpen(false)}
                    className="h-8 w-8 p-0"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="value">Category Value *</Label>
                      <Input
                        id="value"
                        value={formData.value}
                        onChange={(e) => setFormData(prev => ({ ...prev, value: e.target.value }))}
                        placeholder="e.g., natural, cvd, antique"
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="displayLabel">Display Name *</Label>
                      <Input
                        id="displayLabel"
                        value={formData.displayLabel}
                        onChange={(e) => setFormData(prev => ({ ...prev, displayLabel: e.target.value }))}
                        placeholder="e.g., Natural Diamonds"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Describe this category..."
                      rows={3}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Icon</Label>
                      <div className="grid grid-cols-7 gap-2 mt-2">
                        {ICON_OPTIONS.map((icon) => (
                          <button
                            key={icon.value}
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, icon: icon.value }))}
                            className={`p-2 rounded-lg border-2 transition-all ${
                              formData.icon === icon.value
                                ? 'border-blue-500 bg-blue-100'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <icon.icon className="w-5 h-5" />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label>Color</Label>
                      <div className="grid grid-cols-7 gap-2 mt-2">
                        {COLOR_OPTIONS.map((color) => (
                          <button
                            key={color}
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, color }))}
                            className={`w-8 h-8 rounded-lg border-2 transition-all ${
                              formData.color === color
                                ? 'border-gray-800 scale-110'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Subcategories Section */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <Label>Subcategories</Label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addSubcategory}
                        className="h-8"
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Add Subcategory
                      </Button>
                    </div>
                    
                    <div className="space-y-3">
                      {formData.subcategories.map((subcategory, index) => (
                        <div key={index} className="flex items-start space-x-2 p-3 bg-gray-50 rounded-lg">
                          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-2">
                            <Input
                              placeholder="Subcategory name"
                              value={subcategory.name}
                              onChange={(e) => updateSubcategory(index, 'name', e.target.value)}
                            />
                            <Input
                              placeholder="Description"
                              value={subcategory.description}
                              onChange={(e) => updateSubcategory(index, 'description', e.target.value)}
                            />
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeSubcategory(index)}
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsFormOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                      <Save className="w-4 h-4 mr-2" />
                      {editingCategory ? 'Update Category' : 'Create Category'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
