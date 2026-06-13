<template>
  <div class="admin-layout">
    <aside class="admin-sidebar" :class="{ collapsed: sidebarCollapsed }">
      <div class="sidebar-header">
        <router-link to="/" class="sidebar-logo">
          <span class="logo-icon">AK</span>
          <span class="logo-text" v-show="!sidebarCollapsed">AlpharKing</span>
        </router-link>
      </div>
      <nav class="sidebar-nav">
        <router-link v-for="item in navItems" :key="item.path" :to="item.path" class="nav-item" :class="{ active: isActive(item.path) }">
          <i :class="item.icon"></i>
          <span v-show="!sidebarCollapsed">{{ item.label }}</span>
        </router-link>
      </nav>
      <div class="sidebar-footer">
        <button class="nav-item" @click="toggleSidebar">
          <i :class="sidebarCollapsed ? 'fa fa-angle-right' : 'fa fa-angle-left'"></i>
          <span v-show="!sidebarCollapsed">Collapse</span>
        </button>
        <router-link to="/login" class="nav-item" @click.prevent="handleLogout">
          <i class="fa fa-sign-out"></i>
          <span v-show="!sidebarCollapsed">Logout</span>
        </router-link>
      </div>
    </aside>
    <main class="admin-main">
      <header class="admin-topbar">
        <h2>{{ currentPageTitle }}</h2>
        <div class="topbar-right">
          <span class="user-badge">{{ auth.user?.email }}</span>
        </div>
      </header>
      <div class="admin-content">
        <router-view />
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const auth = useAuthStore()
const sidebarCollapsed = ref(false)

const navItems = [
  { path: '/', label: 'Dashboard', icon: 'fa fa-dashboard' },
  { path: '/posts', label: 'Posts', icon: 'fa fa-file-text' },
  { path: '/comments', label: 'Comments', icon: 'fa fa-comments' },
  { path: '/categories', label: 'Categories', icon: 'fa fa-tags' },
  { path: '/tags', label: 'Tags', icon: 'fa fa-tag' },
  { path: '/services', label: 'Services', icon: 'fa fa-cogs' },
  { path: '/team', label: 'Team', icon: 'fa fa-users' },
  { path: '/projects', label: 'Projects', icon: 'fa fa-briefcase' },
  { path: '/faq', label: 'FAQ', icon: 'fa fa-question-circle' },
  { path: '/contacts', label: 'Contacts', icon: 'fa fa-envelope' },
  { path: '/newsletter', label: 'Newsletter', icon: 'fa fa-paper-plane' },
  { path: '/hero', label: 'Hero Section', icon: 'fa fa-picture-o' },
  { path: '/hero-stats', label: 'Hero Stats', icon: 'fa fa-bar-chart' },
  { path: '/trust-bar', label: 'Trust Bar', icon: 'fa fa-shield' },
  { path: '/counters', label: 'Counters', icon: 'fa fa-sort-numeric-asc' },
  { path: '/why-us', label: 'Why Us', icon: 'fa fa-check-circle' },
  { path: '/why-us-checklist', label: 'Why Us Checklist', icon: 'fa fa-list' },
  { path: '/cta-banner', label: 'CTA Banner', icon: 'fa fa-bullhorn' },
  { path: '/about', label: 'About Page', icon: 'fa fa-info-circle' },
  { path: '/about-features', label: 'About Features', icon: 'fa fa-check-square-o' },
  { path: '/mvv', label: 'MVV Section', icon: 'fa fa-eye' },
  { path: '/mvv-items', label: 'MVV Items', icon: 'fa fa-heart' },
  { path: '/process', label: 'Process Steps', icon: 'fa fa-sitemap' },
  { path: '/newsletter-section', label: 'Newsletter Section', icon: 'fa fa-newspaper-o' },
  { path: '/footer', label: 'Footer', icon: 'fa fa-credit-card' },
  { path: '/nav', label: 'Navigation', icon: 'fa fa-bars' },
  { path: '/company', label: 'Company Info', icon: 'fa fa-building' },
  { path: '/social', label: 'Social Links', icon: 'fa fa-share-alt' }
]

const currentPageTitle = computed(() => {
  const item = navItems.find(n => route.path === n.path)
  return item?.label || 'Admin'
})

function isActive(path) {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}

function toggleSidebar() {
  sidebarCollapsed.value = !sidebarCollapsed.value
}

async function handleLogout() {
  await auth.logout()
}
</script>

<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: 'DM Sans', sans-serif; background: #f4f7fb; color: #4a5568; }
h1,h2,h3,h4,h5,h6 { font-family: 'Nunito', sans-serif; color: #0d1b2a; }
a { text-decoration: none; }
</style>

<style scoped>
.admin-layout { display: flex; min-height: 100vh; }
.admin-sidebar {
  width: 250px; background: #0d1b2a; display: flex; flex-direction: column;
  transition: width 0.3s ease; position: fixed; top: 0; left: 0; bottom: 0; z-index: 100;
  overflow-y: auto;
}
.admin-sidebar.collapsed { width: 60px; }
.sidebar-header {
  padding: 16px; border-bottom: 1px solid rgba(255,255,255,0.08);
  display: flex; align-items: center; justify-content: center;
}
.sidebar-logo { display: flex; align-items: center; gap: 10px; }
.logo-icon {
  width: 36px; height: 36px; background: #007bff; color: #0d1b2a;
  border-radius: 8px; display: flex; align-items: center; justify-content: center;
  font-family: 'Nunito', sans-serif; font-weight: 900; font-size: 18px; flex-shrink: 0;
}
.logo-text { color: #fff; font-family: 'Nunito', sans-serif; font-weight: 700; font-size: 16px; }
.sidebar-nav { flex: 1; padding: 12px 0; }
.nav-item {
  display: flex; align-items: center; gap: 12px; padding: 10px 16px;
  color: rgba(255,255,255,0.6); font-size: 14px; transition: all 0.2s ease;
  border: none; background: none; cursor: pointer; width: 100%; text-align: left;
  white-space: nowrap;
}
.nav-item:hover { color: #fff; background: rgba(0,123,255,0.12); }
.nav-item.active, .nav-item.router-link-active { color: #007bff; background: rgba(0,123,255,0.15); }
.nav-item i { width: 20px; text-align: center; font-size: 15px; flex-shrink: 0; }
.sidebar-footer { border-top: 1px solid rgba(255,255,255,0.08); padding: 8px 0; }
.admin-main { flex: 1; margin-left: 250px; transition: margin-left 0.3s ease; }
.admin-sidebar.collapsed + .admin-main { margin-left: 60px; }
.admin-topbar {
  background: #fff; padding: 16px 30px; display: flex; align-items: center;
  justify-content: space-between; border-bottom: 1px solid #e2e8f0;
  position: sticky; top: 0; z-index: 50;
}
.admin-topbar h2 { font-size: 20px; font-weight: 800; margin: 0; }
.topbar-right { display: flex; align-items: center; gap: 12px; }
.user-badge { font-size: 13px; color: #4a5568; }
.admin-content { padding: 30px; }
@media (max-width: 768px) {
  .admin-sidebar { width: 60px; }
  .admin-main { margin-left: 60px; }
  .admin-sidebar .logo-text, .admin-sidebar .nav-item span { display: none; }
}
</style>
