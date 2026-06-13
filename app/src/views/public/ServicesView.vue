<template>
  <div>
    <AppHeader />

    <section class="ve-page-hero" style="background-image:url(/img/bg-img/2.jpg);">
      <div class="ve-page-hero-overlay"></div>
      <div class="container ve-page-hero-content">
        <ul class="ve-breadcrumb"><li><router-link to="/">Home</router-link></li><li class="active">Services</li></ul>
        <h1>Our <span>Services</span></h1>
      </div>
    </section>

    <!-- Services Grid -->
    <section class="ve-section ve-services-section">
      <div class="container">
        <div class="ve-section-header text-center">
          <span class="ve-section-tag">What We Do</span>
          <h2>Comprehensive Blockchain <span>Solutions</span></h2>
        </div>
        <div class="ve-services-grid">
          <div class="ve-service-card" v-for="s in services" :key="s.id">
            <div class="ve-service-icon"><i :class="s.icon || 'icon-profits'"></i></div>
            <h4>{{ s.title }}</h4>
            <p>{{ s.description }}</p>
            <router-link to="/contact.html" class="ve-card-link">Get Started <i class="fa fa-long-arrow-right"></i></router-link>
          </div>
        </div>
      </div>
    </section>

    <!-- Process Steps -->
    <section class="ve-process-section" v-if="processSteps.length">
      <div class="container">
        <div class="ve-section-header text-center">
          <span class="ve-section-tag">Our Process</span>
          <h2 style="color:#fff;">How We <span style="color:#007bff;">Deliver</span></h2>
        </div>
        <div class="ve-process-grid">
          <template v-for="(step, i) in processSteps" :key="step.id">
            <div class="ve-process-step">
              <div class="ve-process-num">{{ step.step }}</div>
              <h5>{{ step.title }}</h5>
              <p>{{ step.description }}</p>
            </div>
            <div class="ve-process-arrow" v-if="i < processSteps.length - 1"><i class="fa fa-long-arrow-right"></i></div>
          </template>
        </div>
      </div>
    </section>

    <!-- FAQ -->
    <section class="ve-section ve-faq-section" v-if="faqItems.length">
      <div class="container">
        <div class="ve-section-header text-center">
          <span class="ve-section-tag">FAQ</span>
          <h2>Frequently Asked <span>Questions</span></h2>
        </div>
        <div class="ve-faq-list">
          <div v-for="f in faqItems" :key="f.id" class="ve-faq-item" :class="{ open: openFaq === f.id }">
            <div class="ve-faq-q" @click="toggleFaq(f.id)">
              <span>{{ f.question }}</span>
              <i class="fa fa-plus"></i>
            </div>
            <div class="ve-faq-a">{{ f.answer }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="ve-cta-banner bg-img" style="background-image:url(/img/bg-img/6.jpg);">
      <div class="ve-cta-overlay"></div>
      <div class="container ve-cta-content">
        <div class="row align-items-center">
          <div class="col-12 col-lg-8">
            <h2>Ready to Build Your <span>Blockchain Solution?</span></h2>
            <p>Partner with AlpharKing Enterprise and bring your vision to life.</p>
          </div>
          <div class="col-12 col-lg-4 text-lg-right">
            <router-link to="/contact.html" class="ve-btn-white">Start Your Project</router-link>
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
import AppHeader from '@/components/public/AppHeader.vue'
import AppFooter from '@/components/public/AppFooter.vue'
import NewsletterForm from '@/components/public/NewsletterForm.vue'

const services = ref([])
const processSteps = ref([])
const faqItems = ref([])
const openFaq = ref(null)

function toggleFaq(id) { openFaq.value = openFaq.value === id ? null : id }

onMounted(async () => {
  try {
    const [sRes, pRes, fRes] = await Promise.all([api.get('/services'), api.get('/process'), api.get('/faq')])
    services.value = sRes.data.results || (Array.isArray(sRes.data) ? sRes.data : [])
    processSteps.value = pRes.data.results || (Array.isArray(pRes.data) ? pRes.data : [])
    faqItems.value = fRes.data.results || (Array.isArray(fRes.data) ? fRes.data : [])
  } catch {}
})
</script>
