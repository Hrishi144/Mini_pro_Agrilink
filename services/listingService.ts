import { Listing, ListingData } from '../types/database';
import { supabase } from './supabase';

/**
 * Listing Service
 * Responsible for all database operations related to listings
 * Does NOT handle UI logic, image uploads, or form validation
 */

/**
 * Create a new listing in the database
 * @param data - Listing data including user_id and image URLs
 */
export async function createListing(data: ListingData & { user_id: string }): Promise<void> {
    try {
        const { error } = await supabase.from('listings').insert({
            user_id: data.user_id,
            nomenclature: data.nomenclature,
            classification: data.classification || null,
            price: data.price,
            narrative: data.narrative || null,
            image_urls: data.image_urls,
            provenance_certified: data.provenance_certified,
            logistics_provided: data.logistics_provided,
        });

        if (error) {
            throw new Error(`Failed to create listing: ${error.message}`);
        }
    } catch (error) {
        console.error('Error creating listing:', error);
        throw error;
    }
}

/**
 * Fetch all listings for a specific user
 * @param userId - User ID to filter listings
 * @returns Array of listings sorted by creation date (newest first)
 */
export async function fetchUserListings(userId: string): Promise<Listing[]> {
    try {
        const { data, error } = await supabase
            .from('listings')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) {
            throw new Error(`Failed to fetch listings: ${error.message}`);
        }

        return data as Listing[];
    } catch (error) {
        console.error('Error fetching listings:', error);
        throw error;
    }
}

/**
 * Delete a listing from the database
 * @param id - Listing ID to delete
 * @param userId - User ID for verification (RLS will enforce this anyway)
 */
export async function deleteListing(id: string, userId: string): Promise<void> {
    try {
        const { error } = await supabase
            .from('listings')
            .delete()
            .eq('id', id)
            .eq('user_id', userId);

        if (error) {
            throw new Error(`Failed to delete listing: ${error.message}`);
        }
    } catch (error) {
        console.error('Error deleting listing:', error);
        throw error;
    }
}
