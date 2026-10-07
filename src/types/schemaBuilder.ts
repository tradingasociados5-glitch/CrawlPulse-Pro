export type SchemaType = 'Product' | 'LocalBusiness' | 'FAQPage';

export interface ProductSchemaForm {
  name: string;
  image: string;
  description: string;
  sku: string;
  brand: string;
  price: string;
  priceCurrency: string;
  availability: 'https://schema.org/InStock' | 'https://schema.org/OutOfStock' | 'https://schema.org/PreOrder';
  ratingValue: string;
  reviewCount: string;
}

export interface LocalBusinessSchemaForm {
  name: string;
  image: string;
  telephone: string;
  streetAddress: string;
  addressLocality: string;
  postalCode: string;
  addressCountry: string;
  priceRange: string;
  openingHours: string;
  geoLatitude: string;
  geoLongitude: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface FaqSchemaForm {
  faqs: FaqItem[];
}
