<template>
  <div>
    <AppHeader />

    <section class="ve-page-hero" style="background-image:url(/img/bg-img/4.jpg);">
      <div class="ve-page-hero-overlay"></div>
      <div class="container ve-page-hero-content">
        <ul class="ve-breadcrumb"><li><router-link to="/">Home</router-link></li><li class="active">Contact</li></ul>
        <h1>Get in <span>Touch</span></h1>
      </div>
    </section>

    <!-- Contact Cards -->
    <section class="ve-contact-cards-section">
      <div class="container">
        <div class="ve-contact-cards-grid">
          <div class="ve-contact-info-card">
            <div class="ve-ci-icon"><i class="fa fa-map-marker"></i></div>
            <h5>Our Location</h5>
            <p>{{ company.address || 'Available Worldwide' }}</p>
          </div>
          <div class="ve-contact-info-card">
            <div class="ve-ci-icon"><i class="fa fa-phone"></i></div>
            <h5>Call Us</h5>
            <p>{{ company.phone || '+XXX XXX XXXX' }}</p>
          </div>
          <div class="ve-contact-info-card">
            <div class="ve-ci-icon"><i class="fa fa-envelope"></i></div>
            <h5>Email Us</h5>
            <p>{{ company.email || 'hello@alpharkingenterprise.com' }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Contact Form -->
    <section class="ve-section">
      <div class="container">
        <div class="row">
          <div class="col-12 col-lg-8">
            <div class="ve-contact-form-wrap">
              <h2>Send Us a <span>Message</span></h2>
              <p>Have a project in mind? Fill out the form and we'll get back to you within 24 hours.</p>
              <form class="ve-contact-form" @submit.prevent="submitForm">
                <div class="ve-form-row">
                  <div class="ve-form-group">
                    <label>Your Name</label>
                    <input v-model="form.name" type="text" required placeholder="John Doe" />
                  </div>
                  <div class="ve-form-group">
                    <label>Your Email</label>
                    <input v-model="form.email" type="email" required placeholder="john@example.com" />
                  </div>
                </div>
                <div class="ve-form-row">
                  <div class="ve-form-group">
                    <label>Phone (optional)</label>
                    <input v-model="form.phone" type="text" placeholder="+123 456 789" />
                  </div>
                  <div class="ve-form-group">
                    <label>Service Interest</label>
                    <select v-model="form.service">
                      <option value="">Select a service...</option>
                      <option v-for="s in services" :key="s.id" :value="s.title">{{ s.title }}</option>
                    </select>
                  </div>
                </div>
                <div class="ve-form-group">
                  <label>Your Message</label>
                  <textarea v-model="form.message" rows="5" required placeholder="Tell us about your project..."></textarea>
                </div>
                <p v-if="formMessage" :style="{ color: formError ? '#e53e3e' : '#28a745', fontSize: '14px' }">{{ formMessage }}</p>
                <button type="submit" class="ve-btn-primary" :disabled="formSending">{{ formSending ? 'Sending...' : 'Send Message' }}</button>
              </form>
            </div>
          </div>
          <div class="col-12 col-lg-4">
            <div class="ve-contact-aside">
              <div class="ve-ca-box">
                <h4>Contact Info</h4>
                <ul class="ve-ca-list">
                  <li><i class="fa fa-map-marker"></i> {{ company.address || 'Available Worldwide' }}</li>
                  <li><i class="fa fa-phone"></i> {{ company.phone || '+XXX XXX XXXX' }}</li>
                  <li><i class="fa fa-envelope"></i> {{ company.email || 'hello@alpharkingenterprise.com' }}</li>
                </ul>
              </div>
              <div class="ve-ca-hours">
                <h5><i class="fa fa-clock-o"></i> Business Hours</h5>
                <ul>
                  <li><span>Mon - Fri</span> <strong>{{ company.hours || '9am - 6pm' }}</strong></li>
                  <li><span>Saturday</span> <strong>Closed</strong></li>
                  <li><span>Sunday</span> <strong>Closed</strong></li>
                </ul>
              </div>
              <div class="ve-ca-social">
                <h5>Follow Us</h5>
                <div class="ve-social">
                  <a v-if="social.facebook" :href="social.facebook" target="_blank"><i class="fa fa-facebook"></i></a>
                  <a v-if="social.twitter" :href="social.twitter" target="_blank"><i class="fa fa-twitter"></i></a>
                  <a v-if="social.linkedin" :href="social.linkedin" target="_blank"><i class="fa fa-linkedin"></i></a>
                  <a v-if="social.instagram" :href="social.instagram" target="_blank"><i class="fa fa-instagram"></i></a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <NewsletterForm />
    <AppFooter />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/api'
import AppHeader from '@/components/AppHeader.vue'
import AppFooter from '@/components/AppFooter.vue'
import NewsletterForm from '@/components/NewsletterForm.vue'

const form = ref({ name: '', email: '', phone: '', service: '', message: '' })
const formMessage = ref('')
const formError = ref(false)
const formSending = ref(false)
const services = ref([])
const company = ref({})
const social = ref({})

onMounted(async () => {
  try {
    const [sRes, cRes, socRes] = await Promise.all([api.get('/services'), api.get('/company'), api.get('/social')])
    services.value = Array.isArray(sRes.data) ? sRes.data : []
    company.value = cRes.data || {}
    social.value = socRes.data || {}
  } catch {}
})

async function submitForm() {
  formSending.value = true; formMessage.value = ''; formError.value = false
  try {
    await api.post('/contact', form.value)
    formMessage.value = 'Message sent successfully! We will get back to you soon.'
    form.value = { name: '', email: '', phone: '', service: '', message: '' }
  } catch (e) {
    formError.value = true
    formMessage.value = e.response?.data?.message || 'Failed to send message. Please try again.'
  } finally { formSending.value = false }
}
</script>
