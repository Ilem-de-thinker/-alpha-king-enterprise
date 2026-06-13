<template>
  <div>
    <AppHeader />

    <section class="ve-page-hero" style="background-image:url(/img/bg-img/3.jpg);">
      <div class="ve-page-hero-overlay"></div>
      <div class="container ve-page-hero-content">
        <ul class="ve-breadcrumb"><li><router-link to="/">Home</router-link></li><li class="active">Insights</li></ul>
        <h1>Insights & <span>Resources</span></h1>
      </div>
    </section>

    <section class="ve-section">
      <div class="container">
        <div class="row">
          <div class="col-12 col-lg-8">
            <!-- Search & Filters -->
            <div class="ve-search-box" style="margin-bottom:30px;">
              <input v-model="searchQuery" type="text" placeholder="Search posts..." @input="debouncedSearch" />
              <button @click="fetchPosts"><i class="fa fa-search"></i></button>
            </div>

            <!-- Posts Grid -->
            <div class="row" v-if="posts.length">
              <div class="col-12 col-md-6" v-for="p in posts" :key="p.id">
                <div class="ve-insight-card" style="margin-bottom:30px;">
                  <div class="ve-insight-img bg-img" :style="{ backgroundImage: 'url(' + p.featuredImage + ')' }"></div>
                  <div class="ve-insight-body">
                    <span class="ve-insight-cat">{{ p.category }}</span>
                    <h5><router-link :to="'/single-post/' + p.slug">{{ p.title }}</router-link></h5>
                    <p>{{ p.excerpt }}</p>
                    <div class="ve-insight-meta">
                      <span><i class="fa fa-calendar"></i> {{ formatDate(p.publishedAt) }}</span>
                      <span><i class="fa fa-clock-o"></i> {{ p.readTime }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <p v-else class="empty-state">No posts found.</p>

            <!-- Pagination -->
            <div class="ve-pagination" v-if="totalPages > 1">
              <a v-for="pg in totalPages" :key="pg" :class="{ active: pg === page }" @click="goToPage(pg)">{{ pg }}</a>
            </div>
          </div>

          <!-- Sidebar -->
          <div class="col-12 col-lg-4">
            <aside class="ve-sidebar">
              <div class="ve-sidebar-widget">
                <h5 class="ve-sidebar-title">Categories</h5>
                <ul class="ve-cat-list">
                  <li v-for="c in categories" :key="c.id">
                    <a @click="filterByCategory(c.name)">{{ c.name }} <span>{{ c.postCount }}</span></a>
                  </li>
                </ul>
              </div>
              <div class="ve-sidebar-widget">
                <h5 class="ve-sidebar-title">Tags</h5>
                <div class="ve-tags">
                  <a v-for="t in tags" :key="t.id" @click="searchQuery = t.name; fetchPosts()">{{ t.name }}</a>
                </div>
              </div>
              <div class="ve-sidebar-widget">
                <h5 class="ve-sidebar-title">Recent Posts</h5>
                <div class="ve-recent-post" v-for="rp in recentPosts" :key="rp.id">
                  <div class="ve-rp-img bg-img" :style="{ backgroundImage: 'url(' + rp.featuredImage + ')' }"></div>
                  <div>
                    <router-link :to="'/single-post/' + rp.slug">{{ rp.title }}</router-link>
                    <span><i class="fa fa-calendar"></i> {{ formatDate(rp.publishedAt) }}</span>
                  </div>
                </div>
              </div>
            </aside>
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

const posts = ref([])
const categories = ref([])
const tags = ref([])
const recentPosts = ref([])
const page = ref(1)
const totalPages = ref(1)
const searchQuery = ref('')
const categoryFilter = ref('')
let debounceTimer = null

function debouncedSearch() {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => { page.value = 1; fetchPosts() }, 400)
}

function filterByCategory(name) { categoryFilter.value = name; page.value = 1; fetchPosts() }

function goToPage(pg) { page.value = pg; fetchPosts() }

function formatDate(d) {
  if (!d) return ''
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

async function fetchPosts() {
  try {
    const params = { page: page.value, limit: 6 }
    if (searchQuery.value) params.search = searchQuery.value
    if (categoryFilter.value) params.category = categoryFilter.value
    const { data } = await api.get('/posts', { params })
    const list = data.results || (Array.isArray(data) ? data : (data.posts || data.data || []))
    posts.value = list
    totalPages.value = data.totalPages || Math.ceil((data.count || data.total || list.length) / 6) || 1
  } catch { posts.value = [] }
}

onMounted(async () => {
  try {
    const [catRes, tagRes, recentRes] = await Promise.all([
      api.get('/categories'), api.get('/tags'), api.get('/posts?limit=5')
    ])
    categories.value = catRes.data.results || (Array.isArray(catRes.data) ? catRes.data : [])
    tags.value = tagRes.data.results || (Array.isArray(tagRes.data) ? tagRes.data : [])
    const rd = recentRes.data
    recentPosts.value = rd.results ? rd.results.slice(0,5) : (Array.isArray(rd) ? rd.slice(0,5) : (rd.posts || rd.data || []).slice(0,5))
  } catch {}
  fetchPosts()
})
</script>
