<template>
  <div>
    <div class="page-header">
      <div><h3>Newsletter Subscribers</h3><p>Email subscribers list</p></div>
    </div>
    <div class="table-card">
      <table>
        <thead><tr><th>Email</th><th>Status</th><th>Subscribed Since</th><th>Actions</th></tr></thead>
        <tbody>
          <tr v-for="s in items" :key="s.id">
            <td><strong>{{ s.email }}</strong></td>
            <td><span :class="s.subscribed ? 'badge-green' : 'badge-yellow'">{{ s.subscribed ? 'Active' : 'Unsubscribed' }}</span></td>
            <td>{{ s.createdAt ? new Date(s.createdAt).toLocaleDateString() : '-' }}</td>
            <td class="actions">
              <button v-if="s.subscribed" class="btn-sm danger" @click="unsubscribe(s)" title="Unsubscribe"><i class="fa fa-remove"></i></button>
            </td>
          </tr>
          <tr v-if="!items.length"><td colspan="4" class="empty">No subscribers yet</td></tr>
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
async function load() { try { const { data } = await api.get('/newsletter'); items.value = Array.isArray(data) ? data : [] } catch { items.value = [] } }

async function unsubscribe(s) { if (!confirm('Unsubscribe this email?')) return; await api.delete(`/newsletter/${s.email}`); s.subscribed = false }
</script>

<style scoped>
.page-header h3 { font-size: 22px; font-weight: 800; margin-bottom: 24px; }
.table-card { background: #fff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; }
table { width: 100%; border-collapse: collapse; }
th, td { text-align: left; padding: 12px 16px; font-size: 14px; }
th { background: #f8fafc; font-weight: 700; font-size: 12px; text-transform: uppercase; }
td { border-top: 1px solid #e2e8f0; }
tr:hover td { background: #f8fafc; }
.badge-green { background: #d4edda; color: #155724; font-size: 12px; font-weight: 700; padding: 3px 10px; border-radius: 20px; }
.badge-yellow { background: #fff3cd; color: #856404; font-size: 12px; font-weight: 700; padding: 3px 10px; border-radius: 20px; }
.actions { display: flex; gap: 8px; }
.btn-sm { width: 32px; height: 32px; border-radius: 6px; display: inline-flex; align-items: center; justify-content: center; font-size: 13px; border: 1px solid #e2e8f0; background: #fff; color: #4a5568; cursor: pointer; }
.btn-sm.danger:hover { border-color: #e53e3e; color: #e53e3e; }
.empty { text-align: center; color: #aaa; padding: 40px; }
</style>
