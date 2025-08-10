import React, { useState } from 'react';
import { isValidPhoneNumber } from 'libphonenumber-js';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import PhoneInput from './PhoneInput';
import { findCountryByCode } from '@/data/countries';

export const PhoneInputDemo: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneNumber2, setPhoneNumber2] = useState('');
  const [phoneNumber3, setPhoneNumber3] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [isValid2, setIsValid2] = useState(false);
  const [isValid3, setIsValid3] = useState(false);

  const handlePhoneChange = (value: string) => {
    setPhoneNumber(value);
    setIsValid(value ? isValidPhoneNumber(value) : false);
  };

  const handlePhoneChange2 = (value: string) => {
    setPhoneNumber2(value);
    setIsValid2(value ? isValidPhoneNumber(value) : false);
  };

  const handlePhoneChange3 = (value: string) => {
    setPhoneNumber3(value);
    setIsValid3(value ? isValidPhoneNumber(value) : false);
  };

  const handleClear = () => {
    setPhoneNumber('');
    setIsValid(false);
  };

  const handleClear2 = () => {
    setPhoneNumber2('');
    setIsValid2(false);
  };

  const handleClear3 = () => {
    setPhoneNumber3('');
    setIsValid3(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Phone Input Component Demo</h1>
        <p className="text-muted-foreground">
          A comprehensive phone number input with country code selection and intelligent filtering
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Basic Example */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Phone Input</CardTitle>
            <CardDescription>
              Default phone input with United States as the default country
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phone-basic">Phone Number</Label>
              <PhoneInput
                id="phone-basic"
                value={phoneNumber}
                onChange={handlePhoneChange}
                placeholder="Enter your phone number"
                error={phoneNumber && !isValid}
              />
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleClear}>
                Clear
              </Button>
              <span className="text-sm text-muted-foreground">
                {phoneNumber ? (isValid ? '✅ Valid' : '❌ Invalid') : 'No input'}
              </span>
            </div>
            {phoneNumber && (
              <div className="text-sm">
                <p><strong>Full Number:</strong> {phoneNumber}</p>
                <p><strong>Valid:</strong> {isValid ? 'Yes' : 'No'}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Custom Default Country */}
        <Card>
          <CardHeader>
            <CardTitle>Custom Default Country</CardTitle>
            <CardDescription>
              Phone input with India as the default country
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phone-india">Phone Number (India)</Label>
              <PhoneInput
                id="phone-india"
                value={phoneNumber2}
                onChange={handlePhoneChange2}
                placeholder="Enter your phone number"
                defaultCountry={findCountryByCode('IN')}
                error={phoneNumber2 && !isValid2}
              />
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleClear2}>
                Clear
              </Button>
              <span className="text-sm text-muted-foreground">
                {phoneNumber2 ? (isValid2 ? '✅ Valid' : '❌ Invalid') : 'No input'}
              </span>
            </div>
            {phoneNumber2 && (
              <div className="text-sm">
                <p><strong>Full Number:</strong> {phoneNumber2}</p>
                <p><strong>Valid:</strong> {isValid2 ? 'Yes' : 'No'}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Disabled State */}
        <Card>
          <CardHeader>
            <CardTitle>Disabled State</CardTitle>
            <CardDescription>
              Phone input in disabled state
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phone-disabled">Phone Number (Disabled)</Label>
              <PhoneInput
                id="phone-disabled"
                value="+1234567890"
                onChange={handlePhoneChange3}
                placeholder="This input is disabled"
                disabled={true}
              />
            </div>
            <p className="text-sm text-muted-foreground">
              This input is disabled and cannot be modified
            </p>
          </CardContent>
        </Card>

        {/* Required Field */}
        <Card>
          <CardHeader>
            <CardTitle>Required Field</CardTitle>
            <CardDescription>
              Phone input with required validation
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phone-required">Phone Number *</Label>
              <PhoneInput
                id="phone-required"
                value={phoneNumber3}
                onChange={handlePhoneChange3}
                placeholder="Required phone number"
                required={true}
                error={phoneNumber3 && !isValid3}
              />
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleClear3}>
                Clear
              </Button>
              <span className="text-sm text-muted-foreground">
                {phoneNumber3 ? (isValid3 ? '✅ Valid' : '❌ Invalid') : 'Required field'}
              </span>
            </div>
            {phoneNumber3 && (
              <div className="text-sm">
                <p><strong>Full Number:</strong> {phoneNumber3}</p>
                <p><strong>Valid:</strong> {isValid3 ? 'Yes' : 'No'}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Separator />

      {/* Features Section */}
      <Card>
        <CardHeader>
          <CardTitle>Features</CardTitle>
          <CardDescription>
            Key features of the phone input component
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <h4 className="font-semibold">Country Selection</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Dropdown with flag icons and country names</li>
                <li>• Search by country name, code, or dial code</li>
                <li>• Automatic country detection from input</li>
                <li>• Keyboard navigation support</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">Phone Number Formatting</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Real-time formatting as you type</li>
                <li>• Country-specific formatting rules</li>
                <li>• Automatic validation using libphonenumber-js</li>
                <li>• Error state handling</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">User Experience</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Seamless integration with forms</li>
                <li>• Accessible keyboard navigation</li>
                <li>• Mobile-friendly design</li>
                <li>• Dark theme support</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">Technical Features</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• TypeScript support</li>
                <li>• Customizable styling</li>
                <li>• Controlled and uncontrolled modes</li>
                <li>• Comprehensive prop interface</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* Usage Examples */}
      <Card>
        <CardHeader>
          <CardTitle>Usage Examples</CardTitle>
          <CardDescription>
            How to use the phone input component in your forms
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Basic Usage</h4>
              <pre className="bg-muted p-4 rounded-md text-sm overflow-x-auto">
{`import PhoneInput from '@/components/PhoneInput';

<PhoneInput
  value={phoneNumber}
  onChange={setPhoneNumber}
  placeholder="Enter phone number"
/>`}
              </pre>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">With Validation</h4>
              <pre className="bg-muted p-4 rounded-md text-sm overflow-x-auto">
{`import { isValidPhoneNumber } from 'libphonenumber-js';

const [phoneNumber, setPhoneNumber] = useState('');
const [isValid, setIsValid] = useState(false);

const handlePhoneChange = (value: string) => {
  setPhoneNumber(value);
  setIsValid(value ? isValidPhoneNumber(value) : false);
};

<PhoneInput
  value={phoneNumber}
  onChange={handlePhoneChange}
  error={phoneNumber && !isValid}
  required={true}
/>`}
              </pre>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Custom Default Country</h4>
              <pre className="bg-muted p-4 rounded-md text-sm overflow-x-auto">
{`import { findCountryByCode } from '@/data/countries';

<PhoneInput
  value={phoneNumber}
  onChange={setPhoneNumber}
  defaultCountry={findCountryByCode('IN')}
  placeholder="Enter Indian phone number"
/>`}
              </pre>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PhoneInputDemo; 