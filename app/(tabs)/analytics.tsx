import { BarChart, DollarSign, Eye, TrendingUp } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Dimensions,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { fetchUserListings } from '../../services/listingService';

const { width } = Dimensions.get('window');

export default function Analytics() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalListings: 0,
        totalRevenue: 0,
        avgPrice: 0,
        totalViews: 0,
    });

    useEffect(() => {
        loadAnalytics();
    }, [user]);

    const loadAnalytics = async () => {
        if (!user) return;

        try {
            const listings = await fetchUserListings(user.id);

            const totalRevenue = listings.reduce((sum, item) => sum + item.price, 0);
            const avgPrice = listings.length > 0 ? totalRevenue / listings.length : 0;

            setStats({
                totalListings: listings.length,
                totalRevenue,
                avgPrice,
                totalViews: listings.length * 42, // Mock views
            });
        } catch (error) {
            console.error('Error loading analytics:', error);
        } finally {
            setLoading(false);
        }
    };

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
                <Text style={styles.headerTitle}>ANALYTICS</Text>
            </View>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
                {/* OVERVIEW STATS */}
                <Text style={styles.sectionTitle}>OVERVIEW</Text>

                <View style={styles.statsGrid}>
                    <View style={styles.statCard}>
                        <View style={styles.statIconContainer}>
                            <BarChart size={24} color="#96D5B4" />
                        </View>
                        <Text style={styles.statValue}>{stats.totalListings}</Text>
                        <Text style={styles.statLabel}>TOTAL LISTINGS</Text>
                    </View>

                    <View style={styles.statCard}>
                        <View style={styles.statIconContainer}>
                            <DollarSign size={24} color="#96D5B4" />
                        </View>
                        <Text style={styles.statValue}>₹{stats.totalRevenue.toLocaleString()}</Text>
                        <Text style={styles.statLabel}>TOTAL VALUE</Text>
                    </View>

                    <View style={styles.statCard}>
                        <View style={styles.statIconContainer}>
                            <TrendingUp size={24} color="#96D5B4" />
                        </View>
                        <Text style={styles.statValue}>₹{Math.round(stats.avgPrice).toLocaleString()}</Text>
                        <Text style={styles.statLabel}>AVG PRICE</Text>
                    </View>

                    <View style={styles.statCard}>
                        <View style={styles.statIconContainer}>
                            <Eye size={24} color="#96D5B4" />
                        </View>
                        <Text style={styles.statValue}>{stats.totalViews}</Text>
                        <Text style={styles.statLabel}>TOTAL VIEWS</Text>
                    </View>
                </View>

                {/* PERFORMANCE */}
                <Text style={styles.sectionTitle}>PERFORMANCE</Text>

                <View style={styles.performanceCard}>
                    <Text style={styles.performanceLabel}>LISTING ACTIVITY</Text>
                    <View style={styles.chartPlaceholder}>
                        <View style={styles.barContainer}>
                            <View style={[styles.bar, { height: '60%' }]} />
                            <Text style={styles.barLabel}>Mon</Text>
                        </View>
                        <View style={styles.barContainer}>
                            <View style={[styles.bar, { height: '40%' }]} />
                            <Text style={styles.barLabel}>Tue</Text>
                        </View>
                        <View style={styles.barContainer}>
                            <View style={[styles.bar, { height: '80%' }]} />
                            <Text style={styles.barLabel}>Wed</Text>
                        </View>
                        <View style={styles.barContainer}>
                            <View style={[styles.bar, { height: '50%' }]} />
                            <Text style={styles.barLabel}>Thu</Text>
                        </View>
                        <View style={styles.barContainer}>
                            <View style={[styles.bar, { height: '70%' }]} />
                            <Text style={styles.barLabel}>Fri</Text>
                        </View>
                        <View style={styles.barContainer}>
                            <View style={[styles.bar, { height: '90%' }]} />
                            <Text style={styles.barLabel}>Sat</Text>
                        </View>
                        <View style={styles.barContainer}>
                            <View style={[styles.bar, { height: '55%' }]} />
                            <Text style={styles.barLabel}>Sun</Text>
                        </View>
                    </View>
                </View>

                {/* INSIGHTS */}
                <Text style={styles.sectionTitle}>INSIGHTS</Text>

                <View style={styles.insightCard}>
                    <Text style={styles.insightTitle}>📈 Growing Demand</Text>
                    <Text style={styles.insightText}>
                        Your listings are receiving 23% more views this week
                    </Text>
                </View>

                <View style={styles.insightCard}>
                    <Text style={styles.insightTitle}>💡 Pricing Tip</Text>
                    <Text style={styles.insightText}>
                        Items priced between ₹5,000-₹15,000 get the most engagement
                    </Text>
                </View>

                {/* Bottom padding */}
                <View style={{ height: 100 }} />
            </ScrollView>
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
        backgroundColor: '#fff',
    },

    headerTitle: {
        fontSize: 10,
        letterSpacing: 4,
        fontWeight: '700',
        color: '#000',
    },

    scrollView: {
        flex: 1,
    },

    content: {
        padding: 24,
    },

    sectionTitle: {
        fontSize: 10,
        letterSpacing: 3,
        fontWeight: '700',
        color: '#000',
        marginBottom: 16,
    },

    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        marginBottom: 32,
    },

    statCard: {
        width: (width - 60) / 2,
        backgroundColor: '#f8f8f8',
        borderRadius: 16,
        padding: 20,
        alignItems: 'flex-start',
    },

    statIconContainer: {
        marginBottom: 12,
    },

    statValue: {
        fontSize: 24,
        fontWeight: '700',
        color: '#000',
        marginBottom: 4,
    },

    statLabel: {
        fontSize: 9,
        letterSpacing: 1.5,
        color: '#666',
    },

    performanceCard: {
        backgroundColor: '#f8f8f8',
        borderRadius: 16,
        padding: 20,
        marginBottom: 32,
    },

    performanceLabel: {
        fontSize: 10,
        letterSpacing: 2,
        fontWeight: '700',
        color: '#000',
        marginBottom: 20,
    },

    chartPlaceholder: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        height: 150,
        paddingBottom: 20,
    },

    barContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-end',
    },

    bar: {
        width: 20,
        backgroundColor: '#96D5B4',
        borderRadius: 4,
        marginBottom: 8,
    },

    barLabel: {
        fontSize: 9,
        color: '#666',
    },

    insightCard: {
        backgroundColor: '#f8f8f8',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
    },

    insightTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#000',
        marginBottom: 6,
    },

    insightText: {
        fontSize: 13,
        color: '#666',
        lineHeight: 20,
    },
});
