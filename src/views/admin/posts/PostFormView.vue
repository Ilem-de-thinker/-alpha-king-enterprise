<template>
  <div>
    <div class="page-header">
      <div><h3>{{ isEdit ? 'Edit Post' : 'New Post' }}</h3></div>
    </div>
    <div class="form-card">
      <form @submit.prevent="save">
        <div class="form-row">
          <div class="form-group">
            <label>Title</label>
            <input v-model="form.title" required />
          </div>
          <div class="form-group">
            <label>Category</label>
            <select v-model="form.category">
              <option v-for="c in categories" :key="c.id" :value="c.name">{{ c.name }}</option>
            </select>
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>Slug (auto-generated if empty)</label>
            <input v-model="form.slug" placeholder="leave empty to auto-generate" />
          </div>
          <div class="form-group">
            <label>Author</label>
            <input v-model="form.author" />
          </div>
        </div>
        <div class="form-group">
          <label>Excerpt</label>
          <textarea v-model="form.excerpt" rows="2"></textarea>
        </div>
        <div class="form-group">
          <label>Content</label>
          <TiptapEditor v-model="form.content" />
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>Featured Image URL</label>
            <input v-model="form.featuredImage" placeholder="https://..." />
          </div>
          <div class="form-group">
            <label>Read Time</label>
            <input v-model="form.readTime" placeholder="e.g. 6 min read" />
          </div>
        </div>
        <div class="form-group">
          <label>Tags (comma separated)</label>
          <input v-model="tagsStr" placeholder="Blockchain, Web3, DeFi" />
        </div>
        <p v-if="error" class="error">{{ error }}</p>
        <div class="form-actions">
          <router-link to="/admin/posts" class="btn-ghost">Cancel</router-link>
          <button type="submit" class="btn-primary" :disabled="saving">{{ saving ? 'Saving...' : 'Save Post' }}</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/api'
import TiptapEditor from '@/components/admin/TiptapEditor.vue'

const route = useRoute()
const router = useRouter()
const isEdit = computed(() => !!route.params.slug)
const postId = ref('')
const saving = ref(false)
const error = ref('')
const categories = ref([])

const form = ref({
  title: '', slug: '', excerpt: '', content: '', featuredImage: '',
  category: '', tags: [], author: '', readTime: ''
})
const tagsStr = ref('')

onMounted(async () => {
  try {
    const { data: catData } = await api.get('/categories')
    categories.value = catData.results || (Array.isArray(catData) ? catData : [])
    if (!isEdit.value && categories.value.length > 0) {
      form.value.category = categories.value[0].name
    }
  } catch (e) {
    console.error('Failed to load categories', e)
  }

  if (isEdit.value) {
    try {
      const { data } = await api.get(`/posts/${route.params.slug}`)
      Object.assign(form.value, data)
      postId.value = data.id
      tagsStr.value = (data.tags || []).map(t => t.name || t).join(', ')
    } catch (e) { error.value = e.response?.data?.message || 'Failed to load post'; router.push('/admin/posts') }
  }
})

async function save() {
  error.value = ''; saving.value = true
  form.value.tags = tagsStr.value.split(',').map(t => t.trim()).filter(Boolean)
  try {
    if (isEdit.value) {
      await api.put(`/posts/${postId.value}`, form.value)
    } else {
      await api.post('/posts', form.value)
    }
    router.push('/admin/posts')
  } catch (e) {
    error.value = e.response?.data?.message || 'Failed to save'
  } finally { saving.value = false }
}
</script>

<style scoped>
.page-header h3 { font-size: 22px; font-weight: 800; margin-bottom: 24px; }
.form-card { background: #fff; border-radius: 12px; border: 1px solid #e2e8f0; padding: 32px; }
.form-group { display: flex; flex-direction: column; gap: 6px; margin-bottom: 20px; }
.form-group label { font-size: 13px; font-weight: 700; color: #0d1b2a; text-transform: uppercase; letter-spacing: 0.5px; }
.form-group input, .form-group select, .form-group textarea {
  border: 2px solid #e2e8f0; border-radius: 8px; padding: 10px 14px; font-size: 14px;
  font-family: 'DM Sans', sans-serif; color: #0d1b2a; outline: none; transition: border-color 0.3s ease;
}
.form-group input:focus, .form-group select:focus, .form-group textarea:focus { border-color: #007bff; box-shadow: 0 0 0 3px rgba(0,123,255,0.12); }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
.form-actions { display: flex; gap: 12px; justify-content: flex-end; margin-top: 24px; }
.btn-primary { background: #007bff; color: #0d1b2a; padding: 12px 24px; border-radius: 8px; font-weight: 700; font-size: 14px; border: none; cursor: pointer; }
.btn-primary:hover { background: #0069d9; }
.btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
.btn-ghost { display: inline-flex; align-items: center; padding: 12px 24px; border-radius: 8px; font-weight: 700; font-size: 14px; border: 2px solid #e2e8f0; color: #4a5568; background: #fff; transition: all 0.3s ease; }
.btn-ghost:hover { border-color: #007bff; color: #007bff; }
.error { color: #e53e3e; font-size: 13px; }
</style>
