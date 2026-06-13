<template>
  <div>
    <AppHeader />

    <!-- Page Hero -->
    <section class="ve-page-hero" :style="{ backgroundImage: 'url(' + about.heroImage + ')' }">
      <div class="ve-page-hero-overlay"></div>
      <div class="container ve-page-hero-content">
        <ul class="ve-breadcrumb"><li><router-link to="/">Home</router-link></li><li class="active">About Us</li></ul>
        <h1>About <span>AlpharKing Enterprise</span></h1>
      </div>
    </section>

    <!-- Company Story -->
    <section class="ve-section" v-if="about.id">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-12 col-lg-5">
            <div class="ve-about-img-stack">
              <div class="ve-about-img-1 bg-img" :style="{ backgroundImage: 'url(' + about.mainImage + ')' }"></div>
              <div class="ve-about-img-2 bg-img" :style="{ backgroundImage: 'url(' + about.secondaryImage + ')' }"></div>
              <div class="ve-about-ribbon">
                <strong>{{ about.badgeValue }}</strong>
                <span>{{ about.badgeLabel }}</span>
              </div>
            </div>
          </div>
          <div class="col-12 col-lg-7">
            <div class="ve-about-text">
              <span class="ve-section-tag">{{ about.tag }}</span>
              <h2 v-html="aboutTitleHtml"></h2>
              <p class="ve-lead">{{ about.leadParagraph }}</p>
              <p v-for="(para, i) in about.bodyParagraphs" :key="i">{{ para }}</p>
              <div class="ve-about-features">
                <div class="ve-af-item" v-for="f in aboutFeatures" :key="f.id">
                  <i :class="'fa ' + (f.icon || 'fa-check')"></i> {{ f.text }}
                </div>
              </div>
              <router-link :to="about.ctaUrl || '/services.html'" class="ve-btn-primary mt-30">{{ about.ctaText }}</router-link>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- MVV -->
    <section class="ve-mvv-section" v-if="mvv.id">
      <div class="container">
        <div class="ve-section-header text-center">
          <span class="ve-section-tag">{{ mvv.tag }}</span>
          <h2 style="color:#fff;">{{ mvv.title }}</h2>
        </div>
        <div class="ve-mvv-grid">
          <div class="ve-mvv-card" v-for="item in mvvItems" :key="item.id">
            <div class="ve-mvv-icon"><i :class="'fa ' + item.icon"></i></div>
            <h4>{{ item.title }}</h4>
            <p>{{ item.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Team -->
    <section class="ve-section ve-team-section" v-if="team.length">
      <div class="container">
        <div class="ve-section-header text-center">
          <span class="ve-section-tag">Our Team</span>
          <h2>Meet the <span>Experts</span></h2>
          <p>Our team of blockchain specialists, engineers, and strategists.</p>
        </div>
        <div class="row">
          <div class="col-12 col-sm-6 col-lg-3" v-for="m in team" :key="m.id">
            <div class="ve-team-card">
              <div class="ve-team-img bg-img" :style="{ backgroundImage: 'url(' + m.image + ')' }"></div>
              <div class="ve-team-info">
                <h5>{{ m.name }}</h5>
                <span>{{ m.role }}</span>
                <div class="ve-team-social">
                  <a v-if="m.linkedin" :href="m.linkedin" target="_blank"><i class="fa fa-linkedin"></i></a>
                  <a v-if="m.twitter" :href="m.twitter" target="_blank"><i class="fa fa-twitter"></i></a>
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
import { ref, computed, onMounted } from 'vue'
import api from '@/api'
import AppHeader from '@/components/AppHeader.vue'
import AppFooter from '@/components/AppFooter.vue'
import NewsletterForm from '@/components/NewsletterForm.vue'

const about = ref({})
const aboutFeatures = ref([])
const mvv = ref({})
const mvvItems = ref([])
const team = ref([])

const aboutTitleHtml = computed(() => {
  if (!about.value.title) return ''
  const h = about.value.highlight || ''
  return about.value.title.replace(h, '<span>' + h + '</span>')
})

onMounted(async () => {
  try {
    const [aRes, afRes, mRes, miRes, tRes] = await Promise.all([
      api.get('/about'), api.get('/about/features'), api.get('/mvv'),
      api.get('/mvv/items'), api.get('/team')
    ])
    about.value = aRes.data || {}
    aboutFeatures.value = Array.isArray(afRes.data) ? afRes.data : []
    mvv.value = mRes.data || {}
    mvvItems.value = Array.isArray(miRes.data) ? miRes.data : []
    team.value = Array.isArray(tRes.data) ? tRes.data : []
  } catch {}
})
</script>
