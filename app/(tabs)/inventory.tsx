import { router } from 'expo-router';
import { Package, Plus, RefreshCw } from 'lucide-react-native';
import React, { useCallback, useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    FlatList,
    Image,
    RefreshControl,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { fetchUserListings } from '../../services/listingService';
import { Listing } from '../../types/database';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2;

export default function Inventory() {
    const { user } = useAuth();
    const [listings, setListings] = useState<Listing[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        loadListings();
    }, [user]);

    const loadListings = async () => {
        if (!user) return;

        try {
            const data = await fetchUserListings(user.id);
            setListings(data);
        } catch (error: any) {
            Alert.alert('Error', error.message || 'Failed to load listings');
        } finally {
            setLoading(false);
        }
    };

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await loadListings();
        setRefreshing(false);
    }, [user]);

    const renderListingCard = ({ item }: { item: Listing }) => (
        <TouchableOpacity style={styles.card}>
            <Image
                source={{ uri: item.image_urls[0] }}
                style={styles.cardImage}
            />
            <View style={styles.cardContent}>
                <Text style={styles.cardTitle} numberOfLines={2}>
                    {item.nomenclature}
                </Text>
                <Text style={styles.cardPrice}>₹{item.price.toLocaleString()}</Text>
                {item.provenance_certified && (
                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>CERTIFIED</Text>
                    </View>
                )}
            </View>
        </TouchableOpacity>
    );

    const renderEmpty = () => (
        <View style={styles.emptyContainer}>
            <Package size={64} color="#ccc" />
            <Text style={styles.emptyTitle}>No Listings Yet</Text>
            <Text style={styles.emptyText}>
                Start selling by creating your first listing
            </Text>
            <TouchableOpacity
                style={styles.createButton}
                onPress={() => router.push('/(tabs)')}
            >
                <Plus size={20} color="#000" />
                <Text style={styles.createButtonText}>CREATE LISTING</Text>
            </TouchableOpacity>
        </View>
    );

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#96D5B4" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* HEADER */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>INVENTORY</Text>
                <TouchableOpacity onPress={onRefresh}>
                    <RefreshCw size={20} color="#000" />
                </TouchableOpacity>
            </View>

            {/* LISTINGS GRID */}
            <FlatList
                data={listings}
                renderItem={renderListingCard}
                keyExtractor={(item) => item.id}
                numColumns={2}
                contentContainerStyle={styles.listContent}
                columnWrapperStyle={styles.row}
                ListEmptyComponent={renderEmpty}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor="#96D5B4"
                    />
                }
            />

            {/* FLOATING ADD BUTTON */}
            {listings.length > 0 && (
                <TouchableOpacity
                    style={styles.fab}
                    onPress={() => router.push('/(tabs)')}
                >
                    <Plus size={28} color="#000" />
                </TouchableOpacity>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },

    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },

    header: {
        paddingTop: 56,
        paddingBottom: 20,
        paddingHorizontal: 24,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff',
    },

    headerTitle: {
        fontSize: 10,
        letterSpacing: 4,
        fontWeight: '700',
        color: '#000',
    },

    listContent: {
        padding: 16,
        paddingBottom: 100,
    },

    row: {
        justifyContent: 'space-between',
        marginBottom: 16,
    },

    card: {
        width: CARD_WIDTH,
        backgroundColor: '#fff',
        borderRadius: 12,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#eee',
    },

    cardImage: {
        width: '100%',
        height: 180,
        backgroundColor: '#f5f5f5',
    },

    cardContent: {
        padding: 12,
    },

    cardTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#000',
        marginBottom: 4,
        minHeight: 40,
    },

    cardPrice: {
        fontSize: 18,
        fontWeight: '700',
        color: '#000',
        marginBottom: 8,
    },

    badge: {
        backgroundColor: '#96D5B4',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        alignSelf: 'flex-start',
    },

    badgeText: {
        fontSize: 8,
        letterSpacing: 1,
        fontWeight: '700',
        color: '#000',
    },

    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
    },

    emptyTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#000',
        marginTop: 16,
        marginBottom: 8,
    },

    emptyText: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        marginBottom: 24,
    },

    createButton: {
        flexDirection: 'row',
        backgroundColor: '#96D5B4',
        paddingHorizontal: 24,
        paddingVertical: 14,
        borderRadius: 24,
        alignItems: 'center',
        gap: 8,
    },

    createButtonText: {
        fontSize: 12,
        letterSpacing: 2,
        fontWeight: '700',
        color: '#000',
    },

    fab: {
        position: 'absolute',
        right: 24,
        bottom: 24,
        width: 64,
        height: 64,
        backgroundColor: '#96D5B4',
        borderRadius: 32,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
});
