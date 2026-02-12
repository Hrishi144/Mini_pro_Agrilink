import { createClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
        'Missing Supabase credentials. Please check your .env file and ensure EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY are set.'
    );
}

// Dynamically import AsyncStorage only for native platforms
let storageAdapter;
if (Platform.OS !== 'web') {
    const AsyncStorage = require('@react-native-async-storage/async-storage').default;
    storageAdapter = AsyncStorage;
} else {
    // For web, use a simple localStorage adapter
    storageAdapter = {
        getItem: async (key: string) => {
            if (typeof window !== 'undefined') {
                return window.localStorage.getItem(key);
            }
            return null;
        },
        setItem: async (key: string, value: string) => {
            if (typeof window !== 'undefined') {
                window.localStorage.setItem(key, value);
            }
        },
        removeItem: async (key: string) => {
            if (typeof window !== 'undefined') {
                window.localStorage.removeItem(key);
            }
        },
    };
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        storage: storageAdapter,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
    },
});
