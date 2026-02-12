import { router } from 'expo-router';
import React, { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useAuth } from '../contexts/AuthContext';

/**
 * Root index that handles initial routing based on auth state
 */
export default function Index() {
    const { user, loading } = useAuth();

    useEffect(() => {
        if (!loading) {
            if (user) {
                // User is authenticated, navigate to dashboard
                router.replace('/(tabs)/dashboard');
            } else {
                // User is not authenticated, navigate to login
                router.replace('/auth/login');
            }
        }
    }, [user, loading]);

    // Show loading screen while checking auth state
    return (
        <View style={styles.container}>
            <ActivityIndicator size="large" color="#96D5B4" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
});
