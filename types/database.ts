// Type definitions for database models

export interface Listing {
    id: string;
    user_id: string;
    nomenclature: string;
    classification: string | null;
    price: number;
    narrative: string | null;
    image_urls: string[];
    provenance_certified: boolean;
    logistics_provided: boolean;
    created_at: string;
    updated_at: string;
}

export interface ListingData {
    nomenclature: string;
    classification?: string;
    price: number;
    narrative?: string;
    image_urls: string[];
    provenance_certified: boolean;
    logistics_provided: boolean;
}

export interface User {
    id: string;
    email: string;
    created_at: string;
}
