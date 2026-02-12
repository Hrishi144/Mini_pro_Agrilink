import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { supabase } from '../../services/supabase';

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        setLoading(true);
        try {
            const { error } = await supabase.auth.signInWithPassword({
                email: email.trim(),
                password,
            });

            if (error) {
                Alert.alert('Login Failed', error.message);
            } else {
                // Navigation will be handled by auth state change
                router.replace('/(tabs)');
            }
        } catch (error: any) {
            Alert.alert('Error', error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            {/* Logo Section */}
            <View style={styles.logoContainer}>
                <View style={styles.logoBg}>
                    <Text style={styles.logoText}>Agrilink</Text>
                </View>
                <View style={styles.logoUnderline} />
                <Text style={styles.subtitle}>SIGN IN TO YOUR FARM</Text>
            </View>

            {/* Form Section */}
            <View style={styles.form}>
                <View style={styles.fieldGroup}>
                    <Text style={styles.label}>EMAIL</Text>
                    <TextInput
                        style={styles.input}
                        value={email}
                        onChangeText={setEmail}
                        autoCapitalize="none"
                        keyboardType="email-address"
                        placeholderTextColor="#ccc"
                    />
                </View>

                <View style={styles.fieldGroup}>
                    <Text style={styles.label}>PASSWORD</Text>
                    <TextInput
                        style={styles.input}
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                        placeholderTextColor="#ccc"
                    />
                </View>

                {/* Login Button */}
                <TouchableOpacity
                    style={[styles.button, loading && styles.buttonDisabled]}
                    onPress={handleLogin}
                    disabled={loading}
                    activeOpacity={0.8}
                >
                    {loading ? (
                        <ActivityIndicator color="#000" />
                    ) : (
                        <Text style={styles.buttonText}>LOG IN</Text>
                    )}
                </TouchableOpacity>

                {/* Signup Link */}
                <TouchableOpacity
                    onPress={() => router.push('/auth/signup')}
                    style={styles.linkContainer}
                >
                    <Text style={styles.linkText}>
                        DON'T HAVE AN ACCOUNT?{' '}
                        <Text style={styles.linkBold}>SIGN UP</Text>
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: 40,
    },
    logoContainer: {
        alignItems: 'center',
        marginTop: 120,
        marginBottom: 80,
    },
    logoBg: {
        backgroundColor: '#000',
        paddingHorizontal: 32,
        paddingVertical: 20,
        marginBottom: 4,
    },
    logoText: {
        fontSize: 36,
        fontWeight: '700',
        color: '#96D5B4',
        letterSpacing: -0.5,
    },
    logoUnderline: {
        width: 240,
        height: 3,
        backgroundColor: '#96D5B4',
        marginBottom: 24,
    },
    subtitle: {
        fontSize: 13,
        fontWeight: '600',
        letterSpacing: 2,
        color: '#666',
    },
    form: {
        flex: 1,
    },
    fieldGroup: {
        marginBottom: 40,
    },
    label: {
        fontSize: 11,
        fontWeight: '700',
        letterSpacing: 1,
        color: '#999',
        marginBottom: 8,
    },
    input: {
        borderBottomWidth: 1,
        borderColor: '#000',
        paddingVertical: 12,
        fontSize: 16,
        color: '#000',
    },
    button: {
        backgroundColor: '#96D5B4',
        paddingVertical: 20,
        alignItems: 'center',
        marginTop: 24,
        borderWidth: 3,
        borderColor: '#000',
        boxShadow: '4px 4px 0px #000',
    },
    buttonDisabled: {
        opacity: 0.6,
    },
    buttonText: {
        color: '#000',
        fontSize: 13,
        fontWeight: '700',
        letterSpacing: 2,
    },
    linkContainer: {
        marginTop: 32,
        alignItems: 'center',
    },
    linkText: {
        fontSize: 12,
        color: '#999',
        letterSpacing: 0.5,
    },
    linkBold: {
        color: '#000',
        fontWeight: '700',
    },
});
