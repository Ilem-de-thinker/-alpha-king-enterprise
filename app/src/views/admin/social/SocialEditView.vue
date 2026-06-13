<template>
  <div>
    <div class="page-header"><h3>Social Links</h3><p>Edit social media links</p></div>
    <div class="form-card">
      <form @submit.prevent="save">
        <div class="form-group"><label>Facebook URL</label><input v-model="form.facebook" /></div>
        <div class="form-group"><label>Twitter URL</label><input v-model="form.twitter" /></div>
        <div class="form-group"><label>LinkedIn URL</label><input v-model="form.linkedin" /></div>
        <div class="form-group"><label>Instagram URL</label><input v-model="form.instagram" /></div>
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

const form = ref({ facebook: '', twitter: '', linkedin: '', instagram: '' })
const saving = ref(false)
const error = ref('')

onMounted(async () => { try { const { data } = await api.get('/social'); Object.assign(form.value, data) } catch {} })
async function save() {
  error.value = ''; saving.value = true
  try { await api.put('/social', form.value) }
  catch (e) { error.value = e.response?.data?.message || 'Error saving' }
  finally { saving.value = false }
}
</script>
<style scoped>
.page-header h3 { font-size: 22px; font-weight: 800; margin-bottom: 24px; }
.form-card { background: #fff; border-radius: 12px; border: 1px solid #e2e8f0; padding: 32px; }
.form-group { display: flex; flex-direction: column; gap: 6px; margin-bottom: 20px; }
.form-group label { font-size: 13px; font-weight: 700; text-transform: uppercase; }
.form-group input { border: 2px solid #e2e8f0; border-radius: 8px; padding: 10px 14px; font-size: 14px; font-family: 'DM Sans', sans-serif; outline: none; }
.form-group input:focus { border-color: #007bff; }
.form-actions { display: flex; justify-content: flex-end; margin-top: 24px; }
.btn-primary { background: #007bff; color: #0d1b2a; padding: 12px 24px; border-radius: 8px; font-weight: 700; border: none; cursor: pointer; }
.btn-primary:disabled { opacity: 0.6; }
.error { color: #e53e3e; font-size: 13px; }
</style>