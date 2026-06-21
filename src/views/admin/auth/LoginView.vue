<template>
    <div class="login-page">
        <div class="login-card">
            <div class="login-header">
                <span class="login-logo">AK</span>
                <h2>AlpharKing Admin</h2>
                <p>Sign in to manage your content</p>
            </div>
            <form @submit.prevent="handleLogin" class="login-form">
                <div class="form-group">
                    <label>Email</label>
                    <input
                        v-model="email"
                        type="email"
                        required
                        placeholder="admin@alpharkingenterprise.com"
                    />
                </div>
                <div class="form-group">
                    <label>Password</label>
                    <input
                        v-model="password"
                        type="password"
                        required
                        placeholder="Enter your password"
                    />
                </div>
                <p v-if="error" class="error">{{ error }}</p>
                <button type="submit" class="btn-primary" :disabled="loading">
                    {{ loading ? "Signing in..." : "Sign In" }}
                </button>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";

const router = useRouter();
const auth = useAuthStore();
const email = ref("");
const password = ref("");
const loading = ref(false);
const error = ref("");

async function handleLogin() {
    error.value = "";
    loading.value = true;
    try {
        await auth.login(email.value, password.value);
        router.push("/admin");
    } catch (e) {
        error.value = e.response?.data?.error || e.response?.data?.message || "Invalid credentials";
    } finally {
        loading.value = false;
    }
}
</script>

<style scoped>
.login-page {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #0d1b2a 0%, #1a2f4b 100%);
    padding: 20px;
}
.login-card {
    background: #fff;
    border-radius: 16px;
    padding: 48px 40px;
    width: 100%;
    max-width: 420px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}
.login-header {
    text-align: center;
    margin-bottom: 32px;
}
.login-logo {
    width: 56px;
    height: 56px;
    background: #007bff;
    color: #0d1b2a;
    border-radius: 14px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-family: "Nunito", sans-serif;
    font-weight: 900;
    font-size: 24px;
    margin-bottom: 16px;
}
.login-header h2 {
    font-size: 22px;
    font-weight: 800;
    margin-bottom: 6px;
}
.login-header p {
    font-size: 14px;
    color: #4a5568;
}
.login-form {
    display: flex;
    flex-direction: column;
    gap: 20px;
}
.form-group {
    display: flex;
    flex-direction: column;
    gap: 6px;
}
.form-group label {
    font-size: 13px;
    font-weight: 700;
    color: #0d1b2a;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}
.form-group input {
    border: 2px solid #e2e8f0;
    border-radius: 8px;
    padding: 12px 16px;
    font-size: 14px;
    font-family: "DM Sans", sans-serif;
    color: #0d1b2a;
    outline: none;
    transition: border-color 0.3s ease;
}
.form-group input:focus {
    border-color: #007bff;
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.12);
}
.btn-primary {
    background: #007bff;
    color: #0d1b2a;
    border: none;
    padding: 14px;
    border-radius: 8px;
    font-weight: 800;
    font-size: 15px;
    cursor: pointer;
    transition: all 0.3s ease;
}
.btn-primary:hover {
    background: #0069d9;
    transform: translateY(-1px);
}
.btn-primary:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
}
.error {
    color: #e53e3e;
    font-size: 13px;
    text-align: center;
}
</style>
