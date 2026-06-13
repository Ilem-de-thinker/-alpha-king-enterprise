<template>
  <div class="ve-editor">
    <div class="ve-editor-toolbar">
      <button type="button" @click="exec('bold')" :class="{ active: active('bold') }"><strong>B</strong></button>
      <button type="button" @click="exec('italic')" :class="{ active: active('italic') }"><em>I</em></button>
      <button type="button" @click="exec('underline')" :class="{ active: active('underline') }"><u>U</u></button>
      <span class="ve-editor-sep"></span>
      <button type="button" @click="exec('formatBlock', 'h2')" :class="{ active: active('h2') }">H2</button>
      <button type="button" @click="exec('formatBlock', 'h3')" :class="{ active: active('h3') }">H3</button>
      <span class="ve-editor-sep"></span>
      <button type="button" @click="exec('insertUnorderedList')" :class="{ active: active('ul') }">&#8226;</button>
      <button type="button" @click="exec('insertOrderedList')" :class="{ active: active('ol') }">1.</button>
      <span class="ve-editor-sep"></span>
      <button type="button" @click="exec('formatBlock', 'blockquote')" :class="{ active: active('blockquote') }">&ldquo;</button>
      <button type="button" @click="insertLink">&infin;</button>
      <button type="button" @click="exec('insertHorizontalRule')">&mdash;</button>
      <span class="ve-editor-sep"></span>
      <button type="button" @click="exec('undo')">&#8617;</button>
      <button type="button" @click="exec('redo')">&#8618;</button>
    </div>
    <div
      ref="editorRef"
      class="ve-editor-content"
      contenteditable="true"
      @input="onInput"
      @keydown="onKeydown"
      v-html="innerHtml"
    ></div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue'

const props = defineProps({ modelValue: { type: String, default: '' } })
const emit = defineEmits(['update:modelValue'])

const editorRef = ref(null)
const innerHtml = ref(props.modelValue || '')

function exec(command, value) {
  document.execCommand(command, false, value || null)
  editorRef.value?.focus()
  emitChange()
}

function active(name) {
  if (!editorRef.value) return false
  if (name === 'h2') return document.queryCommandState('formatBlock') && document.queryCommandValue('formatBlock')?.toLowerCase() === 'h2'
  if (name === 'h3') return document.queryCommandState('formatBlock') && document.queryCommandValue('formatBlock')?.toLowerCase() === 'h3'
  if (name === 'blockquote') return document.queryCommandState('formatBlock') && document.queryCommandValue('formatBlock')?.toLowerCase() === 'blockquote'
  if (name === 'ul') return document.queryCommandState('insertUnorderedList')
  if (name === 'ol') return document.queryCommandState('insertOrderedList')
  return document.queryCommandState(name)
}

function insertLink() {
  const url = prompt('Enter link URL:')
  if (url) exec('createLink', url)
}

function onInput() {
  emitChange()
}

function onKeydown(e) {
  if (e.key === 'Tab') {
    e.preventDefault()
    document.execCommand('insertHTML', false, '&nbsp;&nbsp;&nbsp;&nbsp;')
  }
  if (e.key === 'Enter' && !e.shiftKey) {
    const block = document.queryCommandValue('formatBlock')
    if (block === 'blockquote') {
      e.preventDefault()
      document.execCommand('insertHTML', false, '<br><br>')
    }
  }
}

function emitChange() {
  nextTick(() => {
    innerHtml.value = editorRef.value?.innerHTML || ''
    emit('update:modelValue', innerHtml.value)
  })
}

watch(() => props.modelValue, (val) => {
  if (val !== innerHtml.value && editorRef.value) {
    innerHtml.value = val || ''
    editorRef.value.innerHTML = innerHtml.value
  }
})
</script>

<style scoped>
.ve-editor { border: 2px solid #e2e8f0; border-radius: 8px; overflow: hidden; }
.ve-editor-toolbar { display: flex; flex-wrap: wrap; gap: 2px; padding: 8px; background: #f8fafc; border-bottom: 1px solid #e2e8f0; }
.ve-editor-toolbar button { padding: 4px 10px; border: 1px solid transparent; border-radius: 4px; background: transparent; cursor: pointer; font-size: 14px; color: #4a5568; }
.ve-editor-toolbar button:hover { background: #e2e8f0; }
.ve-editor-toolbar button.active { background: #007bff; color: #fff; border-color: #007bff; }
.ve-editor-sep { width: 1px; background: #e2e8f0; margin: 4px 6px; }
.ve-editor-content { padding: 16px; min-height: 250px; outline: none; }
.ve-editor-content :deep(p) { margin-bottom: 12px; }
.ve-editor-content :deep(h2) { font-size: 22px; font-weight: 800; margin: 16px 0 8px; }
.ve-editor-content :deep(h3) { font-size: 18px; font-weight: 700; margin: 12px 0 6px; }
.ve-editor-content :deep(ul), .ve-editor-content :deep(ol) { padding-left: 24px; margin-bottom: 12px; }
.ve-editor-content :deep(blockquote) { border-left: 3px solid #007bff; padding-left: 12px; color: #4a5568; font-style: italic; margin-bottom: 12px; }
.ve-editor-content :deep(hr) { margin: 16px 0; border: none; border-top: 1px solid #e2e8f0; }
</style>
