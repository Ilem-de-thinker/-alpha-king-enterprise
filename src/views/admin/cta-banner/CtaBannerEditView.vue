<template>
  <div>
    <div class="page-header"><h3>CTA Banner</h3><p>Edit the call-to-action banner</p></div>
    <div class="form-card">
      <form @submit.prevent="save">
        <div class="form-group"><label>Title</label><input v-model="form.title" /></div>
        <div class="form-group"><label>Highlight</label><input v-model="form.highlight" /></div>
        <div class="form-group"><label>Description</label><textarea v-model="form.description" rows="2"></textarea></div>
        <div class="form-row">
          <div class="form-group"><label>Button Text</label><input v-model="form.buttonText" /></div>
          <div class="form-group"><label>Button URL</label><input v-model="form.buttonUrl" /></div>
        </div>
        <div class="form-group"><label>Background Image</label><ImageUpload v-model="form.backgroundImage" @file="bgImageFile = $event" /></div>
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
import ImageUpload from '@/components/admin/ImageUpload.vue'

const FORM_KEYS = ['title', 'highlight', 'description', 'buttonText', 'buttonUrl', 'backgroundImage']

const form = ref({ title: '', highlight: '', description: '', buttonText: '', buttonUrl: '', backgroundImage: '' })
const saving = ref(false)
const error = ref('')
const bgImageFile = ref(null)

onMounted(async () => {
  try {
    const { data } = await api.get('/cta-banner/')
    FORM_KEYS.forEach(k => { if (data[k] !== undefined) form.value[k] = data[k] })
  } catch (e) { error.value = e.response?.data?.error || 'Failed to load CTA banner data' }
})

async function save() {
  error.value = ''; saving.value = true
  try {
    const fd = new FormData()
    FORM_KEYS.forEach(k => {
      if (k === 'backgroundImage' && bgImageFile.value) fd.append(k, bgImageFile.value)
      else fd.append(k, form.value[k] ?? '')
    })
    await api.put('/cta-banner/', fd)
  }
  catch (e) { error.value = e.response?.data?.error || 'Error saving' }
  finally { saving.value = false }
}
</script>

<style scoped>
.page-header h3 { font-size: 22px; font-weight: 800; margin-bottom: 24px; }
.form-card { background: #fff; border-radius: 12px; border: 1px solid #e2e8f0; padding: 32px; }
.form-group { display: flex; flex-direction: column; gap: 6px; margin-bottom: 20px; }
.form-group label { font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #0d1b2a; }
.form-group input, .form-group textarea { border: 2px solid #e2e8f0; border-radius: 8px; padding: 10px 14px; font-size: 14px; font-family: 'DM Sans', sans-serif; outline: none; transition: border-color 0.2s; }
.form-group input:focus, .form-group textarea:focus { border-color: #007bff; box-shadow: 0 0 0 3px rgba(0,123,255,0.1); }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
.form-actions { display: flex; justify-content: flex-end; margin-top: 24px; padding-top: 20px; border-top: 1px solid #e2e8f0; }
.btn-primary { background: #007bff; color: #0d1b2a; padding: 12px 24px; border-radius: 8px; font-weight: 700; font-size: 14px; border: none; cursor: pointer; transition: all 0.2s; }
.btn-primary:hover { background: #0069d9; transform: translateY(-1px); }
.btn-primary:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
.error { color: #e53e3e; font-size: 13px; }
</style>
