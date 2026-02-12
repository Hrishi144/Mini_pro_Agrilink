import { supabase } from './supabase';

/**
 * Storage Service
 * Responsible for uploading images to Supabase Storage
 * Does NOT handle UI state or authentication logic
 */

const BUCKET_NAME = 'listing-images';

/**
 * Convert a React Native image URI to a form that Supabase can upload
 */
async function prepareImageForUpload(uri: string) {
    // For React Native, we need to create a file-like object
    const filename = uri.split('/').pop() || 'image.jpg';
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : 'image/jpeg';

    return {
        uri,
        name: filename,
        type
    };
}

/**
 * Upload a single image to Supabase Storage
 * @param uri - Local image URI from React Native
 * @param userId - User ID for scoping the file path
 * @returns Public URL of the uploaded image
 */
export async function uploadImage(uri: string, userId: string): Promise<string> {
    try {
        console.log('Starting image upload:', uri);

        // Generate unique filename
        const timestamp = Date.now();
        const random = Math.random().toString(36).substring(7);
        const fileExt = uri.split('.').pop()?.split('?')[0] || 'jpg';
        const fileName = `${timestamp}_${random}.${fileExt}`;
        const filePath = `${userId}/${fileName}`;

        console.log('Upload path:', filePath);

        // For React Native with Expo, we need to handle the file differently
        // Create a FormData-compatible upload
        const formData = new FormData();

        // @ts-ignore - React Native's FormData accepts uri, name, type
        formData.append('file', {
            uri: uri,
            name: fileName,
            type: 'image/jpeg'
        });

        console.log('Prepared file for upload');

        // Get the user's session token for authenticated upload
        const { data: { session } } = await supabase.auth.getSession();

        if (!session) {
            throw new Error('User not authenticated. Please log in again.');
        }

        console.log('User authenticated, uploading...');

        // Upload to Supabase Storage using fetch with FormData
        const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
        const uploadUrl = `${supabaseUrl}/storage/v1/object/${BUCKET_NAME}/${filePath}`;

        console.log('Uploading to:', uploadUrl);

        const response = await fetch(uploadUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${session.access_token}`, // Use user's JWT token
            },
            body: formData
        });

        console.log('Upload response status:', response.status);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Upload failed:', errorText);

            if (response.status === 403) {
                throw new Error('Storage bucket permissions not configured. Please check Supabase storage policies.');
            }
            if (response.status === 404) {
                throw new Error(`Storage bucket "${BUCKET_NAME}" not found. Please create it in Supabase.`);
            }

            throw new Error(`Upload failed: ${errorText}`);
        }

        console.log('Upload successful!');

        // Get public URL
        const { data: urlData } = supabase.storage
            .from(BUCKET_NAME)
            .getPublicUrl(filePath);

        console.log('Public URL generated:', urlData.publicUrl);

        return urlData.publicUrl;
    } catch (error: any) {
        console.error('Error uploading image:', error);

        // More specific error messages
        if (error.message?.includes('Failed to read image file')) {
            throw new Error('Cannot access the selected image. Please try selecting it again.');
        }
        if (error.message?.includes('Network request failed') || error.name === 'TypeError') {
            throw new Error('Network error: Please check your internet connection and ensure the storage bucket is configured in Supabase.');
        }

        throw error;
    }
}

/**
 * Upload multiple images to Supabase Storage
 * @param uris - Array of local image URIs
 * @param userId - User ID for scoping file paths
 * @returns Array of public URLs
 */
export async function uploadImages(uris: string[], userId: string): Promise<string[]> {
    try {
        const uploadPromises = uris.map((uri) => uploadImage(uri, userId));
        const urls = await Promise.all(uploadPromises);
        return urls;
    } catch (error) {
        console.error('Error uploading images:', error);
        throw error;
    }
}
