
<template>
  <footer class="ve-footer">
    <div class="container">
      <div class="row">
        <div class="col-12 col-sm-6 col-lg-4 mb-50">
          <div class="ve-footer-brand">
            <router-link to="/" class="ve-footer-logo">
              <span class="ve-logo-icon">{{ company.logo || 'AK' }}</span>
              <span class="ve-logo-text">{{ company.name || 'Alpharking' }}</span>
            </router-link>
            <p>{{ footer.brandDescription || company.description || '' }}</p>
            <div class="ve-social">
              <a v-if="social.facebook" :href="social.facebook" target="_blank"><i class="fa fa-facebook"></i></a>
              <a v-if="social.twitter" :href="social.twitter" target="_blank"><i class="fa fa-twitter"></i></a>
              <a v-if="social.linkedin" :href="social.linkedin" target="_blank"><i class="fa fa-linkedin"></i></a>
              <a v-if="social.instagram" :href="social.instagram" target="_blank"><i class="fa fa-instagram"></i></a>
            </div>
          </div>
        </div>
        <div class="col-12 col-sm-6 col-lg-2 mb-50">
          <h5 class="ve-footer-title">Quick Links</h5>
          <ul class="ve-footer-links">
            <li v-for="link in quickLinks" :key="link.label">
              <router-link :to="link.url || '#'">{{ link.label }}</router-link>
            </li>
          </ul>
        </div>
        <div class="col-12 col-sm-6 col-lg-3 mb-50">
          <h5 class="ve-footer-title">Our Services</h5>
          <ul class="ve-footer-links">
            <li v-for="link in serviceLinks" :key="link.label">
              <router-link :to="link.url || '#'">{{ link.label }}</router-link>
            </li>
          </ul>
        </div>
        <div class="col-12 col-sm-6 col-lg-3 mb-50">
          <h5 class="ve-footer-title">Get In Touch</h5>
          <ul class="ve-footer-contact">
            <li><i class="fa fa-map-marker"></i> {{ footer.contactAddress || company.address || 'Available Worldwide' }}</li>
            <li><i class="fa fa-phone"></i> {{ footer.contactPhone || company.phone || '+XXX XXX XXXX' }}</li>
            <li><i class="fa fa-envelope"></i> {{ footer.contactEmail || company.email || 'hello@alpharkingenterprise.com' }}</li>
            <li><i class="fa fa-clock-o"></i> {{ footer.contactHours || company.hours || 'Mon-Fri, 9am - 6pm' }}</li>
          </ul>
        </div>
      </div>
    </div>
    <div class="ve-footer-bottom">
      <div class="container">
        <div class="ve-footer-bottom-inner">
          <p>Copyright &copy; {{ year }} {{ company.name || 'AlpharKing Enterprise' }}. All Rights Reserved.</p>
          <ul>
            <li v-for="link in policies" :key="link.label">
              <router-link :to="link.url || '#'">{{ link.label }}</router-link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '@/api'

const year = new Date().getFullYear()
const defaultQuickLinks = [
  { label: 'Home', url: '/' },
  { label: 'About', url: '/about.html' },
  { label: 'Services', url: '/services.html' },
  { label: 'Blog', url: '/post.html' },
  { label: 'Contact', url: '/contact.html' }
]
const defaultServiceLinks = [
  { label: 'Blockchain Development', url: '/services.html' },
  { label: 'Smart Contracts', url: '/services.html' },
  { label: 'Web3 Solutions', url: '/services.html' },
  { label: 'Tokenization', url: '/services.html' }
]
const defaultPolicies = [
  { label: 'Privacy Policy', url: '#' },
  { label: 'Terms of Service', url: '#' }
]

const footer = ref({})
const company = ref({})
const social = ref({})

const quickLinks = computed(() => footer.value.quickLinks?.length ? footer.value.quickLinks : defaultQuickLinks)
const serviceLinks = computed(() => footer.value.serviceLinks?.length ? footer.value.serviceLinks : defaultServiceLinks)
const policies = computed(() => footer.value.policies?.length ? footer.value.policies : defaultPolicies)

onMounted(async () => {
  try {
    const [fRes, cRes, sRes] = await Promise.all([api.get('/footer'), api.get('/company'), api.get('/social')])
    footer.value = fRes.data || {}
    company.value = cRes.data || {}
    social.value = sRes.data || {}
  } catch {}
})
</script>
