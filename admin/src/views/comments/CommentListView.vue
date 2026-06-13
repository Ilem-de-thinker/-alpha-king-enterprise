<template>
  <div>
    <div class="page-header"><h3>Comments</h3><p>Moderate reader comments</p></div>
    <div class="table-card">
      <table>
        <thead><tr><th>Name</th><th>Email</th><th>Content</th><th>Post</th><th>Status</th><th>Actions</th></tr></thead>
        <tbody>
          <tr v-for="c in comments" :key="c.id">
            <td><strong>{{ c.name }}</strong></td>
            <td>{{ c.email }}</td>
            <td class="content-cell">{{ c.content }}</td>
            <td>{{ c.postId?.slice(0,8) }}...</td>
            <td><span :class="c.approved ? 'badge-green' : 'badge-yellow'">{{ c.approved ? 'Approved' : 'Pending' }}</span></td>
            <td class="actions">
              <button v-if="!c.approved" class="btn-sm success" @click="approve(c)" title="Approve"><i class="fa fa-check"></i></button>
              <button class="btn-sm danger" @click="remove(c.id)" title="Delete"><i class="fa fa-trash"></i></button>
            </td>
          </tr>
          <tr v-if="!comments.length"><td colspan="6" class="empty">No comments yet</td></tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/api'

const comments = ref([])

onMounted(async () => {
  try { const { data } = await api.get('/posts/default/comments'); comments.value = Array.isArray(data) ? data : [] }
  catch { comments.value = [] }
})

async function approve(c) {
  await api.put(`/comments/${c.id}`, { approved: true })
  c.approved = true
}

async function remove(id) {
  if (!confirm('Delete this comment?')) return
  await api.delete(`/comments/${id}`)
  comments.value = comments.value.filter(c => c.id !== id)
}
</script>

<style scoped>
.page-header h3 { font-size: 22px; font-weight: 800; margin-bottom: 4px; }
.page-header p { font-size: 14px; color: #4a5568; margin-bottom: 24px; }
.table-card { background: #fff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; }
table { width: 100%; border-collapse: collapse; }
th, td { text-align: left; padding: 12px 16px; font-size: 14px; }
th { background: #f8fafc; font-weight: 700; color: #0d1b2a; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; }
td { border-top: 1px solid #e2e8f0; }
tr:hover td { background: #f8fafc; }
.content-cell { max-width: 300px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.badge-green { background: #d4edda; color: #155724; font-size: 12px; font-weight: 700; padding: 3px 10px; border-radius: 20px; }
.badge-yellow { background: #fff3cd; color: #856404; font-size: 12px; font-weight: 700; padding: 3px 10px; border-radius: 20px; }
.actions { display: flex; gap: 8px; }
.btn-sm { width: 32px; height: 32px; border-radius: 6px; display: inline-flex; align-items: center; justify-content: center; font-size: 13px; border: 1px solid #e2e8f0; background: #fff; color: #4a5568; cursor: pointer; }
.btn-sm.success:hover { border-color: #28a745; color: #28a745; }
.btn-sm.danger:hover { border-color: #e53e3e; color: #e53e3e; }
.empty { text-align: center; color: #aaa; padding: 40px; }
</style>
