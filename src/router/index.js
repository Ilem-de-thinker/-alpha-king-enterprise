import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes = [
  { path: '/admin/comments', redirect: '/admin' },
  { path: '/admin/why-us-checklist', redirect: '/admin' },
  { path: '/admin/about-features', redirect: '/admin' },
  { path: '/admin/newsletter', redirect: '/admin' },
  {
    path: '/admin/login',
    name: 'Login',
    component: () => import('@/views/admin/auth/LoginView.vue'),
    meta: { guest: true }
  },
  {
    path: '/admin',
    component: () => import('@/components/admin/AdminLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      { path: '', name: 'Dashboard', component: () => import('@/views/admin/dashboard/DashboardView.vue') },
      { path: 'posts', name: 'Posts', component: () => import('@/views/admin/posts/PostListView.vue') },
      { path: 'posts/create', name: 'PostCreate', component: () => import('@/views/admin/posts/PostFormView.vue') },
      { path: 'posts/:slug/edit', name: 'PostEdit', component: () => import('@/views/admin/posts/PostFormView.vue') },
      { path: 'categories', name: 'Categories', component: () => import('@/views/admin/categories/CategoryListView.vue') },
      { path: 'tags', name: 'Tags', component: () => import('@/views/admin/tags/TagListView.vue') },
      { path: 'services', name: 'AdminServices', component: () => import('@/views/admin/services/ServiceListView.vue') },
      { path: 'team', name: 'Team', component: () => import('@/views/admin/team/TeamMemberListView.vue') },
      { path: 'projects', name: 'Projects', component: () => import('@/views/admin/projects/ProjectListView.vue') },
      { path: 'faq', name: 'FAQ', component: () => import('@/views/admin/faq/FaqListView.vue') },
      { path: 'contacts', name: 'Contacts', component: () => import('@/views/admin/contacts/ContactListView.vue') },
      { path: 'hero', name: 'Hero', component: () => import('@/views/admin/hero/HeroEditView.vue') },
      { path: 'hero-stats', name: 'HeroStats', component: () => import('@/views/admin/hero/HeroStatListView.vue') },
      { path: 'trust-bar', name: 'TrustBar', component: () => import('@/views/admin/trust-bar/TrustBarListView.vue') },
      { path: 'counters', name: 'Counters', component: () => import('@/views/admin/counters/CounterListView.vue') },
      { path: 'why-us', name: 'WhyUs', component: () => import('@/views/admin/why-us/WhyUsEditView.vue') },
      { path: 'cta-banner', name: 'CtaBanner', component: () => import('@/views/admin/cta-banner/CtaBannerEditView.vue') },
      { path: 'about', name: 'AdminAbout', component: () => import('@/views/admin/about/AboutEditView.vue') },
      { path: 'mvv', name: 'MVV', component: () => import('@/views/admin/mvv/MvvEditView.vue') },
      { path: 'mvv-items', name: 'MVVItems', component: () => import('@/views/admin/mvv/MvvItemListView.vue') },
      { path: 'process', name: 'Process', component: () => import('@/views/admin/process/ProcessStepListView.vue') },
      { path: 'newsletter-section', name: 'NewsletterSection', component: () => import('@/views/admin/newsletter-section/NewsletterSectionEditView.vue') },
      { path: 'footer', name: 'Footer', component: () => import('@/views/admin/footer/FooterEditView.vue') },
      { path: 'nav', name: 'Nav', component: () => import('@/views/admin/nav/NavEditView.vue') },
      { path: 'company', name: 'Company', component: () => import('@/views/admin/company/CompanyEditView.vue') },
      { path: 'social', name: 'Social', component: () => import('@/views/admin/social/SocialEditView.vue') }
    ]
  },
  { path: '/', name: 'Home', component: () => import('@/views/public/HomeView.vue') },
  { path: '/about', name: 'About', component: () => import('@/views/public/AboutView.vue') },
  { path: '/services', name: 'Services', component: () => import('@/views/public/ServicesView.vue') },
  { path: '/contact', name: 'Contact', component: () => import('@/views/public/ContactView.vue') },
  { path: '/blog', name: 'Blog', component: () => import('@/views/public/BlogView.vue') },
  { path: '/single-post', name: 'SinglePost', component: () => import('@/views/public/SinglePostView.vue') },
  { path: '/single-post/:slug', name: 'SinglePostSlug', component: () => import('@/views/public/SinglePostView.vue') }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() { return { top: 0 } }
})

router.beforeEach((to, from, next) => {
  const auth = useAuthStore()
  if (to.meta.requiresAuth && !auth.isAuthenticated) next({ name: 'Login' })
  else if (to.meta.guest && auth.isAuthenticated) next({ name: 'Dashboard' })
  else next()
})

export default router
