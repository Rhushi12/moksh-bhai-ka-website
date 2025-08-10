import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { uploadNewDiamond, validateDiamondData, NewDiamondData } from '@/lib/diamondUpload';
import { Diamond } from '@/data/diamonds';

interface DiamondUploadFormProps {
  onUploadSuccess?: (diamond: Diamond) => void;
  onUploadError?: (error: string) => void;
  className?: string;
}

export const DiamondUploadForm: React.FC<DiamondUploadFormProps> = ({
  onUploadSuccess,
  onUploadError,
  className = ''
}) => {
  const [formData, setFormData] = useState<NewDiamondData>({
    category: 'Investment Diamonds',
    shape: 'Round',
    description: '',
    carat: 0,
    clarity: 'VS1',
    cut: 'Excellent',
    color: 'D',
    price: '',
    bestseller: false,
    imageFile: undefined,
    videoFile: undefined,
    videoFiles: []
  });

  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errors, setErrors] = useState<string[]>([]);

  const handleInputChange = (field: keyof NewDiamondData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileChange = (field: 'imageFile' | 'videoFile', file: File | null) => {
    setFormData(prev => ({
      ...prev,
      [field]: file || undefined
    }));
  };

  const handleVideoFilesChange = (files: FileList | null) => {
    if (files) {
      const videoFiles = Array.from(files);
      setFormData(prev => ({
        ...prev,
        videoFiles
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors([]);
    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Validate form data
      if (!validateDiamondData(formData)) {
        setErrors(['Please check all required fields and file formats']);
        setIsUploading(false);
        return;
      }

      // Upload diamond
      const diamond = await uploadNewDiamond(formData);
      
      console.log('✅ Diamond uploaded successfully:', diamond);
      onUploadSuccess?.(diamond);
      
      // Reset form
      setFormData({
        category: 'Investment Diamonds',
        shape: 'Round',
        description: '',
        carat: 0,
        clarity: 'VS1',
        cut: 'Excellent',
        color: 'D',
        price: '',
        bestseller: false,
        imageFile: undefined,
        videoFile: undefined,
        videoFiles: []
      });
      
    } catch (error) {
      console.error('❌ Error uploading diamond:', error);
      setErrors([error instanceof Error ? error.message : 'Upload failed']);
      onUploadError?.(error instanceof Error ? error.message : 'Upload failed');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Card className={`w-full max-w-2xl mx-auto ${className}`}>
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Upload New Diamond</CardTitle>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category">Category</Label>
              <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Investment Diamonds">Investment Diamonds</SelectItem>
                  <SelectItem value="Polished Diamonds">Polished Diamonds</SelectItem>
                  <SelectItem value="Rough Diamonds">Rough Diamonds</SelectItem>
                  <SelectItem value="Colored Diamonds">Colored Diamonds</SelectItem>
                  <SelectItem value="Certified Diamonds">Certified Diamonds</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="shape">Shape</Label>
              <Select value={formData.shape} onValueChange={(value) => handleInputChange('shape', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Round">Round</SelectItem>
                  <SelectItem value="Princess">Princess</SelectItem>
                  <SelectItem value="Oval">Oval</SelectItem>
                  <SelectItem value="Emerald">Emerald</SelectItem>
                  <SelectItem value="Pear">Pear</SelectItem>
                  <SelectItem value="Marquise">Marquise</SelectItem>
                  <SelectItem value="Heart">Heart</SelectItem>
                  <SelectItem value="Radiant">Radiant</SelectItem>
                  <SelectItem value="Asscher">Asscher</SelectItem>
                  <SelectItem value="Cushion">Cushion</SelectItem>
                  <SelectItem value="Crescent">Crescent</SelectItem>
                  <SelectItem value="Custom">Custom</SelectItem>
                  <SelectItem value="Alphabet">Alphabet</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* 4C's Information */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="carat">Carat</Label>
              <Input
                type="number"
                step="0.01"
                min="0.01"
                max="100"
                value={formData.carat}
                onChange={(e) => handleInputChange('carat', parseFloat(e.target.value) || 0)}
                placeholder="e.g., 2.5"
              />
            </div>

            <div>
              <Label htmlFor="color">Color</Label>
              <Select value={formData.color} onValueChange={(value) => handleInputChange('color', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="D">D</SelectItem>
                  <SelectItem value="E">E</SelectItem>
                  <SelectItem value="F">F</SelectItem>
                  <SelectItem value="G">G</SelectItem>
                  <SelectItem value="H">H</SelectItem>
                  <SelectItem value="I">I</SelectItem>
                  <SelectItem value="J">J</SelectItem>
                  <SelectItem value="K">K</SelectItem>
                  <SelectItem value="L">L</SelectItem>
                  <SelectItem value="M">M</SelectItem>
                  <SelectItem value="Fancy Pink">Fancy Pink</SelectItem>
                  <SelectItem value="Fancy Yellow">Fancy Yellow</SelectItem>
                  <SelectItem value="Fancy Blue">Fancy Blue</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="clarity">Clarity</Label>
              <Select value={formData.clarity} onValueChange={(value) => handleInputChange('clarity', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="FL">FL</SelectItem>
                  <SelectItem value="IF">IF</SelectItem>
                  <SelectItem value="VVS1">VVS1</SelectItem>
                  <SelectItem value="VVS2">VVS2</SelectItem>
                  <SelectItem value="VS1">VS1</SelectItem>
                  <SelectItem value="VS2">VS2</SelectItem>
                  <SelectItem value="SI1">SI1</SelectItem>
                  <SelectItem value="SI2">SI2</SelectItem>
                  <SelectItem value="SI3">SI3</SelectItem>
                  <SelectItem value="I1">I1</SelectItem>
                  <SelectItem value="I2">I2</SelectItem>
                  <SelectItem value="I3">I3</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="cut">Cut</Label>
              <Select value={formData.cut} onValueChange={(value) => handleInputChange('cut', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Excellent">Excellent</SelectItem>
                  <SelectItem value="Very Good">Very Good</SelectItem>
                  <SelectItem value="Good">Good</SelectItem>
                  <SelectItem value="Fair">Fair</SelectItem>
                  <SelectItem value="Poor">Poor</SelectItem>
                  <SelectItem value="Ideal">Ideal</SelectItem>
                  <SelectItem value="Super Ideal">Super Ideal</SelectItem>
                  <SelectItem value="Premium">Premium</SelectItem>
                  <SelectItem value="Signature">Signature</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Description and Price */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Describe the diamond's characteristics, brilliance, and unique features..."
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="price">Price</Label>
              <Input
                type="text"
                value={formData.price}
                onChange={(e) => handleInputChange('price', e.target.value)}
                placeholder="e.g., $25,000"
              />
            </div>
          </div>

          {/* File Uploads */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="image">Primary Image</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange('imageFile', e.target.files?.[0] || null)}
                className="cursor-pointer"
              />
              {formData.imageFile && (
                <div className="mt-2 flex items-center space-x-2">
                  <Badge variant="secondary">
                    {formData.imageFile.name} ({formatFileSize(formData.imageFile.size)})
                  </Badge>
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="video">Primary Video</Label>
              <Input
                type="file"
                accept="video/*"
                onChange={(e) => handleFileChange('videoFile', e.target.files?.[0] || null)}
                className="cursor-pointer"
              />
              {formData.videoFile && (
                <div className="mt-2 flex items-center space-x-2">
                  <Badge variant="secondary">
                    {formData.videoFile.name} ({formatFileSize(formData.videoFile.size)})
                  </Badge>
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="videos">Additional Videos</Label>
              <Input
                type="file"
                accept="video/*"
                multiple
                onChange={(e) => handleVideoFilesChange(e.target.files)}
                className="cursor-pointer"
              />
              {formData.videoFiles && formData.videoFiles.length > 0 && (
                <div className="mt-2 space-y-1">
                  {formData.videoFiles.map((file, index) => (
                    <Badge key={index} variant="secondary">
                      {file.name} ({formatFileSize(file.size)})
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Bestseller Toggle */}
          <div className="flex items-center space-x-2">
            <Switch
              checked={formData.bestseller}
              onCheckedChange={(checked) => handleInputChange('bestseller', checked)}
            />
            <Label htmlFor="bestseller">Mark as Bestseller</Label>
          </div>

          {/* Error Messages */}
          {errors.length > 0 && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <ul className="text-red-600 text-sm space-y-1">
                {errors.map((error, index) => (
                  <li key={index}>• {error}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Upload Progress */}
          {isUploading && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Uploading...</span>
                <span>{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} className="w-full" />
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isUploading}
            className="w-full"
            size="lg"
          >
            {isUploading ? 'Uploading...' : 'Upload Diamond'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}; 