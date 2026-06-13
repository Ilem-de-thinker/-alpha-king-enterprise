import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/auth/LoginView.vue'),
    meta: { guest: true }
  },
  {
    path: '/',
    component: () => import('@/components/AdminLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      { path: '', name: 'Dashboard', component: () => import('@/views/dashboard/DashboardView.vue') },
      { path: 'posts', name: 'Posts', component: () => import('@/views/posts/PostListView.vue') },
      { path: 'posts/create', name: 'PostCreate', component: () => import('@/views/posts/PostFormView.vue') },
      { path: 'posts/:id/edit', name: 'PostEdit', component: () => import('@/views/posts/PostFormView.vue') },
      { path: 'comments', name: 'Comments', component: () => import('@/views/comments/CommentListView.vue') },
      { path: 'categories', name: 'Categories', component: () => import('@/views/categories/CategoryListView.vue') },
      { path: 'tags', name: 'Tags', component: () => import('@/views/tags/TagListView.vue') },
      { path: 'services', name: 'Services', component: () => import('@/views/services/ServiceListView.vue') },
      { path: 'team', name: 'Team', component: () => import('@/views/team/TeamMemberListView.vue') },
      { path: 'projects', name: 'Projects', component: () => import('@/views/projects/ProjectListView.vue') },
      { path: 'faq', name: 'FAQ', component: () => import('@/views/faq/FaqListView.vue') },
      { path: 'contacts', name: 'Contacts', component: () => import('@/views/contacts/ContactListView.vue') },
      { path: 'newsletter', name: 'Newsletter', component: () => import('@/views/newsletter/NewsletterListView.vue') },
      { path: 'hero', name: 'Hero', component: () => import('@/views/hero/HeroEditView.vue') },
      { path: 'hero-stats', name: 'HeroStats', component: () => import('@/views/hero/HeroStatListView.vue') },
      { path: 'trust-bar', name: 'TrustBar', component: () => import('@/views/trust-bar/TrustBarListView.vue') },
      { path: 'counters', name: 'Counters', component: () => import('@/views/counters/CounterListView.vue') },
      { path: 'why-us', name: 'WhyUs', component: () => import('@/views/why-us/WhyUsEditView.vue') },
      { path: 'why-us-checklist', name: 'WhyUsChecklist', component: () => import('@/views/why-us/WhyUsChecklistListView.vue') },
      { path: 'cta-banner', name: 'CtaBanner', component: () => import('@/views/cta-banner/CtaBannerEditView.vue') },
      { path: 'about', name: 'About', component: () => import('@/views/about/AboutEditView.vue') },
      { path: 'about-features', name: 'AboutFeatures', component: () => import('@/views/about/AboutFeatureListView.vue') },
      { path: 'mvv', name: 'MVV', component: () => import('@/views/mvv/MvvEditView.vue') },
      { path: 'mvv-items', name: 'MVVItems', component: () => import('@/views/mvv/MvvItemListView.vue') },
      { path: 'process', name: 'Process', component: () => import('@/views/process/ProcessStepListView.vue') },
      { path: 'newsletter-section', name: 'NewsletterSection', component: () => import('@/views/newsletter-section/NewsletterSectionEditView.vue') },
      { path: 'footer', name: 'Footer', component: () => import('@/views/footer/FooterEditView.vue') },
      { path: 'nav', name: 'Nav', component: () => import('@/views/nav/NavEditView.vue') },
      { path: 'company', name: 'Company', component: () => import('@/views/company/CompanyEditView.vue') },
      { path: 'social', name: 'Social', component: () => import('@/views/social/SocialEditView.vue') }
    ]
  }
]

const router = createRouter({
  history: createWebHistory('/admin/'),
  routes
})

router.beforeEach((to, from, next) => {
  const auth = useAuthStore()
  if (to.meta.requiresAuth && !auth.isAuthenticated) next({ name: 'Login' })
  else if (to.meta.guest && auth.isAuthenticated) next({ name: 'Dashboard' })
  else next()
})

export default router
