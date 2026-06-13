<template>
  <div>
    <div class="page-header"><h3>Hero Section</h3><p>Edit the landing page hero content</p></div>
    <div class="form-card">
      <form @submit.prevent="save">
        <div class="form-group"><label>Badge</label><input v-model="form.badge" /></div>
        <div class="form-group"><label>Title</label><input v-model="form.title" /></div>
        <div class="form-group"><label>Highlight (word to highlight in title)</label><input v-model="form.highlight" /></div>
        <div class="form-group"><label>Subtitle</label><textarea v-model="form.subtitle" rows="3"></textarea></div>
        <div class="form-row">
          <div class="form-group"><label>CTA Primary Text</label><input v-model="form.ctaPrimaryText" /></div>
          <div class="form-group"><label>CTA Primary URL</label><input v-model="form.ctaPrimaryUrl" /></div>
        </div>
        <div class="form-row">
          <div class="form-group"><label>CTA Secondary Text</label><input v-model="form.ctaSecondaryText" /></div>
          <div class="form-group"><label>CTA Secondary URL</label><input v-model="form.ctaSecondaryUrl" /></div>
        </div>
        <div class="form-row">
          <div class="form-group"><label>Main Image URL</label><input v-model="form.mainImage" /></div>
          <div class="form-group"><label>Accent Image URL</label><input v-model="form.accentImage" /></div>
        </div>
        <div class="form-row">
          <div class="form-group"><label>Float Card Icon</label><input v-model="form.floatCardIcon" /></div>
          <div class="form-group"><label>Float Card Value</label><input v-model="form.floatCardValue" /></div>
        </div>
        <div class="form-group"><label>Float Card Label</label><input v-model="form.floatCardLabel" /></div>
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

const form = ref({
  badge: '', title: '', highlight: '', subtitle: '',
  ctaPrimaryText: '', ctaPrimaryUrl: '', ctaSecondaryText: '', ctaSecondaryUrl: '',
  mainImage: '', accentImage: '', floatCardIcon: '', floatCardValue: '', floatCardLabel: ''
})
const saving = ref(false)
const error = ref('')

onMounted(async () => {
  try { const { data } = await api.get('/hero'); Object.assign(form.value, data) } catch (e) { error.value = e.response?.data?.message || 'Failed to load hero data' }
})

async function save() {
  error.value = ''; saving.value = true
  try { await api.put('/hero', form.value) }
  catch (e) { error.value = e.response?.data?.message || 'Error saving' }
  finally { saving.value = false }
}
</script>

<style scoped>
.page-header h3 { font-size: 22px; font-weight: 800; margin-bottom: 4px; }
.page-header p { font-size: 14px; color: #4a5568; margin-bottom: 24px; }
.form-card { background: #fff; border-radius: 12px; border: 1px solid #e2e8f0; padding: 32px; }
.form-group { display: flex; flex-direction: column; gap: 6px; margin-bottom: 20px; }
.form-group label { font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; }
.form-group input, .form-group textarea { border: 2px solid #e2e8f0; border-radius: 8px; padding: 10px 14px; font-size: 14px; font-family: 'DM Sans', sans-serif; outline: none; }
.form-group input:focus, .form-group textarea:focus { border-color: #007bff; box-shadow: 0 0 0 3px rgba(0,123,255,0.12); }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
.form-actions { display: flex; gap: 12px; justify-content: flex-end; margin-top: 24px; }
.btn-primary { background: #007bff; color: #0d1b2a; padding: 12px 24px; border-radius: 8px; font-weight: 700; font-size: 14px; border: none; cursor: pointer; }
.btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
.error { color: #e53e3e; font-size: 13px; }
</style>
