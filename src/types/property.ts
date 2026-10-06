export type PropertyType = 'Apartment' | 'Penthouse' | 'Bungalow / Villa' | 'Plot' | 'Commercial';
export type ListingIntent = 'Buy' | 'Rent' | 'New Project';
export type LeadStatus = 'New' | 'Contacted' | 'Site Visit' | 'Interested' | 'Closed';

export interface Property {
  id: string;
  title: string;
  projectName?: string;
  locality: string;
  subArea?: string;
  intent: ListingIntent;
  propertyType: PropertyType;
  priceNumeric: number; // in INR
  priceDisplay: string; // e.g. "₹85 Lakhs" or "₹1.45 Cr"
  pricePerSqFt: number;
  bedrooms: number;
  bathrooms: number;
  balconies: number;
  carpetAreaSqFt: number;
  superBuiltupSqFt: number;
  furnishingStatus: 'Unfurnished' | 'Semi-Furnished' | 'Fully Furnished';
  possessionStatus: 'Ready to Move' | 'Under Construction' | 'Immediate';
  possessionDate?: string;
  reraId?: string;
  isVerified: boolean;
  isFeatured?: boolean;
  hasVideoTour: boolean;
  videoDurationSec?: number;
  coverImage: string;
  galleryImages: string[];
  description: string;
  amenities: string[];
  nearbyLandmarks: {
    schools: string[];
    hospitals: string[];
    shopping: string[];
    transit: string[];
  };
  floorNumber?: number;
  totalFloors?: number;
  facing?: 'East' | 'North' | 'North-East' | 'West' | 'South';
  sellerName: string;
  sellerType: 'Owner' | 'Verified Agent' | 'Builder';
  viewsCount: number;
}

export interface Enquiry {
  id: string;
  date: string; // DD-MM-YYYY
  timestamp: number;
  customerName: string;
  mobile: string;
  email: string;
  propertyId: string;
  propertyTitle: string;
  location: string;
  intent: ListingIntent;
  budget: string;
  message: string;
  status: LeadStatus;
  preferredVisitDate?: string;
  notes?: string;
}

export interface LocalityInfo {
  id: string;
  name: string;
  tagline: string;
  avgPricePerSqFt: number;
  priceGrowthYOY: string;
  activeListingsCount: number;
  keyHighlights: string[];
  description: string;
}
