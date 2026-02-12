import { TrendingUp } from 'lucide-react-native';
import React from 'react';
import {
    Dimensions,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';

const { width } = Dimensions.get('window');

interface MarketItem {
    id: string;
    name: string;
    category: string;
    price: number;
    change: number;
    volume: string;
}

const mockMarketData: MarketItem[] = [
    { id: '1', name: 'Premium Textiles', category: 'Fabric', price: 45000, change: 12.5, volume: '₹2.3M' },
    { id: '2', name: 'Organic Cotton', category: 'Raw Material', price: 32000, change: -3.2, volume: '₹1.8M' },
    { id: '3', name: 'Designer Fabrics', category: 'Fabric', price: 68000, change: 8.7, volume: '₹3.1M' },
    { id: '4', name: 'Synthetic Blends', category: 'Raw Material', price: 28000, change: 5.3, volume: '₹1.5M' },
    { id: '5', name: 'Silk Products', category: 'Fabric', price: 95000, change: -1.8, volume: '₹4.2M' },
    { id: '6', name: 'Wool Collections', category: 'Raw Material', price: 52000, change: 15.2, volume: '₹2.7M' },
];

export default function MarketIndex() {
    return (
        <View style={styles.container}>
            {/* HEADER */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>MARKET INDEX</Text>
                <Text style={styles.headerSubtitle}>Live market trends and pricing</Text>
            </View>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
                {/* MARKET OVERVIEW */}
                <Text style={styles.sectionTitle}>MARKET OVERVIEW</Text>

                <View style={styles.overviewGrid}>
                    <View style={styles.overviewCard}>
                        <View style={styles.overviewIconContainer}>
                            <TrendingUp size={20} color="#96D5B4" />
                        </View>
                        <Text style={styles.overviewValue}>+8.4%</Text>
                        <Text style={styles.overviewLabel}>MARKET GROWTH</Text>
                    </View>

                </View>

                {/* MARKET ITEMS */}
                <Text style={styles.sectionTitle}>TRENDING ITEMS</Text>

                {mockMarketData.map((item) => (
                    <View key={item.id} style={styles.marketCard}>
                        <View style={styles.marketCardLeft}>
                            <Text style={styles.itemName}>{item.name}</Text>
                            <Text style={styles.itemCategory}>{item.category}</Text>
                        </View>

                        <View style={styles.marketCardRight}>
                            <Text style={styles.itemPrice}>₹{item.price.toLocaleString()}</Text>
                            <View style={styles.changeContainer}>
                                {item.change >= 0 ? (
                                    <Text style={styles.changePositive}>
                                        +{item.change}%
                                    </Text>
                                ) : (
                                    <Text style={styles.changeNegative}>
                                        {item.change}%
                                    </Text>
                                )}
                            </View>
                            <Text style={styles.volumeText}>Vol: {item.volume}</Text>
                        </View>
                    </View>
                ))}

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

    headerSubtitle: {
        fontSize: 12,
        color: '#666',
        marginTop: 4,
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

    overviewGrid: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 32,
    },

    overviewCard: {
        flex: 1,
        backgroundColor: '#f8f8f8',
        borderRadius: 16,
        padding: 20,
        alignItems: 'flex-start',
    },

    overviewIconContainer: {
        marginBottom: 12,
    },

    overviewValue: {
        fontSize: 24,
        fontWeight: '700',
        color: '#000',
        marginBottom: 4,
    },

    overviewLabel: {
        fontSize: 9,
        letterSpacing: 1.5,
        color: '#666',
    },

    marketCard: {
        backgroundColor: '#f8f8f8',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    marketCardLeft: {
        flex: 1,
    },

    itemName: {
        fontSize: 14,
        fontWeight: '600',
        color: '#000',
        marginBottom: 4,
    },

    itemCategory: {
        fontSize: 11,
        color: '#666',
        letterSpacing: 1,
    },

    marketCardRight: {
        alignItems: 'flex-end',
    },

    itemPrice: {
        fontSize: 16,
        fontWeight: '700',
        color: '#000',
        marginBottom: 4,
    },

    changeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginBottom: 2,
    },

    changePositive: {
        fontSize: 12,
        fontWeight: '600',
        color: '#96D5B4',
    },

    changeNegative: {
        fontSize: 12,
        fontWeight: '600',
        color: '#FF6B6B',
    },

    volumeText: {
        fontSize: 10,
        color: '#999',
    },
});
