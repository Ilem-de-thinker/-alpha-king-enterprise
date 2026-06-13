<template>
  <div>
    <div class="page-header">
      <div><h3>Posts</h3><p>Manage blog posts and insights</p></div>
      <router-link to="/admin/posts/create" class="btn-primary"><i class="fa fa-plus"></i> New Post</router-link>
    </div>
    <div class="table-card">
      <table>
        <thead><tr><th>Title</th><th>Category</th><th>Author</th><th>Published</th><th>Actions</th></tr></thead>
        <tbody>
          <tr v-for="p in posts" :key="p.id">
            <td><strong>{{ p.title }}</strong></td>
            <td><span class="badge">{{ p.category }}</span></td>
            <td>{{ p.author }}</td>
            <td>{{ p.publishedAt ? new Date(p.publishedAt).toLocaleDateString() : '-' }}</td>
            <td class="actions">
              <router-link :to="`/admin/posts/${p.id}/edit`" class="btn-sm" title="Edit"><i class="fa fa-pencil"></i></router-link>
              <button class="btn-sm danger" @click="remove(p.id)" title="Delete"><i class="fa fa-trash"></i></button>
            </td>
          </tr>
          <tr v-if="!posts.length"><td colspan="5" class="empty">No posts yet. <router-link to="/admin/posts/create">Create one</router-link></td></tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/api'

const posts = ref([])

onMounted(async () => {
  try {
    const { data } = await api.get('/posts')
    posts.value = data.results || (Array.isArray(data) ? data : data.posts || data.data || [])
  } catch (e) { posts.value = [] }
})

async function remove(id) {
  if (!confirm('Delete this post?')) return
  await api.delete(`/posts/${id}`)
  posts.value = posts.value.filter(p => p.id !== id)
}
</script>

<style scoped>
.page-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px; }
.page-header h3 { font-size: 22px; font-weight: 800; margin-bottom: 4px; }
.page-header p { font-size: 14px; color: #4a5568; }
.btn-primary { display: inline-flex; align-items: center; gap: 6px; background: #007bff; color: #0d1b2a; padding: 10px 20px; border-radius: 8px; font-weight: 700; font-size: 14px; border: none; cursor: pointer; transition: all 0.3s ease; }
.btn-primary:hover { background: #0069d9; }
.table-card { background: #fff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; }
table { width: 100%; border-collapse: collapse; }
th, td { text-align: left; padding: 14px 20px; font-size: 14px; }
th { background: #f8fafc; font-weight: 700; color: #0d1b2a; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; }
td { border-top: 1px solid #e2e8f0; }
tr:hover td { background: #f8fafc; }
.badge { background: rgba(0,123,255,0.1); color: #007bff; font-size: 12px; font-weight: 700; padding: 3px 10px; border-radius: 20px; }
.actions { display: flex; gap: 8px; }
.btn-sm { width: 32px; height: 32px; border-radius: 6px; display: inline-flex; align-items: center; justify-content: center; font-size: 13px; border: 1px solid #e2e8f0; background: #fff; color: #4a5568; cursor: pointer; transition: all 0.2s ease; }
.btn-sm:hover { border-color: #007bff; color: #007bff; }
.btn-sm.danger:hover { border-color: #e53e3e; color: #e53e3e; }
.empty { text-align: center; color: #aaa; padding: 40px; }
.empty a { color: #007bff; }
</style>
