<template>
  <div>
    <div class="page-header">
      <div><h3>Contact Submissions</h3><p>Messages from the contact form</p></div>
    </div>
    <div class="table-card">
      <table>
        <thead><tr><th>Name</th><th>Email</th><th>Service</th><th>Message</th><th>Status</th><th>Date</th><th>Actions</th></tr></thead>
        <tbody>
          <tr v-for="c in items" :key="c.id" :class="{ unread: !c.read }">
            <td><strong>{{ c.name }}</strong></td>
            <td>{{ c.email }}</td>
            <td><span class="badge">{{ c.service }}</span></td>
            <td class="content-cell">{{ c.message }}</td>
            <td><span :class="c.read ? 'badge-green' : 'badge-yellow'">{{ c.read ? 'Read' : 'New' }}</span></td>
            <td>{{ c.createdAt ? new Date(c.createdAt).toLocaleDateString() : '-' }}</td>
            <td class="actions">
              <button v-if="!c.read" class="btn-sm success" @click="markRead(c)" title="Mark read"><i class="fa fa-check"></i></button>
              <button class="btn-sm danger" @click="remove(c.id)" title="Delete"><i class="fa fa-trash"></i></button>
            </td>
          </tr>
          <tr v-if="!items.length"><td colspan="7" class="empty">No submissions yet</td></tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/api'

const items = ref([])

onMounted(load)
async function load() { try { const { data } = await api.get('/contact'); items.value = Array.isArray(data) ? data : [] } catch { items.value = [] } }

async function markRead(c) { await api.put(`/contact/${c.id}`, { read: true }); c.read = true }
async function remove(id) { if (!confirm('Delete?')) return; await api.delete(`/contact/${id}`); items.value = items.value.filter(c => c.id !== id) }
</script>

<style scoped>
.page-header h3 { font-size: 22px; font-weight: 800; margin-bottom: 4px; }
.page-header p { font-size: 14px; color: #4a5568; margin-bottom: 24px; }
.page-header :deep(p) { margin-bottom: 24px; }
.table-card { background: #fff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; }
table { width: 100%; border-collapse: collapse; }
th, td { text-align: left; padding: 12px 16px; font-size: 14px; }
th { background: #f8fafc; font-weight: 700; color: #0d1b2a; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; }
td { border-top: 1px solid #e2e8f0; }
tr.unread td { background: #f0f7ff; }
tr:hover td { background: #f8fafc; }
.content-cell { max-width: 250px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.badge { background: rgba(0,123,255,0.1); color: #007bff; font-size: 12px; font-weight: 700; padding: 3px 10px; border-radius: 20px; }
.badge-green { background: #d4edda; color: #155724; font-size: 12px; font-weight: 700; padding: 3px 10px; border-radius: 20px; }
.badge-yellow { background: #fff3cd; color: #856404; font-size: 12px; font-weight: 700; padding: 3px 10px; border-radius: 20px; }
.actions { display: flex; gap: 8px; }
.btn-sm { width: 32px; height: 32px; border-radius: 6px; display: inline-flex; align-items: center; justify-content: center; font-size: 13px; border: 1px solid #e2e8f0; background: #fff; color: #4a5568; cursor: pointer; }
.btn-sm.success:hover { border-color: #28a745; color: #28a745; }
.btn-sm.danger:hover { border-color: #e53e3e; color: #e53e3e; }
.empty { text-align: center; color: #aaa; padding: 40px; }
</style>
