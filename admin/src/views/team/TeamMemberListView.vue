<template>
  <div>
    <div class="page-header">
      <div><h3>Team Members</h3><p>Manage the team</p></div>
      <button class="btn-primary" @click="showForm = true; editItem = null"><i class="fa fa-plus"></i> Add</button>
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
        <div class="form-group"><label>Name</label><input v-model="form.name" /></div>
        <div class="form-group"><label>Role</label><input v-model="form.role" /></div>
        <div class="form-group"><label>Image URL</label><input v-model="form.image" /></div>
        <div class="form-group"><label>LinkedIn URL</label><input v-model="form.linkedin" /></div>
        <div class="form-group"><label>Twitter URL</label><input v-model="form.twitter" /></div>
        <div class="form-group"><label>Order</label><input v-model="form.order" type="number" /></div>
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
const form = ref({ name: '', role: '', image: '', linkedin: '', twitter: '', order: 0 })
const formError = ref('')
const saving = ref(false)

onMounted(load)
async function load() { try { const { data } = await api.get('/team'); items.value = Array.isArray(data) ? data : [] } catch { items.value = [] } }

function edit(m) { editItem.value = m; form.value = { name: m.name, role: m.role, image: m.image || '', linkedin: m.linkedin || '', twitter: m.twitter || '', order: m.order || 0 }; showForm.value = true }

async function save() {
  formError.value = ''; saving.value = true
  try {
    if (editItem.value) await api.put(`/team/${editItem.value.id}`, form.value)
    else await api.post('/team', form.value)
    showForm.value = false; editItem.value = null; form.value = { name: '', role: '', image: '', linkedin: '', twitter: '', order: 0 }; await load()
  } catch (e) { formError.value = e.response?.data?.message || 'Error saving' }
  finally { saving.value = false }
}
async function remove(id) { if (!confirm('Delete?')) return; await api.delete(`/team/${id}`); await load() }
</script>

<style scoped>
.page-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px; }
.page-header h3 { font-size: 22px; font-weight: 800; margin-bottom: 4px; }
.page-header p { font-size: 14px; color: #4a5568; }
.btn-primary { display: inline-flex; align-items: center; gap: 6px; background: #007bff; color: #0d1b2a; padding: 10px 20px; border-radius: 8px; font-weight: 700; font-size: 14px; border: none; cursor: pointer; }
.btn-ghost { padding: 10px 20px; border-radius: 8px; font-weight: 700; font-size: 14px; border: 2px solid #e2e8f0; color: #4a5568; background: #fff; cursor: pointer; }
.table-card { background: #fff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; }
table { width: 100%; border-collapse: collapse; }
th, td { text-align: left; padding: 12px 16px; font-size: 14px; }
th { background: #f8fafc; font-weight: 700; font-size: 12px; text-transform: uppercase; }
td { border-top: 1px solid #e2e8f0; }
.actions { display: flex; gap: 8px; }
.btn-sm { width: 32px; height: 32px; border-radius: 6px; display: inline-flex; align-items: center; justify-content: center; font-size: 13px; border: 1px solid #e2e8f0; background: #fff; color: #4a5568; cursor: pointer; }
.btn-sm.danger:hover { border-color: #e53e3e; color: #e53e3e; }
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 200; }
.modal-card { background: #fff; border-radius: 12px; padding: 32px; width: 100%; max-width: 500px; }
.modal-card h4 { font-size: 18px; font-weight: 800; margin-bottom: 20px; }
.form-group { display: flex; flex-direction: column; gap: 6px; margin-bottom: 16px; }
.form-group label { font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; }
.form-group input { border: 2px solid #e2e8f0; border-radius: 8px; padding: 10px 14px; font-size: 14px; font-family: 'DM Sans', sans-serif; outline: none; }
.form-group input:focus { border-color: #007bff; }
.form-actions { display: flex; gap: 12px; justify-content: flex-end; margin-top: 20px; }
.error { color: #e53e3e; font-size: 13px; }
</style>
