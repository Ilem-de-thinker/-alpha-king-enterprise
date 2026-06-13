<template>
  <div>
    <AppHeader />

    <!-- HERO -->
    <section class="ve-hero">
      <div class="ve-hero-left">
        <span class="ve-hero-badge">{{ hero.badge }}</span>
        <h1 v-html="heroTitleHtml"></h1>
        <p>{{ hero.subtitle }}</p>
        <div class="ve-hero-btns">
          <router-link :to="hero.ctaPrimaryUrl || '/services.html'" class="ve-btn-primary">{{ hero.ctaPrimaryText }}</router-link>
          <router-link :to="hero.ctaSecondaryUrl || '/services.html'" class="ve-btn-ghost">{{ hero.ctaSecondaryText }}</router-link>
        </div>
        <div class="ve-hero-stats">
          <div class="ve-stat" v-for="(s, i) in heroStats" :key="i">
            <strong>{{ s.value }}</strong>
            <span>{{ s.label }}</span>
            <div v-if="i < heroStats.length - 1" class="ve-stat-divider"></div>
          </div>
        </div>
      </div>
      <div class="ve-hero-right">
        <div class="ve-hero-img-main bg-img" :style="{ backgroundImage: 'url(' + hero.mainImage + ')' }"></div>
        <div class="ve-hero-img-accent bg-img" :style="{ backgroundImage: 'url(' + hero.accentImage + ')' }"></div>
        <div class="ve-float-card">
          <i :class="'fa ' + (hero.floatCardIcon || 'fa-line-chart')"></i>
          <div>
            <strong>{{ hero.floatCardValue }}</strong>
            <span>{{ hero.floatCardLabel }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- TRUST BAR -->
    <div class="ve-trust-bar" v-if="trustItems.length">
      <div class="ve-trust-inner">
        <span v-for="(t, i) in trustItems" :key="i"><i :class="'fa ' + t.icon"></i> {{ t.text }}</span>
        <span v-for="(t, i) in trustItems" :key="'dup'+i"><i :class="'fa ' + t.icon"></i> {{ t.text }}</span>
      </div>
    </div>

    <!-- SERVICES -->
    <section class="ve-section ve-services-section">
      <div class="container">
        <div class="ve-section-header text-center">
          <span class="ve-section-tag">Our Services</span>
          <h2>Comprehensive Blockchain <span>Solutions</span></h2>
          <p>From smart contract development to full-scale blockchain infrastructure.</p>
        </div>
        <div class="ve-services-grid">
          <div class="ve-service-card" v-for="s in services" :key="s.id">
            <div class="ve-service-icon"><i :class="s.icon || 'icon-profits'"></i></div>
            <h4>{{ s.title }}</h4>
            <p>{{ s.description }}</p>
            <router-link to="/services.html" class="ve-card-link">Learn more <i class="fa fa-long-arrow-right"></i></router-link>
          </div>
        </div>
      </div>
    </section>

    <!-- WHY US -->
    <section class="ve-section ve-whyus-section" v-if="whyUs.id">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-12 col-lg-5">
            <div class="ve-whyus-img-wrap">
              <div class="ve-whyus-img-main bg-img" :style="{ backgroundImage: 'url(' + whyUs.image + ')' }"></div>
              <div class="ve-whyus-badge">
                <strong>{{ whyUs.badgeValue }}</strong>
                <span>{{ whyUs.badgeLabel }}</span>
              </div>
            </div>
          </div>
          <div class="col-12 col-lg-7">
            <div class="ve-whyus-content">
              <span class="ve-section-tag">{{ whyUs.tag }}</span>
              <h2 v-html="whyUsTitleHtml"></h2>
              <p>{{ whyUs.description }}</p>
              <div class="ve-checklist">
                <div class="ve-check-item" v-for="c in []" :key="c.id">
                  <i :class="'fa ' + (c.icon || 'fa-check-circle')"></i>
                  <div><strong>{{ c.title }}</strong><p>{{ c.description }}</p></div>
                </div>
              </div>
              <router-link :to="whyUs.ctaUrl || '/about.html'" class="ve-btn-primary mt-30">{{ whyUs.ctaText }}</router-link>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- COUNTERS -->
    <section class="ve-counter-section" v-if="counters.length">
      <div class="container">
        <div class="ve-counter-grid">
          <div class="ve-counter-item" v-for="c in counters" :key="c.id">
            <i :class="'fa ' + (c.icon || 'fa-users')"></i>
            <strong>{{ c.number }}</strong><span>{{ c.suffix }}</span>
            <p>{{ c.label }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- FEATURED PROJECTS -->
    <section class="ve-section ve-testimonials-section" v-if="projects.length">
      <div class="container">
        <div class="ve-section-header text-center">
          <span class="ve-section-tag">Featured Projects</span>
          <h2>Our Recent <span>Work</span></h2>
        </div>
        <div class="ve-testi-grid">
          <div class="ve-testi-card" v-for="p in projects" :key="p.id">
            <div class="ve-testi-stars"><i class="fa fa-cube" style="font-size:32px;color:var(--ve-gold);"></i></div>
            <h5 style="color:var(--ve-dark);font-size:18px;margin-bottom:10px;">{{ p.title }}</h5>
            <p>{{ p.description }}</p>
            <div class="ve-testi-author">
              <div class="ve-testi-avatar bg-img" :style="{ backgroundImage: 'url(' + p.image + ')' }" v-if="p.image"></div>
              <div><strong>{{ p.category }}</strong></div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA BANNER -->
    <section class="ve-cta-banner bg-img" :style="{ backgroundImage: 'url(' + cta.backgroundImage + ')' }" v-if="cta.id">
      <div class="ve-cta-overlay"></div>
      <div class="container ve-cta-content">
        <div class="row align-items-center">
          <div class="col-12 col-lg-8">
            <h2 v-html="ctaTitleHtml"></h2>
            <p>{{ cta.description }}</p>
          </div>
          <div class="col-12 col-lg-4 text-lg-right">
            <router-link :to="cta.buttonUrl || '/contact.html'" class="ve-btn-white">{{ cta.buttonText }}</router-link>
          </div>
        </div>
      </div>
    </section>

    <!-- LATEST POSTS -->
    <section class="ve-section ve-insights-section" v-if="latestPosts.length">
      <div class="container">
        <div class="ve-section-header text-center">
          <span class="ve-section-tag">Blog &amp; Resources</span>
          <h2>Insights from the <span>Blockchain Frontier</span></h2>
          <p>Explore the latest developments in blockchain technology and Web3 innovation.</p>
        </div>
        <div class="row">
          <div class="col-12 col-md-4" v-for="p in latestPosts" :key="p.id">
            <div class="ve-insight-card">
              <div class="ve-insight-img bg-img" :style="{ backgroundImage: 'url(' + p.featuredImage + ')' }"></div>
              <div class="ve-insight-body">
                <span class="ve-insight-cat">{{ p.category }}</span>
                <h5><router-link :to="'/single-post/' + p.slug">{{ p.title }}</router-link></h5>
                <p>{{ p.excerpt }}</p>
                <div class="ve-insight-meta">
                  <span><i class="fa fa-calendar"></i> {{ p.publishedAt ? new Date(p.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '' }}</span>
                  <router-link :to="'/single-post/' + p.slug">Read More <i class="fa fa-arrow-right"></i></router-link>
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
import AppHeader from '@/components/public/AppHeader.vue'
import AppFooter from '@/components/public/AppFooter.vue'
import NewsletterForm from '@/components/public/NewsletterForm.vue'

const hero = ref({})
const heroStats = ref([])
const trustItems = ref([])
const services = ref([])
const whyUs = ref({})

const counters = ref([])
const projects = ref([])
const cta = ref({})
const latestPosts = ref([])

const heroTitleHtml = computed(() => {
  if (!hero.value.title) return ''
  const h = hero.value.highlight || ''
  return hero.value.title.replace(h, '<span class="ve-highlight">' + h + '</span>')
})

const whyUsTitleHtml = computed(() => {
  if (!whyUs.value.title) return ''
  const h = whyUs.value.highlight || ''
  return whyUs.value.title.replace(h, '<span>' + h + '</span>')
})

const ctaTitleHtml = computed(() => {
  if (!cta.value.title) return ''
  const h = cta.value.highlight || ''
  return cta.value.title.replace(h, '<span>' + h + '</span>')
})

onMounted(async () => {
  try {
    const [
      heroRes, statsRes, trustRes, servicesRes,
      whyUsRes, countersRes,
      projectsRes, ctaRes, postsRes
    ] = await Promise.all([
      api.get('/hero'), api.get('/hero-stats'), api.get('/trust-bar'), api.get('/services'),
      api.get('/why-us'), api.get('/counters'),
      api.get('/projects'), api.get('/cta-banner'), api.get('/posts?limit=3')
    ])
    hero.value = heroRes.data || {}
    heroStats.value = Array.isArray(statsRes.data) ? statsRes.data : []
    trustItems.value = Array.isArray(trustRes.data) ? trustRes.data : []
    services.value = Array.isArray(servicesRes.data) ? servicesRes.data : []
    whyUs.value = whyUsRes.data || {}
    counters.value = Array.isArray(countersRes.data) ? countersRes.data : []
    projects.value = Array.isArray(projectsRes.data) ? projectsRes.data : []
    cta.value = ctaRes.data || {}
    const pd = postsRes.data
    latestPosts.value = Array.isArray(pd) ? pd.slice(0,3) : (pd.posts || pd.data || []).slice(0,3)
  } catch {}
})
</script>
