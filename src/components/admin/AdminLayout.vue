<template>
  <div class="admin-layout">
    <div v-if="mobileSidebar" class="sidebar-backdrop" @click="mobileSidebar = false"></div>
    <aside class="admin-sidebar" :class="{ collapsed: sidebarCollapsed, mobileOpen: mobileSidebar }">
      <div class="sidebar-header">
        <router-link to="/admin" class="sidebar-logo">
          <span class="logo-icon">AK</span>
          <span class="logo-text" v-show="!sidebarCollapsed">AlpharKing</span>
        </router-link>
      </div>
      <nav class="sidebar-nav">
        <router-link to="/admin" class="nav-item" :class="{ active: route.path === '/admin' }" @click="mobileSidebar = false">
          <i class="fa fa-dashboard"></i>
          <span v-show="!sidebarCollapsed">Dashboard</span>
        </router-link>
        <div v-for="group in navGroups" :key="group.title" class="nav-group">
          <div v-show="!sidebarCollapsed" class="nav-group-title">{{ group.title }}</div>
          <router-link v-for="item in group.items" :key="item.path" :to="item.path" class="nav-item" :class="{ active: isActive(item.path) }" @click="mobileSidebar = false">
            <i :class="item.icon"></i>
            <span v-show="!sidebarCollapsed">{{ item.label }}</span>
          </router-link>
        </div>
      </nav>
      <div class="sidebar-footer">
        <button class="nav-item desktop-only" @click="toggleSidebar">
          <i :class="sidebarCollapsed ? 'fa fa-angle-right' : 'fa fa-angle-left'"></i>
          <span v-show="!sidebarCollapsed">Collapse</span>
        </button>
        <router-link to="/admin/login" class="nav-item" @click.prevent="handleLogout">
          <i class="fa fa-sign-out"></i>
          <span v-show="!sidebarCollapsed">Logout</span>
        </router-link>
      </div>
    </aside>
    <main class="admin-main">
      <header class="admin-topbar">
        <button class="mobile-menu-btn" @click="mobileSidebar = !mobileSidebar">
          <i :class="mobileSidebar ? 'fa fa-times' : 'fa fa-bars'"></i>
        </button>
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
const mobileSidebar = ref(false)

const navGroups = [
  {
    title: 'Content',
    items: [
      { path: '/admin/posts', label: 'Posts', icon: 'fa fa-file-text' },
      { path: '/admin/categories', label: 'Categories', icon: 'fa fa-tags' },
      { path: '/admin/tags', label: 'Tags', icon: 'fa fa-tag' }
    ]
  },
  {
    title: 'Landing Page',
    items: [
      { path: '/admin/hero', label: 'Hero Section', icon: 'fa fa-picture-o' },
      { path: '/admin/hero-stats', label: 'Hero Stats', icon: 'fa fa-bar-chart' },
      { path: '/admin/trust-bar', label: 'Trust Bar', icon: 'fa fa-shield' },
      { path: '/admin/counters', label: 'Counters', icon: 'fa fa-sort-numeric-asc' },
      { path: '/admin/why-us', label: 'Why Us', icon: 'fa fa-check-circle' },
      { path: '/admin/cta-banner', label: 'CTA Banner', icon: 'fa fa-bullhorn' },
      { path: '/admin/services', label: 'Services', icon: 'fa fa-cogs' },
      { path: '/admin/team', label: 'Team', icon: 'fa fa-users' },
      { path: '/admin/projects', label: 'Projects', icon: 'fa fa-briefcase' },
      { path: '/admin/faq', label: 'FAQ', icon: 'fa fa-question-circle' },
      { path: '/admin/newsletter-section', label: 'Newsletter Section', icon: 'fa fa-newspaper-o' }
    ]
  },
  {
    title: 'Company',
    items: [
      { path: '/admin/about', label: 'About Page', icon: 'fa fa-info-circle' },
      { path: '/admin/mvv', label: 'MVV Section', icon: 'fa fa-eye' },
      { path: '/admin/mvv-items', label: 'MVV Items', icon: 'fa fa-heart' },
      { path: '/admin/process', label: 'Process Steps', icon: 'fa fa-sitemap' }
    ]
  },
  {
    title: 'Settings',
    items: [
      { path: '/admin/contacts', label: 'Contacts', icon: 'fa fa-envelope' },
      { path: '/admin/footer', label: 'Footer', icon: 'fa fa-credit-card' },
      { path: '/admin/nav', label: 'Navigation', icon: 'fa fa-bars' },
      { path: '/admin/company', label: 'Company Info', icon: 'fa fa-building' },
      { path: '/admin/social', label: 'Social Links', icon: 'fa fa-share-alt' }
    ]
  }
]

const allNavItems = [{ path: '/admin', label: 'Dashboard', icon: 'fa fa-dashboard' }]
navGroups.forEach(g => g.items.forEach(i => allNavItems.push(i)))

const currentPageTitle = computed(() => {
  const item = allNavItems.find(n => route.path === n.path)
  return item?.label || 'Admin'
})

function isActive(path) {
  if (path === '/admin') return route.path === '/admin'
  return route.path.startsWith(path + '/')
}

function toggleSidebar() {
  sidebarCollapsed.value = !sidebarCollapsed.value
}

async function handleLogout() {
  await auth.logout()
  window.location.href = '/admin/login'
}
</script>

<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: 'DM Sans', sans-serif; background: #f4f7fb; color: #4a5568; }
h1,h2,h3,h4,h5,h6 { font-family: 'Nunito', sans-serif; color: #0d1b2a; }
a { text-decoration: none; }
@media (max-width: 768px) {
  .form-row { grid-template-columns: 1fr !important; }
  .table-card { overflow-x: auto; }
  table { font-size: 13px; }
  th, td { padding: 10px 12px !important; }
  .stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
  .modal-card { margin: 16px; max-width: none !important; }
  .links-grid { flex-direction: column; }
}
</style>

<style scoped>
.admin-layout { display: flex; min-height: 100vh; }
.sidebar-backdrop { display: none; }
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
.sidebar-nav { flex: 1; padding: 8px 0; }
.nav-group { margin-bottom: 4px; }
.nav-group-title {
  padding: 8px 16px 4px; font-size: 10px; font-weight: 800; color: rgba(255,255,255,0.3);
  text-transform: uppercase; letter-spacing: 1.5px;
}
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
.mobile-menu-btn { display: none; }

@media (max-width: 768px) {
  .sidebar-backdrop {
    display: block; position: fixed; inset: 0; background: rgba(0,0,0,0.5);
    z-index: 99;
  }
  .admin-sidebar {
    width: 260px; transform: translateX(-100%); z-index: 100;
  }
  .admin-sidebar.mobileOpen { transform: translateX(0); }
  .admin-sidebar.collapsed { width: 260px; }
  .admin-main { margin-left: 0; }
  .admin-sidebar.collapsed + .admin-main { margin-left: 0; }
  .desktop-only { display: none; }
  .mobile-menu-btn {
    display: flex; align-items: center; justify-content: center;
    width: 36px; height: 36px; border: none; background: none; cursor: pointer;
    font-size: 18px; color: #0d1b2a; margin-right: 12px;
  }
  .admin-topbar { padding: 12px 16px; }
  .admin-topbar h2 { font-size: 16px; }
  .admin-content { padding: 16px; }
  .user-badge { font-size: 12px; max-width: 120px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
}
</style>
