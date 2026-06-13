<template>
  <div>
    <div class="page-header"><h3>Footer</h3><p>Edit the footer content</p></div>
    <div class="form-card">
      <form @submit.prevent="save">
        <div class="form-group"><label>Brand Description</label><textarea v-model="form.brandDescription" rows="3"></textarea></div>
        <div class="form-group"><label>Contact Address</label><input v-model="form.contactAddress" /></div>
        <div class="form-row">
          <div class="form-group"><label>Contact Phone</label><input v-model="form.contactPhone" /></div>
          <div class="form-group"><label>Contact Email</label><input v-model="form.contactEmail" /></div>
        </div>
        <div class="form-group"><label>Contact Hours</label><input v-model="form.contactHours" /></div>

        <div class="list-section">
          <div class="list-section-header">
            <label>Quick Links</label>
            <button type="button" class="btn-sm add" @click="addItem('quickLinks')">+ Add New</button>
          </div>
          <div v-for="(item, i) in form.quickLinks" :key="'ql-'+i" class="list-row">
            <input v-model="item.label" placeholder="Label" />
            <input v-model="item.url" placeholder="/url" />
            <button type="button" class="btn-sm danger" @click="removeItem('quickLinks', i)">&times;</button>
          </div>
          <p v-if="!form.quickLinks.length" class="empty-hint">No quick links yet.</p>
        </div>

        <div class="list-section">
          <div class="list-section-header">
            <label>Service Links</label>
            <button type="button" class="btn-sm add" @click="addItem('serviceLinks')">+ Add New</button>
          </div>
          <div v-for="(item, i) in form.serviceLinks" :key="'sl-'+i" class="list-row">
            <input v-model="item.label" placeholder="Label" />
            <input v-model="item.url" placeholder="/url" />
            <button type="button" class="btn-sm danger" @click="removeItem('serviceLinks', i)">&times;</button>
          </div>
          <p v-if="!form.serviceLinks.length" class="empty-hint">No service links yet.</p>
        </div>

        <div class="list-section">
          <div class="list-section-header">
            <label>Policies</label>
            <button type="button" class="btn-sm add" @click="addItem('policies')">+ Add New</button>
          </div>
          <div v-for="(item, i) in form.policies" :key="'po-'+i" class="list-row">
            <input v-model="item.label" placeholder="Label" />
            <input v-model="item.url" placeholder="/url" />
            <button type="button" class="btn-sm danger" @click="removeItem('policies', i)">&times;</button>
          </div>
          <p v-if="!form.policies.length" class="empty-hint">No policies yet.</p>
        </div>

        <p v-if="error" class="error">{{ error }}</p>
        <div class="form-actions">
          <button type="submit" class="btn-primary" :disabled="saving">{{ saving ? 'Saving...' : 'Save Changes' }}</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/api'

const form = ref({ brandDescription: '', quickLinks: [], serviceLinks: [], contactAddress: '', contactPhone: '', contactEmail: '', contactHours: '', policies: [] })
const saving = ref(false)
const error = ref('')

onMounted(async () => {
  try {
    const { data } = await api.get('/footer')
    if (data) Object.assign(form.value, data)
  } catch {}
})

function addItem(field) {
  form.value[field].push({ label: '', url: '' })
}

function removeItem(field, idx) {
  form.value[field].splice(idx, 1)
}

async function save() {
  error.value = ''; saving.value = true
  try { await api.put('/footer', form.value) }
  catch (e) { error.value = e.response?.data?.message || 'Error saving' }
  finally { saving.value = false }
}
</script>
<style scoped>
.page-header h3 { font-size: 22px; font-weight: 800; margin-bottom: 24px; }
.form-card { background: #fff; border-radius: 12px; border: 1px solid #e2e8f0; padding: 32px; }
.form-group { display: flex; flex-direction: column; gap: 6px; margin-bottom: 20px; }
.form-group label { font-size: 13px; font-weight: 700; text-transform: uppercase; }
.form-group input, .form-group textarea { border: 2px solid #e2e8f0; border-radius: 8px; padding: 10px 14px; font-size: 14px; font-family: 'DM Sans', sans-serif; outline: none; }
.form-group input:focus, .form-group textarea:focus { border-color: #007bff; }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
.list-section { margin-bottom: 24px; padding: 16px; background: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0; }
.list-section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
.list-section-header label { font-size: 13px; font-weight: 700; text-transform: uppercase; }
.list-row { display: flex; gap: 8px; margin-bottom: 8px; }
.list-row input { flex: 1; border: 1px solid #e2e8f0; border-radius: 6px; padding: 8px 10px; font-size: 13px; font-family: 'DM Sans', sans-serif; outline: none; }
.list-row input:focus { border-color: #007bff; }
.btn-sm { padding: 6px 12px; border-radius: 6px; font-size: 13px; font-weight: 700; border: none; cursor: pointer; white-space: nowrap; }
.btn-sm.add { background: #007bff; color: #0d1b2a; }
.btn-sm.danger { background: #e53e3e; color: #fff; font-size: 16px; padding: 6px 10px; }
.empty-hint { font-size: 13px; color: #aaa; font-style: italic; }
.form-actions { display: flex; justify-content: flex-end; margin-top: 24px; }
.btn-primary { background: #007bff; color: #0d1b2a; padding: 12px 24px; border-radius: 8px; font-weight: 700; border: none; cursor: pointer; }
.btn-primary:disabled { opacity: 0.6; }
.error { color: #e53e3e; font-size: 13px; }
</style>
