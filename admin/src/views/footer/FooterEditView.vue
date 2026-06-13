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
        <div class="form-group"><label>Quick Links (JSON: [{"label":"Home","url":"/"}])</label><textarea v-model="quickLinksStr" rows="3"></textarea></div>
        <div class="form-group"><label>Service Links (JSON)</label><textarea v-model="serviceLinksStr" rows="3"></textarea></div>
        <div class="form-group"><label>Policies (JSON)</label><textarea v-model="policiesStr" rows="3"></textarea></div>
        <p v-if="error" class="error">{{ error }}</p>
        <div class="form-actions">
          <button type="submit" class="btn-primary" :disabled="saving">{{ saving ? 'Saving...' : 'Save Changes' }}</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import api from '@/api'

const form = ref({ brandDescription: '', quickLinks: [], serviceLinks: [], contactAddress: '', contactPhone: '', contactEmail: '', contactHours: '', policies: [] })
const quickLinksStr = ref('[]')
const serviceLinksStr = ref('[]')
const policiesStr = ref('[]')
const saving = ref(false)
const error = ref('')

onMounted(async () => {
  try {
    const { data } = await api.get('/footer')
    Object.assign(form.value, data)
    quickLinksStr.value = JSON.stringify(data.quickLinks || [])
    serviceLinksStr.value = JSON.stringify(data.serviceLinks || [])
    policiesStr.value = JSON.stringify(data.policies || [])
  } catch {}
})
watch(quickLinksStr, v => { try { form.value.quickLinks = JSON.parse(v) } catch {} })
watch(serviceLinksStr, v => { try { form.value.serviceLinks = JSON.parse(v) } catch {} })
watch(policiesStr, v => { try { form.value.policies = JSON.parse(v) } catch {} })

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
.form-actions { display: flex; justify-content: flex-end; margin-top: 24px; }
.btn-primary { background: #007bff; color: #0d1b2a; padding: 12px 24px; border-radius: 8px; font-weight: 700; border: none; cursor: pointer; }
.btn-primary:disabled { opacity: 0.6; }
.error { color: #e53e3e; font-size: 13px; }
</style>