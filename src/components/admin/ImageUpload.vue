<template>
  <div class="image-upload">
    <div v-if="preview || modelValue" class="preview-area">
      <img :src="preview || modelValue" alt="Preview" class="preview-img" />
      <button type="button" class="remove-btn" @click="remove"><i class="fa fa-times"></i></button>
    </div>
    <div v-else class="drop-area" @click="$refs.fileInput.click()" @dragover.prevent @drop.prevent="onDrop">
      <i class="fa fa-cloud-upload"></i>
      <span>Click or drag image here</span>
      <span class="hint">JPG, PNG, WebP up to 5MB</span>
      <input ref="fileInput" type="file" accept="image/*" class="file-input" @change="onFile" />
    </div>
    <div v-if="!modelValue && !preview" class="url-row">
      <input v-model="urlInput" type="text" placeholder="Or paste image URL..." class="url-input" @blur="onUrl" @keydown.enter.prevent="onUrl" />
    </div>
    <p v-if="error" class="upload-error">{{ error }}</p>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({ modelValue: { type: String, default: '' } })
const emit = defineEmits(['update:modelValue', 'file'])

const preview = ref('')
const urlInput = ref('')
const error = ref('')
const fileInput = ref(null)

const URL_REGEX = /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp|svg)(\?.*)?$/i

watch(() => props.modelValue, (v) => { if (!v) { preview.value = ''; urlInput.value = '' } })

function onFile(e) { validate(e.target.files[0]) }
function onDrop(e) { validate(e.dataTransfer.files[0]) }

function validate(file) {
  error.value = ''
  if (!file) return
  if (file.size > 5 * 1024 * 1024) { error.value = 'Image must be under 5MB'; return }
  if (!file.type.startsWith('image/')) { error.value = 'File must be an image'; return }
  preview.value = URL.createObjectURL(file)
  emit('file', file)
  emit('update:modelValue', '')
}

function onUrl() {
  const url = urlInput.value.trim()
  if (!url) { error.value = ''; return }
  if (!url.startsWith('http')) { error.value = 'URL must start with http:// or https://'; return }
  if (!URL_REGEX.test(url)) { error.value = 'URL must point to an image file (jpg, png, gif, webp, svg)'; return }
  error.value = ''
  emit('update:modelValue', url)
  emit('file', null)
}

function remove() {
  preview.value = ''
  urlInput.value = ''
  error.value = ''
  emit('update:modelValue', '')
  emit('file', null)
  if (fileInput.value) fileInput.value.value = ''
}
</script>

<style scoped>
.image-upload { display: flex; flex-direction: column; gap: 8px; }
.preview-area { position: relative; border-radius: 8px; overflow: hidden; border: 2px solid #e2e8f0; }
.preview-img { width: 100%; max-height: 200px; object-fit: cover; display: block; }
.remove-btn { position: absolute; top: 8px; right: 8px; width: 28px; height: 28px; border-radius: 50%; background: rgba(0,0,0,0.6); color: #fff; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 12px; transition: background 0.2s; }
.remove-btn:hover { background: rgba(0,0,0,0.85); }
.drop-area { display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 32px; border: 2px dashed #cbd5e0; border-radius: 8px; cursor: pointer; transition: all 0.2s; color: #718096; text-align: center; }
.drop-area:hover { border-color: #007bff; color: #007bff; background: rgba(0,123,255,0.04); }
.drop-area i { font-size: 28px; }
.drop-area .hint { font-size: 11px; color: #a0aec0; }
.file-input { display: none; }
.url-row { margin-top: 4px; }
.url-input { width: 100%; border: 2px solid #e2e8f0; border-radius: 8px; padding: 8px 12px; font-size: 13px; font-family: 'DM Sans', sans-serif; outline: none; transition: border-color 0.2s; }
.url-input:focus { border-color: #007bff; box-shadow: 0 0 0 3px rgba(0,123,255,0.1); }
.upload-error { color: #e53e3e; font-size: 12px; margin: 0; }
</style>
