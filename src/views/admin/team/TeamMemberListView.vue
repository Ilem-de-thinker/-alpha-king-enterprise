<template>
  <div>
    <div class="page-header">
      <div><h3>Team Members</h3><p>Manage the team</p></div>
      <button class="btn-primary" @click="openAdd"><i class="fa fa-plus"></i> Add</button>
    </div>
    <div class="table-card">
      <table>
        <thead><tr><th>Order</th><th>Name</th><th>Role</th><th>Actions</th></tr></thead>
        <tbody>
          <tr v-for="m in items" :key="m.id">
            <td>{{ m.order }}</td>
            <td><strong>{{ m.name }}</strong></td>
            <td>{{ m.role }}</td>
            <td class="actions">
              <button class="btn-sm" @click="edit(m)"><i class="fa fa-pencil"></i></button>
              <button class="btn-sm danger" @click="remove(m.id)"><i class="fa fa-trash"></i></button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-if="showForm" class="modal-overlay" @click.self="showForm = false">
      <div class="modal-card">
        <h4>{{ editItem ? 'Edit' : 'New' }} Member</h4>
        <div class="form-group"><label>Name *</label><input v-model="form.name" required /></div>
        <div class="form-group"><label>Role *</label><input v-model="form.role" required /></div>
        <div class="form-group"><label>Image</label><ImageUpload v-model="form.image" @file="imageFile = $event" /></div>
        <div class="form-group"><label>LinkedIn URL</label><input v-model="form.linkedin" placeholder="https://..." /></div>
        <div class="form-group"><label>Twitter URL</label><input v-model="form.twitter" placeholder="https://..." /></div>
        <div class="form-group"><label>Order</label><input v-model.number="form.order" type="number" min="0" /></div>
        <p v-if="formError" class="error">{{ formError }}</p>
        <div class="form-actions">
          <button class="btn-ghost" @click="showForm = false">Cancel</button>
          <button class="btn-primary" @click="save" :disabled="saving || !form.name || !form.role">{{ saving ? 'Saving...' : 'Save' }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import api from '@/api'
import ImageUpload from '@/components/admin/ImageUpload.vue'

const DEFAULT_FORM = { name: '', role: '', image: '', linkedin: '', twitter: '', order: 0 }
const items = ref([])
const showForm = ref(false)
const editItem = ref(null)
const form = ref({ ...DEFAULT_FORM })
const formError = ref('')
const saving = ref(false)
const imageFile = ref(null)

function onEscape(e) { if (e.key === 'Escape' && showForm.value) showForm.value = false }
onMounted(() => { load(); document.addEventListener('keydown', onEscape) })
onUnmounted(() => document.removeEventListener('keydown', onEscape))

async function load() {
  try { const { data } = await api.get('/team/'); items.value = data.results || (Array.isArray(data) ? data : []) }
  catch { items.value = [] }
}

function openAdd() {
  editItem.value = null
  form.value = { ...DEFAULT_FORM }
  imageFile.value = null
  formError.value = ''
  showForm.value = true
}

function edit(m) {
  editItem.value = m
  form.value = { name: m.name, role: m.role, image: m.image || '', linkedin: m.linkedin || '', twitter: m.twitter || '', order: m.order || 0 }
  imageFile.value = null
  formError.value = ''
  showForm.value = true
}

async function save() {
  formError.value = ''; saving.value = true
  try {
    const fd = new FormData()
    Object.entries(form.value).forEach(([k, v]) => {
      if (k !== 'image' || !imageFile.value) fd.append(k, v ?? '')
    })
    if (imageFile.value) fd.append('image', imageFile.value)
    if (editItem.value) await api.put(`/team/${editItem.value.id}/`, fd)
    else await api.post('/team/', fd)
    showForm.value = false; await load()
  } catch (e) { formError.value = e.response?.data?.error || e.response?.data?.message || 'Error saving' }
  finally { saving.value = false }
}
async function remove(id) { if (!confirm('Delete this member?')) return; await api.delete(`/team/${id}/`); await load() }
</script>

<style scoped>
.page-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px; }
.page-header h3 { font-size: 22px; font-weight: 800; margin-bottom: 4px; }
.page-header p { font-size: 14px; color: #4a5568; }
.btn-primary { display: inline-flex; align-items: center; gap: 6px; background: #007bff; color: #0d1b2a; padding: 10px 20px; border-radius: 8px; font-weight: 700; font-size: 14px; border: none; cursor: pointer; transition: all 0.2s; }
.btn-primary:hover { background: #0069d9; transform: translateY(-1px); }
.btn-primary:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
.btn-ghost { padding: 10px 20px; border-radius: 8px; font-weight: 700; font-size: 14px; border: 2px solid #e2e8f0; color: #4a5568; background: #fff; cursor: pointer; transition: all 0.2s; }
.btn-ghost:hover { border-color: #007bff; color: #007bff; }
.table-card { background: #fff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; }
table { width: 100%; border-collapse: collapse; }
th, td { text-align: left; padding: 12px 16px; font-size: 14px; }
th { background: #f8fafc; font-weight: 700; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; color: #0d1b2a; }
td { border-top: 1px solid #e2e8f0; }
.actions { display: flex; gap: 8px; }
.btn-sm { width: 32px; height: 32px; border-radius: 6px; display: inline-flex; align-items: center; justify-content: center; font-size: 13px; border: 1px solid #e2e8f0; background: #fff; color: #4a5568; cursor: pointer; transition: all 0.2s; }
.btn-sm:hover { border-color: #007bff; color: #007bff; }
.btn-sm.danger:hover { border-color: #e53e3e; color: #e53e3e; }
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 200; }
.modal-card { background: #fff; border-radius: 16px; padding: 32px; width: 100%; max-width: 500px; box-shadow: 0 20px 60px rgba(0,0,0,0.2); }
.modal-card h4 { font-size: 20px; font-weight: 800; margin-bottom: 24px; color: #0d1b2a; }
.form-group { display: flex; flex-direction: column; gap: 6px; margin-bottom: 16px; }
.form-group label { font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #0d1b2a; }
.form-group input { border: 2px solid #e2e8f0; border-radius: 8px; padding: 10px 14px; font-size: 14px; font-family: 'DM Sans', sans-serif; outline: none; transition: border-color 0.2s; }
.form-group input:focus { border-color: #007bff; box-shadow: 0 0 0 3px rgba(0,123,255,0.1); }
.form-actions { display: flex; gap: 12px; justify-content: flex-end; margin-top: 24px; padding-top: 20px; border-top: 1px solid #e2e8f0; }
.error { color: #e53e3e; font-size: 13px; }
</style>
