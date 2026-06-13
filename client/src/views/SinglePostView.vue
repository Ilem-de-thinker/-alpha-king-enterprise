<template>
  <div>
    <AppHeader />

    <section class="ve-page-hero" :style="{ backgroundImage: 'url(' + (post.featuredImage || '/img/bg-img/3.jpg') + ')' }">
      <div class="ve-page-hero-overlay"></div>
      <div class="container ve-page-hero-content">
        <ul class="ve-breadcrumb"><li><router-link to="/">Home</router-link></li><li><router-link to="/post.html">Insights</router-link></li><li class="active">{{ post.title }}</li></ul>
        <h1>{{ post.title }}</h1>
        <div class="ve-post-meta-hero">
          <span><i class="fa fa-user"></i> {{ post.author }}</span>
          <span><i class="fa fa-calendar"></i> {{ formatDate(post.publishedAt) }}</span>
          <span><i class="fa fa-clock-o"></i> {{ post.readTime }}</span>
          <span><i class="fa fa-folder"></i> {{ post.category }}</span>
        </div>
      </div>
    </section>

    <section class="ve-section">
      <div class="container">
        <div class="row">
          <div class="col-12 col-lg-8">
            <article class="ve-article" v-if="post.id">
              <div class="ve-article-body">
                <p class="ve-article-lead">{{ post.excerpt }}</p>
                <div v-html="post.content"></div>
                <div class="ve-article-tags" v-if="post.tags?.length">
                  <strong>Tags:</strong>
                  <a v-for="t in post.tags" :key="t" class="ve-tag-link">{{ t }}</a>
                </div>
              </div>
            </article>
            <p v-else class="empty-state">Loading post...</p>

            <!-- Comments -->
            <div class="ve-comments-section" v-if="comments.length">
              <h4>Comments ({{ comments.length }})</h4>
              <div class="ve-comment" v-for="c in comments" :key="c.id">
                <div class="ve-comment-avatar bg-img" style="background-image:url(/img/core-img/avatar.png);"></div>
                <div class="ve-comment-body">
                  <div class="ve-comment-meta"><strong>{{ c.name }}</strong><span>{{ formatDate(c.createdAt) }}</span></div>
                  <p>{{ c.content }}</p>
                </div>
              </div>
            </div>

            <!-- Comment Form -->
            <div class="ve-comment-form-wrap">
              <h4>Leave a Comment</h4>
              <form class="ve-contact-form" @submit.prevent="submitComment">
                <div class="ve-form-row">
                  <div class="ve-form-group">
                    <label>Name</label>
                    <input v-model="commentForm.name" type="text" required />
                  </div>
                  <div class="ve-form-group">
                    <label>Email</label>
                    <input v-model="commentForm.email" type="email" required />
                  </div>
                </div>
                <div class="ve-form-group">
                  <label>Comment</label>
                  <textarea v-model="commentForm.content" rows="4" required></textarea>
                </div>
                <p v-if="commentMsg" :style="{ color: commentErr ? '#e53e3e' : '#28a745', fontSize: '14px' }">{{ commentMsg }}</p>
                <button type="submit" class="ve-btn-primary" :disabled="commentSending">{{ commentSending ? 'Posting...' : 'Post Comment' }}</button>
              </form>
            </div>
          </div>

          <!-- Sidebar -->
          <div class="col-12 col-lg-4">
            <aside class="ve-sidebar">
              <div class="ve-sidebar-widget">
                <h5 class="ve-sidebar-title">Categories</h5>
                <ul class="ve-cat-list">
                  <li v-for="c in categories" :key="c.id">
                    <router-link to="/post.html">{{ c.name }} <span>{{ c.postCount }}</span></router-link>
                  </li>
                </ul>
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
              <div class="ve-sidebar-widget">
                <h5 class="ve-sidebar-title">Tags</h5>
                <div class="ve-tags">
                  <router-link v-for="t in tags" :key="t.id" to="/post.html">{{ t.name }}</router-link>
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
import { useRoute } from 'vue-router'
import api from '@/api'
import AppHeader from '@/components/AppHeader.vue'
import AppFooter from '@/components/AppFooter.vue'
import NewsletterForm from '@/components/NewsletterForm.vue'

const route = useRoute()
const post = ref({})
const comments = ref([])
const categories = ref([])
const tags = ref([])
const recentPosts = ref([])
const commentForm = ref({ name: '', email: '', content: '' })
const commentMsg = ref('')
const commentErr = ref(false)
const commentSending = ref(false)

function formatDate(d) {
  if (!d) return ''
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

async function fetchPost() {
  try {
    const slug = route.params.slug
    const { data } = await api.get(slug ? '/posts/' + slug : '/posts/default')
    post.value = data
    if (data.id) {
      const { data: comms } = await api.get('/posts/' + data.id + '/comments')
      comments.value = Array.isArray(comms) ? comms : []
    }
  } catch {}
}

async function submitComment() {
  if (!post.value.id) return
  commentSending.value = true; commentMsg.value = ''; commentErr.value = false
  try {
    await api.post('/posts/' + post.value.id + '/comments', commentForm.value)
    commentMsg.value = 'Comment submitted for approval. Thank you!'
    commentForm.value = { name: '', email: '', content: '' }
  } catch (e) {
    commentErr.value = true
    commentMsg.value = e.response?.data?.message || 'Failed to post comment.'
  } finally { commentSending.value = false }
}

onMounted(async () => {
  try {
    const [catRes, tagRes, recentRes] = await Promise.all([
      api.get('/categories'), api.get('/tags'), api.get('/posts?limit=5')
    ])
    categories.value = Array.isArray(catRes.data) ? catRes.data : []
    tags.value = Array.isArray(tagRes.data) ? tagRes.data : []
    const rd = recentRes.data
    recentPosts.value = Array.isArray(rd) ? rd.slice(0,5) : (rd.posts || rd.data || []).slice(0,5)
  } catch {}
  fetchPost()
})
</script>

<style scoped>
.ve-tag-link { display: inline-block; background: #f0f4f8; color: #4a5568; padding: 4px 12px; border-radius: 20px; font-size: 13px; margin: 2px; text-decoration: none; }
.ve-tag-link:hover { background: #007bff; color: #0d1b2a; }
</style>
