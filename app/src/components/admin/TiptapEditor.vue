<template>
  <div class="tiptap-editor" v-if="editor">
    <div class="tiptap-toolbar">
      <button type="button" @click="editor.chain().focus().toggleBold().run()" :class="{ active: editor.isActive('bold') }"><strong>B</strong></button>
      <button type="button" @click="editor.chain().focus().toggleItalic().run()" :class="{ active: editor.isActive('italic') }"><em>I</em></button>
      <button type="button" @click="editor.chain().focus().toggleHeading({ level: 2 }).run()" :class="{ active: editor.isActive('heading', { level: 2 }) }">H2</button>
      <button type="button" @click="editor.chain().focus().toggleHeading({ level: 3 }).run()" :class="{ active: editor.isActive('heading', { level: 3 }) }">H3</button>
      <button type="button" @click="editor.chain().focus().toggleBulletList().run()" :class="{ active: editor.isActive('bulletList') }">&#8226;</button>
      <button type="button" @click="editor.chain().focus().toggleOrderedList().run()" :class="{ active: editor.isActive('orderedList') }">1.</button>
      <button type="button" @click="editor.chain().focus().toggleBlockquote().run()" :class="{ active: editor.isActive('blockquote') }">&ldquo;</button>
      <button type="button" @click="editor.chain().focus().setHorizontalRule().run()">&mdash;</button>
      <button type="button" @click="editor.chain().focus().undo().run()">&#8617;</button>
      <button type="button" @click="editor.chain().focus().redo().run()">&#8618;</button>
    </div>
    <editor-content :editor="editor" class="tiptap-content" />
  </div>
</template>

<script setup>
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import { watch } from 'vue'

const props = defineProps({ modelValue: { type: String, default: '' } })
const emit = defineEmits(['update:modelValue'])

const editor = useEditor({
  content: props.modelValue,
  extensions: [
    StarterKit,
    Placeholder.configure({ placeholder: 'Start writing...' })
  ],
  onUpdate: ({ editor }) => emit('update:modelValue', editor.getHTML())
})

watch(() => props.modelValue, (val) => {
  if (editor.value && val !== editor.value.getHTML()) {
    editor.value.commands.setContent(val, false)
  }
})
</script>

<style scoped>
.tiptap-editor { border: 2px solid #e2e8f0; border-radius: 8px; overflow: hidden; }
.tiptap-toolbar { display: flex; flex-wrap: wrap; gap: 2px; padding: 8px; background: #f8fafc; border-bottom: 1px solid #e2e8f0; }
.tiptap-toolbar button { padding: 4px 10px; border: 1px solid transparent; border-radius: 4px; background: transparent; cursor: pointer; font-size: 14px; color: #4a5568; }
.tiptap-toolbar button:hover { background: #e2e8f0; }
.tiptap-toolbar button.active { background: #007bff; color: #fff; border-color: #007bff; }
.tiptap-content { padding: 16px; min-height: 250px; outline: none; }
.tiptap-content :deep(p) { margin-bottom: 12px; }
.tiptap-content :deep(h2) { font-size: 22px; font-weight: 800; margin: 16px 0 8px; }
.tiptap-content :deep(h3) { font-size: 18px; font-weight: 700; margin: 12px 0 6px; }
.tiptap-content :deep(ul), .tiptap-content :deep(ol) { padding-left: 24px; margin-bottom: 12px; }
.tiptap-content :deep(blockquote) { border-left: 3px solid #007bff; padding-left: 12px; color: #4a5568; font-style: italic; margin-bottom: 12px; }
.tiptap-content :deep(hr) { margin: 16px 0; border: none; border-top: 1px solid #e2e8f0; }
.tiptap-content :deep(.ProseMirror-focused) { outline: none; }
.tiptap-content :deep(.ProseMirror p.is-editor-empty:first-child::before) { color: #aaa; content: attr(data-placeholder); float: left; height: 0; pointer-events: none; }
</style>
