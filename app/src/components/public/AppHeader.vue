
<template>
  <header class="ve-header" :class="{ scrolled: scrolled }">
    <div class="container-fluid ve-nav-wrap">
      <div class="ve-logo">
        <router-link to="/">
          <span class="ve-logo-icon">{{ company.logo || 'AK' }}</span>
          <span class="ve-logo-text">{{ company.name || 'Alpharking' }}</span>
        </router-link>
      </div>
      <nav class="ve-nav">
        <ul>
          <li v-for="item in displayNavItems" :key="item.id" :class="{ 'has-drop': item.children?.length }">
            <router-link v-if="item.url && !item.children?.length" :to="item.url" active-class="active">{{ item.label }}</router-link>
            <a v-else-if="item.children?.length" href="#">{{ item.label }} <i class="fa fa-angle-down"></i></a>
            <router-link v-else :to="item.url || '#'" active-class="active">{{ item.label }}</router-link>
            <ul v-if="item.children?.length" class="ve-dropdown">
              <li v-for="child in item.children" :key="child.id">
                <router-link :to="child.url || '#'">{{ child.label }}</router-link>
              </li>
            </ul>
          </li>
        </ul>
      </nav>
      <div class="ve-nav-cta">
        <router-link to="/contact.html" class="ve-cta-btn">Start Your Project <i class="fa fa-arrow-right"></i></router-link>
      </div>
      <button class="ve-toggler" @click="mobileOpen = !mobileOpen">
        <span></span><span></span><span></span>
      </button>
    </div>
    <div class="ve-mobile-menu" :class="{ open: mobileOpen }">
      <ul>
        <li v-for="item in mobileNavFlat" :key="item.id">
          <router-link :to="item.url || '#'" @click="mobileOpen = false">{{ item.label }}</router-link>
        </li>
      </ul>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, computed, onBeforeUnmount } from 'vue'
import api from '@/api'

const scrolled = ref(false)
const mobileOpen = ref(false)
const company = ref({})
const navItems = ref([])

const defaultNavItems = [
  { id: '1', label: 'Home', url: '/', children: [] },
  { id: '2', label: 'About', url: '/about.html', children: [] },
  { id: '3', label: 'Services', url: '/services.html', children: [] },
  { id: '4', label: 'Blog', url: '/post.html', children: [] },
  { id: '5', label: 'Contact', url: '/contact.html', children: [] }
]

const displayNavItems = computed(() => navItems.value.length ? navItems.value : defaultNavItems)

function onScroll() { scrolled.value = window.scrollY > 50 }
onMounted(async () => {
  window.addEventListener('scroll', onScroll)
  try {
    const [navRes, companyRes] = await Promise.all([api.get('/nav'), api.get('/company')])
    const flat = Array.isArray(navRes.data) ? navRes.data : []
    const topLevel = flat.filter(n => !n.parentId).sort((a,b) => a.order - b.order)
    navItems.value = topLevel.map(t => ({
      ...t,
      children: flat.filter(f => f.parentId === t.id).sort((a,b) => a.order - b.order)
    }))
    company.value = companyRes.data || {}
  } catch {}
})
onBeforeUnmount(() => window.removeEventListener('scroll', onScroll))

const mobileNavFlat = computed(() => {
  const result = []
  for (const item of displayNavItems.value) {
    result.push(item)
    if (item.children) result.push(...item.children)
  }
  return result
})
</script>
