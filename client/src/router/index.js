import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/', name: 'Home', component: () => import('@/views/HomeView.vue') },
  { path: '/about.html', name: 'About', component: () => import('@/views/AboutView.vue') },
  { path: '/services.html', name: 'Services', component: () => import('@/views/ServicesView.vue') },
  { path: '/contact.html', name: 'Contact', component: () => import('@/views/ContactView.vue') },
  { path: '/post.html', name: 'Blog', component: () => import('@/views/BlogView.vue') },
  { path: '/single-post.html', name: 'SinglePost', component: () => import('@/views/SinglePostView.vue') },
  { path: '/single-post/:slug', name: 'SinglePostSlug', component: () => import('@/views/SinglePostView.vue') }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() { return { top: 0 } }
})

export default router
