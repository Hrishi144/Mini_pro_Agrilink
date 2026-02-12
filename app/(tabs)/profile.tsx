import { router } from 'expo-router';
import { Bell, LogOut, Mail, Settings, Shield, User as UserIcon } from 'lucide-react-native';
import React from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useAuth } from '../../contexts/AuthContext';

export default function Profile() {
    const { user, signOut } = useAuth();

    const handleSignOut = async () => {
        Alert.alert(
            'Sign Out',
            'Are you sure you want to sign out?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Sign Out',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await signOut();
                            router.replace('/auth/login');
                        } catch (error: any) {
                            Alert.alert('Error', error.message || 'Failed to sign out');
                        }
                    },
                },
            ]
        );
    };

    const userName = user?.email?.split('@')[0] || 'User';
    const userEmail = user?.email || '';

    return (
        <View style={styles.container}>
            {/* HEADER */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>PROFILE</Text>
            </View>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
                {/* USER INFO */}
                <View style={styles.userSection}>
                    <View style={styles.avatar}>
                        <UserIcon size={40} color="#000" />
                    </View>
                    <Text style={styles.userName}>{userName}</Text>
                    <Text style={styles.userEmail}>{userEmail}</Text>
                </View>

                {/* ACCOUNT SECTION */}
                <Text style={styles.sectionTitle}>ACCOUNT</Text>

                <View style={styles.menuSection}>
                    <TouchableOpacity style={styles.menuItem}>
                        <View style={styles.menuIconContainer}>
                            <UserIcon size={20} color="#666" />
                        </View>
                        <Text style={styles.menuText}>Edit Profile</Text>
                        <Text style={styles.menuArrow}>→</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.menuItem}>
                        <View style={styles.menuIconContainer}>
                            <Bell size={20} color="#666" />
                        </View>
                        <Text style={styles.menuText}>Notifications</Text>
                        <Text style={styles.menuArrow}>→</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.menuItem}>
                        <View style={styles.menuIconContainer}>
                            <Shield size={20} color="#666" />
                        </View>
                        <Text style={styles.menuText}>Privacy & Security</Text>
                        <Text style={styles.menuArrow}>→</Text>
                    </TouchableOpacity>
                </View>

                {/* SETTINGS SECTION */}
                <Text style={styles.sectionTitle}>SETTINGS</Text>

                <View style={styles.menuSection}>
                    <TouchableOpacity style={styles.menuItem}>
                        <View style={styles.menuIconContainer}>
                            <Settings size={20} color="#666" />
                        </View>
                        <Text style={styles.menuText}>Preferences</Text>
                        <Text style={styles.menuArrow}>→</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.menuItem}>
                        <View style={styles.menuIconContainer}>
                            <Mail size={20} color="#666" />
                        </View>
                        <Text style={styles.menuText}>Support</Text>
                        <Text style={styles.menuArrow}>→</Text>
                    </TouchableOpacity>
                </View>

                {/* SIGN OUT BUTTON */}
                <TouchableOpacity
                    style={styles.signOutButton}
                    onPress={handleSignOut}
                >
                    <LogOut size={20} color="#FF3B30" />
                    <Text style={styles.signOutText}>SIGN OUT</Text>
                </TouchableOpacity>

                {/* APP INFO */}
                <View style={styles.footer}>
                    <Text style={styles.footerText}>Version 1.0.0</Text>
                    <Text style={styles.footerText}>Farmer Marketplace © 2026</Text>
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

    userSection: {
        alignItems: 'center',
        marginBottom: 40,
    },

    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#96D5B4',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },

    userName: {
        fontSize: 24,
        fontWeight: '700',
        color: '#000',
        marginBottom: 4,
        textTransform: 'capitalize',
    },

    userEmail: {
        fontSize: 14,
        color: '#666',
    },

    sectionTitle: {
        fontSize: 10,
        letterSpacing: 3,
        fontWeight: '700',
        color: '#000',
        marginBottom: 12,
        marginTop: 8,
    },

    menuSection: {
        backgroundColor: '#f8f8f8',
        borderRadius: 16,
        overflow: 'hidden',
        marginBottom: 24,
    },

    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },

    menuIconContainer: {
        marginRight: 12,
    },

    menuText: {
        flex: 1,
        fontSize: 15,
        color: '#000',
    },

    menuArrow: {
        fontSize: 18,
        color: '#ccc',
    },

    signOutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f8f8f8',
        padding: 18,
        borderRadius: 12,
        gap: 8,
        marginBottom: 32,
    },

    signOutText: {
        fontSize: 14,
        letterSpacing: 2,
        fontWeight: '700',
        color: '#FF3B30',
    },

    footer: {
        alignItems: 'center',
        gap: 4,
    },

    footerText: {
        fontSize: 12,
        color: '#999',
    },
});
