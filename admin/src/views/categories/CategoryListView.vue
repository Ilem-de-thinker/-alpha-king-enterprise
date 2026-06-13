<template>
  <div>
    <div class="page-header">
      <div><h3>Categories</h3><p>Manage post categories</p></div>
      <button class="btn-primary" @click="showForm = true; editItem = null"><i class="fa fa-plus"></i> Add</button>
    </div>
    <div class="table-card">
      <table>
        <thead><tr><th>Name</th><th>Slug</th><th>Posts</th><th>Actions</th></tr></thead>
        <tbody>
          <tr v-for="c in items" :key="c.id">
            <td><strong>{{ c.name }}</strong></td>
            <td>{{ c.slug }}</td>
            <td>{{ c.postCount ?? '-' }}</td>
            <td class="actions">
              <button class="btn-sm" @click="edit(c)" title="Edit"><i class="fa fa-pencil"></i></button>
              <button class="btn-sm danger" @click="remove(c.id)" title="Delete"><i class="fa fa-trash"></i></button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-if="showForm" class="modal-overlay" @click.self="showForm = false">
      <div class="modal-card">
        <h4>{{ editItem ? 'Edit' : 'New' }} Category</h4>
        <div class="form-group"><label>Name</label><input v-model="form.name" @input="form.slug = form.name.toLowerCase().replace(/\\s+/g,'-')" /></div>
        <div class="form-group"><label>Slug</label><input v-model="form.slug" /></div>
        <p v-if="formError" class="error">{{ formError }}</p>
        <div class="form-actions">
          <button class="btn-ghost" @click="showForm = false">Cancel</button>
          <button class="btn-primary" @click="save" :disabled="saving">{{ saving ? 'Saving...' : 'Save' }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/api'

const items = ref([])
const showForm = ref(false)
const editItem = ref(null)
const form = ref({ name: '', slug: '' })
const formError = ref('')
const saving = ref(false)

onMounted(load)
async function load() { try { const { data } = await api.get('/categories'); items.value = Array.isArray(data) ? data : [] } catch { items.value = [] } }

function edit(c) { editItem.value = c; form.value = { name: c.name, slug: c.slug }; showForm.value = true }
function reset() { editItem.value = null; form.value = { name: '', slug: '' }; formError.value = '' }

async function save() {
  formError.value = ''; saving.value = true
  try {
    if (editItem.value) await api.put(`/categories/${editItem.value.id}`, form.value)
    else await api.post('/categories', form.value)
    showForm.value = false; reset(); await load()
  } catch (e) { formError.value = e.response?.data?.message || 'Error saving' }
  finally { saving.value = false }
}
async function remove(id) { if (!confirm('Delete?')) return; await api.delete(`/categories/${id}`); await load() }
</script>

<style scoped>
.page-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px; }
.page-header h3 { font-size: 22px; font-weight: 800; margin-bottom: 4px; }
.page-header p { font-size: 14px; color: #4a5568; }
.btn-primary { display: inline-flex; align-items: center; gap: 6px; background: #007bff; color: #0d1b2a; padding: 10px 20px; border-radius: 8px; font-weight: 700; font-size: 14px; border: none; cursor: pointer; }
.btn-primary:hover { background: #0069d9; }
.btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
.btn-ghost { padding: 10px 20px; border-radius: 8px; font-weight: 700; font-size: 14px; border: 2px solid #e2e8f0; color: #4a5568; background: #fff; cursor: pointer; }
.btn-ghost:hover { border-color: #007bff; color: #007bff; }
.table-card { background: #fff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; }
table { width: 100%; border-collapse: collapse; }
th, td { text-align: left; padding: 12px 16px; font-size: 14px; }
th { background: #f8fafc; font-weight: 700; color: #0d1b2a; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; }
td { border-top: 1px solid #e2e8f0; }
tr:hover td { background: #f8fafc; }
.actions { display: flex; gap: 8px; }
.btn-sm { width: 32px; height: 32px; border-radius: 6px; display: inline-flex; align-items: center; justify-content: center; font-size: 13px; border: 1px solid #e2e8f0; background: #fff; color: #4a5568; cursor: pointer; }
.btn-sm.danger:hover { border-color: #e53e3e; color: #e53e3e; }
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 200; }
.modal-card { background: #fff; border-radius: 12px; padding: 32px; width: 100%; max-width: 440px; }
.modal-card h4 { font-size: 18px; font-weight: 800; margin-bottom: 20px; }
.form-group { display: flex; flex-direction: column; gap: 6px; margin-bottom: 16px; }
.form-group label { font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; }
.form-group input { border: 2px solid #e2e8f0; border-radius: 8px; padding: 10px 14px; font-size: 14px; font-family: 'DM Sans', sans-serif; outline: none; }
.form-group input:focus { border-color: #007bff; }
.form-actions { display: flex; gap: 12px; justify-content: flex-end; margin-top: 20px; }
.error { color: #e53e3e; font-size: 13px; }
</style>
