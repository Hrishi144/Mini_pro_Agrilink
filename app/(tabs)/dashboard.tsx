import { router } from 'expo-router';
import { AlertTriangle, Droplet, LayoutGrid, ShoppingCart, Sun } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
    Dimensions,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { fetchUserListings } from '../../services/listingService';

const { width } = Dimensions.get('window');

interface MarketPrice {
    name: string;
    price: string;
    change: string;
    isPositive: boolean;
}

export default function Dashboard() {
    const { user } = useAuth();
    const [activeListingsCount, setActiveListingsCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [currentSpotlight, setCurrentSpotlight] = useState(0);

    // Mock market data - in production, fetch from API
    const marketPrices: MarketPrice[] = [
        { name: 'WHEAT', price: '$7.42', change: '+1.2%', isPositive: true },
        { name: 'CORN', price: '$4.85', change: '-0.4%', isPositive: false },
        { name: 'SOYBEANS', price: '$13.10', change: '+0.8%', isPositive: true },
    ];

    // Mock spotlight listings - in production, fetch featured listings
    const spotlightListings = [
        {
            title: 'Premium Organic Winter Seed',
            subtitle: 'MARKETPLACE SPOTLIGHT',
            image: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800',
        },
    ];

    useEffect(() => {
        loadUserListings();
    }, [user]);

    const loadUserListings = async () => {
        if (!user) return;

        try {
            const listings = await fetchUserListings(user.id);
            setActiveListingsCount(listings.length);
        } catch (error) {
            console.error('Error loading listings:', error);
        } finally {
            setLoading(false);
        }
    };

    const userName = user?.email?.split('@')[0]?.toUpperCase() || 'FARMER';

    return (
        <View style={styles.container}>
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
                {/* HEADER */}
                <View style={styles.header}>
                    <Text style={styles.systemLabel}>SYSTEM ACTIVE</Text>
                    <Text style={styles.greeting}>HAI,</Text>
                    <Text style={styles.userName}>{userName}</Text>
                </View>

                {/* ACTION BUTTONS */}
                <View style={styles.actionRow}>
                    <TouchableOpacity
                        style={styles.sellButton}
                        onPress={() => router.push('/(tabs)')}
                    >
                        <LayoutGrid size={20} color="#000" />
                        <Text style={styles.sellText}>SELL</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.buyButton}
                        onPress={() => router.push('/(tabs)/inventory')}
                    >
                        <ShoppingCart size={20} color="#000" />
                        <Text style={styles.buyText}>BUY</Text>
                    </TouchableOpacity>
                </View>

                {/* INFO CARDS ROW */}
                <View style={styles.infoRow}>
                    <View style={styles.infoCard}>
                        <Text style={styles.infoLabel}>LOCAL WEATHER</Text>
                        <View style={styles.infoValueRow}>
                            <Sun size={20} color="#96D5B4" />
                            <Text style={styles.infoValue}>28°C</Text>
                        </View>
                    </View>

                    <View style={styles.infoCard}>
                        <Text style={styles.infoLabel}>SOIL HUMIDITY</Text>
                        <View style={styles.infoValueRow}>
                            <Droplet size={20} color="#96D5B4" />
                            <Text style={styles.infoValue}>42%</Text>
                        </View>
                    </View>
                </View>

                {/* MARKET PRICES */}
                <View style={styles.marketSection}>
                    <View style={styles.marketHeader}>
                        <Text style={styles.marketTitle}>MARKET PRICES</Text>
                        <Text style={styles.marketTrend}>📈</Text>
                    </View>

                    <View style={styles.priceRow}>
                        {marketPrices.map((item, index) => (
                            <View key={index} style={styles.priceCard}>
                                <Text style={styles.priceName}>{item.name}</Text>
                                <Text style={styles.priceValue}>{item.price}</Text>
                                <Text style={[
                                    styles.priceChange,
                                    { color: item.isPositive ? '#4CAF50' : '#F44336' }
                                ]}>
                                    {item.change}
                                </Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* ANALYTICS ROW */}
                <View style={styles.analyticsRow}>
                    {/* ACTIVE LISTINGS */}
                    <View style={styles.listingsCard}>
                        <LayoutGrid size={24} color="#000" />
                        <Text style={styles.listingsCount}>{loading ? '...' : activeListingsCount}</Text>
                        <Text style={styles.listingsLabel}>ACTIVE LISTINGS</Text>
                    </View>

                    {/* GROWTH ANALYTICS */}
                    <View style={styles.growthCard}>
                        <View style={styles.growthHeader}>
                            <Text style={styles.growthLabel}>GROWTH</Text>
                            <Text style={styles.growthValue}>+12%</Text>
                        </View>
                        {/* Simple line chart visualization */}
                        <View style={styles.chartContainer}>
                            <View style={styles.chartLine} />
                            <Text style={styles.chartLabel}>YIELD ANALYTICS</Text>
                        </View>
                    </View>
                </View>

                {/* MARKETPLACE SPOTLIGHT */}
                <View style={styles.spotlightSection}>
                    <View style={styles.spotlightCard}>
                        <Image
                            source={{ uri: spotlightListings[currentSpotlight].image }}
                            style={styles.spotlightImage}
                        />
                        <View style={styles.spotlightOverlay}>
                            <Text style={styles.spotlightSubtitle}>
                                {spotlightListings[currentSpotlight].subtitle}
                            </Text>
                            <Text style={styles.spotlightTitle}>
                                {spotlightListings[currentSpotlight].title}
                            </Text>
                        </View>
                        <TouchableOpacity style={styles.spotlightArrow}>
                            <Text style={styles.arrowText}>→</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Pagination dots */}
                    <View style={styles.dotsContainer}>
                        {spotlightListings.map((_, index) => (
                            <View
                                key={index}
                                style={[
                                    styles.dot,
                                    currentSpotlight === index && styles.dotActive
                                ]}
                            />
                        ))}
                    </View>
                </View>

                {/* RECENT ALERTS */}
                <View style={styles.alertsSection}>
                    <Text style={styles.alertsTitle}>RECENT ALERTS</Text>

                    <View style={styles.alertCard}>
                        <AlertTriangle size={16} color="#333" />
                        <Text style={styles.alertText}>Price Alert: Rice up +2%</Text>
                        <Text style={styles.alertTime}>NOW</Text>
                    </View>
                </View>

                {/* Bottom padding for navigation */}
                <View style={{ height: 100 }} />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#96D5B4',
    },

    scrollView: {
        flex: 1,
    },

    content: {
        padding: 20,
    },

    header: {
        marginTop: 40,
        marginBottom: 24,
    },

    systemLabel: {
        fontSize: 9,
        letterSpacing: 2,
        color: '#000',
        opacity: 0.6,
        marginBottom: 8,
    },

    greeting: {
        fontSize: 32,
        fontWeight: '700',
        color: '#000',
        marginBottom: -4,
    },

    userName: {
        fontSize: 32,
        fontWeight: '700',
        color: '#000',
    },

    actionRow: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 20,
    },

    sellButton: {
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },

    sellText: {
        fontSize: 14,
        fontWeight: '700',
        letterSpacing: 1,
        color: '#000',
    },

    buyButton: {
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },

    buyText: {
        fontSize: 14,
        fontWeight: '700',
        letterSpacing: 1,
        color: '#000',
    },

    infoRow: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 20,
    },

    infoCard: {
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
    },

    infoLabel: {
        fontSize: 9,
        letterSpacing: 1.5,
        color: '#666',
        marginBottom: 8,
    },

    infoValueRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },

    infoValue: {
        fontSize: 24,
        fontWeight: '700',
        color: '#000',
    },

    marketSection: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        marginBottom: 20,
    },

    marketHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },

    marketTitle: {
        fontSize: 10,
        letterSpacing: 2,
        fontWeight: '700',
        color: '#000',
    },

    marketTrend: {
        fontSize: 16,
    },

    priceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },

    priceCard: {
        flex: 1,
    },

    priceName: {
        fontSize: 9,
        letterSpacing: 1,
        color: '#666',
        marginBottom: 4,
    },

    priceValue: {
        fontSize: 18,
        fontWeight: '700',
        color: '#000',
        marginBottom: 2,
    },

    priceChange: {
        fontSize: 11,
        fontWeight: '600',
    },

    analyticsRow: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 20,
    },

    listingsCard: {
        flex: 1,
        backgroundColor: '#96D5B4',
        borderRadius: 16,
        padding: 24,
        alignItems: 'flex-start',
    },

    listingsCount: {
        fontSize: 48,
        fontWeight: '700',
        color: '#000',
        marginTop: 16,
        marginBottom: 4,
    },

    listingsLabel: {
        fontSize: 9,
        letterSpacing: 1.5,
        color: '#000',
        opacity: 0.7,
    },

    growthCard: {
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
    },

    growthHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },

    growthLabel: {
        fontSize: 10,
        letterSpacing: 1.5,
        color: '#666',
    },

    growthValue: {
        fontSize: 14,
        fontWeight: '700',
        color: '#4CAF50',
    },

    chartContainer: {
        marginTop: 8,
    },

    chartLine: {
        height: 60,
        backgroundColor: '#E8F5E9',
        borderRadius: 8,
        marginBottom: 12,
    },

    chartLabel: {
        fontSize: 9,
        letterSpacing: 1.5,
        color: '#666',
    },

    spotlightSection: {
        marginBottom: 20,
    },

    spotlightCard: {
        height: 200,
        borderRadius: 20,
        overflow: 'hidden',
        position: 'relative',
    },

    spotlightImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },

    spotlightOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 20,
        backgroundColor: 'rgba(0,0,0,0.4)',
    },

    spotlightSubtitle: {
        fontSize: 9,
        letterSpacing: 2,
        color: '#fff',
        opacity: 0.8,
        marginBottom: 4,
    },

    spotlightTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#fff',
    },

    spotlightArrow: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        width: 40,
        height: 40,
        backgroundColor: '#96D5B4',
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },

    arrowText: {
        fontSize: 20,
        color: '#000',
        fontWeight: '700',
    },

    dotsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 6,
        marginTop: 12,
    },

    dot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: 'rgba(0,0,0,0.2)',
    },

    dotActive: {
        backgroundColor: '#000',
    },

    alertsSection: {
        marginBottom: 20,
    },

    alertsTitle: {
        fontSize: 10,
        letterSpacing: 2,
        fontWeight: '700',
        color: '#000',
        marginBottom: 12,
    },

    alertCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        gap: 12,
    },

    alertText: {
        flex: 1,
        fontSize: 13,
        color: '#000',
    },

    alertTime: {
        fontSize: 11,
        fontWeight: '700',
        color: '#96D5B4',
    },
});
