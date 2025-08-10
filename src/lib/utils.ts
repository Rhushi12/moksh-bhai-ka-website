import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: string | number): string {
  if (typeof price === 'string') {
    // If it's already formatted, return as is
    if (price.includes('$')) {
      return price;
    }
    // Convert string to number
    const numPrice = parseFloat(price.replace(/[$,]/g, ''));
    return formatPrice(numPrice);
  }
  
  if (price >= 1000000) {
    return `$${(price / 1000000).toFixed(1)}M`;
  } else if (price >= 1000) {
    return `$${(price / 1000).toFixed(0)}K`;
  }
  return `$${price.toLocaleString()}`;
}
