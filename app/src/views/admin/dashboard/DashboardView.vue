<template>
  <div>
    <div class="stats-grid">
      <div class="stat-card" v-for="s in stats" :key="s.label">
        <div class="stat-icon" :style="{ background: s.bg }"><i :class="s.icon"></i></div>
        <div class="stat-info">
          <strong>{{ s.count }}</strong>
          <span>{{ s.label }}</span>
        </div>
      </div>
    </div>
    <div class="quick-links">
      <h3>Quick Actions</h3>
      <div class="links-grid">
        <router-link to="/admin/posts/create" class="quick-link"><i class="fa fa-plus"></i> New Post</router-link>
        <router-link to="/admin/contacts" class="quick-link"><i class="fa fa-envelope"></i> View Messages</router-link>
        <router-link to="/admin/comments" class="quick-link"><i class="fa fa-comments"></i> Moderate Comments</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/api'

const stats = ref([
  { label: 'Posts', icon: 'fa fa-file-text', count: '...', bg: '#007bff' },
  { label: 'Comments', icon: 'fa fa-comments', count: '...', bg: '#6f42c1' },
  { label: 'Categories', icon: 'fa fa-tags', count: '...', bg: '#28a745' },
  { label: 'Services', icon: 'fa fa-cogs', count: '...', bg: '#fd7e14' },
  { label: 'Team Members', icon: 'fa fa-users', count: '...', bg: '#e83e8c' },
  { label: 'Projects', icon: 'fa fa-briefcase', count: '...', bg: '#20c997' },
  { label: 'Contacts', icon: 'fa fa-envelope', count: '...', bg: '#dc3545' },
  { label: 'Subscribers', icon: 'fa fa-paper-plane', count: '...', bg: '#17a2b8' }
])

onMounted(async () => {
  try {
    const [posts, categories, services, team, projects, contacts] = await Promise.all([
      api.get('/posts?limit=1'),
      api.get('/categories'), api.get('/services'),
      api.get('/team'), api.get('/projects'),
      api.get('/contact')
    ])
    stats.value[0].count = posts.data.count || posts.data.total || posts.data.length || 0
    stats.value[1].count = 0
    stats.value[2].count = categories.data.count || categories.data.total || 0
    stats.value[3].count = services.data.count || services.data.total || 0
    stats.value[4].count = team.data.count || team.data.total || 0
    stats.value[5].count = projects.data.count || projects.data.total || 0
    stats.value[6].count = contacts.data.count || contacts.data.total || 0
    stats.value[7].count = 0
  } catch {}
})
</script>

<style scoped>
.stats-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 20px; margin-bottom: 40px; }
.stat-card { background: #fff; border-radius: 12px; padding: 24px; display: flex; align-items: center; gap: 20px; border: 1px solid #e2e8f0; transition: all 0.3s ease; }
.stat-card:hover { transform: translateY(-2px); box-shadow: 0 8px 30px rgba(13,27,42,0.1); }
.stat-icon { width: 52px; height: 52px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 22px; color: #fff; flex-shrink: 0; }
.stat-info strong { display: block; font-size: 28px; font-family: 'Nunito', sans-serif; font-weight: 900; color: #0d1b2a; }
.stat-info span { font-size: 13px; color: #4a5568; }
.quick-links h3 { font-size: 18px; font-weight: 800; margin-bottom: 16px; }
.links-grid { display: flex; gap: 12px; flex-wrap: wrap; }
.quick-link { display: inline-flex; align-items: center; gap: 8px; background: #fff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px 20px; font-size: 14px; font-weight: 600; color: #0d1b2a; transition: all 0.3s ease; }
.quick-link:hover { border-color: #007bff; color: #007bff; }
</style>
