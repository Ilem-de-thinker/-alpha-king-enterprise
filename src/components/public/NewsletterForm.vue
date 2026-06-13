
<template>
  <section class="ve-newsletter-section">
    <div class="container">
      <div class="ve-newsletter-wrap">
        <div class="ve-nl-left">
          <i :class="'fa ' + (section.icon || 'fa-envelope-o')"></i>
          <div>
            <h3>{{ section.title || 'Stay Informed' }}</h3>
            <p>{{ section.description || 'Weekly blockchain insights, industry analysis, and company updates.' }}</p>
          </div>
        </div>
        <div class="ve-nl-right">
          <form class="ve-nl-form" @submit.prevent="subscribe">
            <input v-model="email" type="email" :placeholder="section.placeholder || 'Enter your email address'" required />
            <button type="submit">{{ section.buttonText || 'Subscribe' }}</button>
          </form>
          <p v-if="message" style="color:#28a745;font-size:13px;margin-top:8px;">{{ message }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/api'

const email = ref('')
const message = ref('')
const section = ref({})

onMounted(async () => {
  try { const { data } = await api.get('/newsletter-section'); section.value = data || {} } catch {}
})

async function subscribe() {
  try {
    await api.post('/newsletter', { email: email.value })
    message.value = 'Subscribed successfully!'
    email.value = ''
  } catch (e) {
    message.value = e.response?.data?.message || 'Subscription failed'
  }
}
</script>
