import { Tabs } from 'expo-router';
import { ClipboardList, LayoutGrid, ShoppingCart, TrendingUp, User } from 'lucide-react-native';
import React from 'react';
import { StyleSheet } from 'react-native';

export default function TabLayout() {
    return (
        <Tabs
            initialRouteName="dashboard"
            screenOptions={{
                headerShown: false,
                tabBarStyle: styles.tabBar,
                tabBarActiveTintColor: '#96D5B4',
                tabBarInactiveTintColor: '#fff',
                tabBarLabelStyle: styles.tabBarLabel,
            }}
        >
            <Tabs.Screen
                name="dashboard"
                options={{
                    title: 'DASH',
                    tabBarIcon: ({ color, size }) => (
                        <LayoutGrid size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="inventory"
                options={{
                    title: 'INVENTORY',
                    tabBarIcon: ({ color, size }) => (
                        <ClipboardList size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="marketIndex"
                options={{
                    title: 'MARKET INDEX',
                    tabBarIcon: ({ color, size }) => (
                        <TrendingUp size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="analytics"
                options={{
                    title: 'LISTINGS',
                    tabBarIcon: ({ color, size }) => (
                        <ShoppingCart size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'PROFILE',
                    tabBarIcon: ({ color, size }) => (
                        <User size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="index"
                options={{
                    href: null, // Hide from tab bar but keep accessible via navigation
                }}
            />
        </Tabs>
    );
}

const styles = StyleSheet.create({
    tabBar: {
        backgroundColor: '#000',
        borderTopWidth: 0,
        paddingTop: 8,
        paddingBottom: 20,
        height: 75,
        paddingHorizontal: 8,
    },

    tabBarLabel: {
        fontSize: 7,
        letterSpacing: 1.5,
        fontWeight: '700',
        marginTop: 2,
    },
});
