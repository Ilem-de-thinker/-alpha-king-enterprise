<template>
  <div>
    <div class="page-header">
      <h3>About Page</h3>
      <p>Edit the about page content</p>
    </div>
    <div class="form-card">
      <form @submit.prevent="save">
        <div class="form-group"><label>Tag</label><input v-model="form.tag" /></div>
        <div class="form-group"><label>Title</label><input v-model="form.title" /></div>
        <div class="form-group"><label>Highlight</label><input v-model="form.highlight" /></div>
        <div class="form-group"><label>Lead Paragraph</label><textarea v-model="form.leadParagraph" rows="3"></textarea></div>
        <div class="form-group"><label>Body Paragraphs (one per line)</label><textarea v-model="bodyStr" rows="4"></textarea></div>
        <div class="form-row">
          <div class="form-group"><label>Main Image</label><ImageUpload v-model="form.mainImage" @file="mainImageFile = $event" /></div>
          <div class="form-group"><label>Secondary Image</label><ImageUpload v-model="form.secondaryImage" @file="secondaryImageFile = $event" /></div>
        </div>
        <div class="form-row">
          <div class="form-group"><label>Badge Value</label><input v-model="form.badgeValue" /></div>
          <div class="form-group"><label>Badge Label</label><input v-model="form.badgeLabel" /></div>
        </div>
        <div class="form-row">
          <div class="form-group"><label>CTA Text</label><input v-model="form.ctaText" /></div>
          <div class="form-group"><label>CTA URL</label><input v-model="form.ctaUrl" /></div>
        </div>
        <div class="form-group"><label>Hero Image</label><ImageUpload v-model="form.heroImage" @file="heroImageFile = $event" /></div>
        <p v-if="error" class="error">{{ error }}</p>
        <div class="form-actions">
          <button type="submit" class="btn-primary" :disabled="saving">{{ saving ? "Saving..." : "Save Changes" }}</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import api from "@/api";
import ImageUpload from "@/components/admin/ImageUpload.vue";

const FORM_KEYS = ['tag', 'title', 'highlight', 'leadParagraph', 'bodyParagraphs', 'mainImage', 'secondaryImage', 'badgeValue', 'badgeLabel', 'ctaText', 'ctaUrl', 'heroImage']
const IMAGE_KEYS = ['mainImage', 'secondaryImage', 'heroImage']

const form = ref({
  tag: "", title: "", highlight: "", leadParagraph: "", bodyParagraphs: [],
  mainImage: "", secondaryImage: "", badgeValue: "", badgeLabel: "",
  ctaText: "", ctaUrl: "", heroImage: "",
});
const bodyStr = ref("");
const saving = ref(false);
const error = ref("");
const mainImageFile = ref(null);
const secondaryImageFile = ref(null);
const heroImageFile = ref(null);

onMounted(async () => {
  try {
    const { data } = await api.get("/about/");
    FORM_KEYS.forEach(k => { if (data[k] !== undefined) form.value[k] = data[k] });
    bodyStr.value = (data.bodyParagraphs || []).join("\n");
  } catch (e) {
    error.value = e.response?.data?.error || "Failed to load about data";
  }
});

watch(bodyStr, (v) => {
  form.value.bodyParagraphs = v.split("\n").filter(Boolean);
});

async function save() {
  error.value = "";
  saving.value = true;
  try {
    const fd = new FormData();
    const fileMap = { mainImage: mainImageFile.value, secondaryImage: secondaryImageFile.value, heroImage: heroImageFile.value };
    FORM_KEYS.forEach(k => {
      if (fileMap[k]) fd.append(k, fileMap[k]);
      else if (Array.isArray(form.value[k])) fd.append(k, JSON.stringify(form.value[k]));
      else fd.append(k, form.value[k] ?? "");
    });
    await api.put("/about/", fd);
  } catch (e) {
    error.value = e.response?.data?.error || "Error saving";
  } finally {
    saving.value = false;
  }
}
</script>

<style scoped>
.page-header h3 { font-size: 22px; font-weight: 800; margin-bottom: 4px; }
.page-header p { font-size: 14px; color: #4a5568; margin-bottom: 24px; }
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
