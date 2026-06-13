<template>
  <div class="skeleton-wrapper" :class="[type, variant]" v-bind="$attrs">
    <template v-if="type === 'hero-section'">
      <div class="sk-hero">
        <div class="sk-hero-left">
          <div class="sk-block sk-badge"></div>
          <div class="sk-block sk-title"></div>
          <div class="sk-block sk-title short"></div>
          <div class="sk-block sk-text"></div>
          <div class="sk-block sk-text short"></div>
          <div class="sk-row">
            <div class="sk-block sk-btn"></div>
            <div class="sk-block sk-btn"></div>
          </div>
          <div class="sk-row">
            <div class="sk-block sk-stat" v-for="i in 3" :key="i"></div>
          </div>
        </div>
        <div class="sk-hero-right">
          <div class="sk-block sk-img large"></div>
          <div class="sk-block sk-img small"></div>
          <div class="sk-block sk-float"></div>
        </div>
      </div>
    </template>

    <template v-else-if="type === 'section-header'">
      <div class="sk-section-header">
        <div class="sk-block sk-tag"></div>
        <div class="sk-block sk-title"></div>
        <div class="sk-block sk-text"></div>
      </div>
    </template>

    <template v-else-if="type === 'card-grid'">
      <div class="sk-card-grid">
        <div class="sk-card" v-for="i in (count || 3)" :key="i">
          <div class="sk-block sk-icon"></div>
          <div class="sk-block sk-title short"></div>
          <div class="sk-block sk-text"></div>
          <div class="sk-block sk-text short"></div>
        </div>
      </div>
    </template>

    <template v-else-if="type === 'content-split'">
      <div class="sk-content-split">
        <div class="sk-split-left">
          <div class="sk-block sk-img large"></div>
          <div class="sk-block sk-badge"></div>
        </div>
        <div class="sk-split-right">
          <div class="sk-block sk-tag"></div>
          <div class="sk-block sk-title"></div>
          <div class="sk-block sk-text"></div>
          <div class="sk-block sk-text"></div>
          <div class="sk-block sk-text short"></div>
          <div class="sk-block sk-btn"></div>
        </div>
      </div>
    </template>

    <template v-else-if="type === 'counter-grid'">
      <div class="sk-counter-grid">
        <div class="sk-counter" v-for="i in (count || 4)" :key="i">
          <div class="sk-block sk-icon"></div>
          <div class="sk-block sk-title short"></div>
          <div class="sk-block sk-text"></div>
        </div>
      </div>
    </template>

    <template v-else-if="type === 'team-grid'">
      <div class="sk-team-grid">
        <div class="sk-team-member" v-for="i in (count || 4)" :key="i">
          <div class="sk-block sk-avatar"></div>
          <div class="sk-block sk-title short"></div>
          <div class="sk-block sk-text"></div>
          <div class="sk-row">
            <div class="sk-block sk-social"></div>
            <div class="sk-block sk-social"></div>
          </div>
        </div>
      </div>
    </template>

    <template v-else-if="type === 'faq-list'">
      <div class="sk-faq-list">
        <div class="sk-faq-item" v-for="i in (count || 4)" :key="i">
          <div class="sk-block sk-text"></div>
        </div>
      </div>
    </template>

    <template v-else-if="type === 'blog-grid'">
      <div class="sk-blog-grid">
        <div class="sk-blog-card" v-for="i in (count || 3)" :key="i">
          <div class="sk-block sk-img"></div>
          <div class="sk-blog-body">
            <div class="sk-block sk-tag"></div>
            <div class="sk-block sk-title short"></div>
            <div class="sk-block sk-text"></div>
            <div class="sk-row">
              <div class="sk-block sk-text short"></div>
              <div class="sk-block sk-text short"></div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <template v-else-if="type === 'sidebar'">
      <div class="sk-sidebar">
        <div class="sk-sidebar-widget" v-for="i in (count || 3)" :key="i">
          <div class="sk-block sk-title short"></div>
          <div class="sk-block sk-text" v-for="j in 4" :key="j"></div>
        </div>
      </div>
    </template>

    <template v-else-if="type === 'article'">
      <div class="sk-article">
        <div class="sk-block sk-title"></div>
        <div class="sk-block sk-text"></div>
        <div class="sk-block sk-text"></div>
        <div class="sk-block sk-text short"></div>
        <div class="sk-block sk-title short"></div>
        <div class="sk-block sk-text"></div>
        <div class="sk-block sk-text"></div>
        <div class="sk-block sk-text short"></div>
      </div>
    </template>

    <template v-else-if="type === 'contact-cards'">
      <div class="sk-contact-cards">
        <div class="sk-contact-card" v-for="i in (count || 3)" :key="i">
          <div class="sk-block sk-icon"></div>
          <div class="sk-block sk-title short"></div>
          <div class="sk-block sk-text"></div>
        </div>
      </div>
    </template>

    <template v-else-if="type === 'contact-form'">
      <div class="sk-contact-form">
        <div class="sk-block sk-title"></div>
        <div class="sk-block sk-text"></div>
        <div class="sk-row">
          <div class="sk-block sk-input"></div>
          <div class="sk-block sk-input"></div>
        </div>
        <div class="sk-row">
          <div class="sk-block sk-input"></div>
          <div class="sk-block sk-input"></div>
        </div>
        <div class="sk-block sk-input large"></div>
        <div class="sk-block sk-btn"></div>
      </div>
    </template>

    <template v-else-if="type === 'process-steps'">
      <div class="sk-process-steps">
        <div class="sk-process" v-for="i in (count || 3)" :key="i">
          <div class="sk-block sk-step-num"></div>
          <div class="sk-block sk-title short"></div>
          <div class="sk-block sk-text"></div>
          <div class="sk-block sk-text short"></div>
        </div>
      </div>
    </template>

    <template v-else>
      <div class="sk-default">
        <div class="sk-block sk-title" v-if="showTitle"></div>
        <div class="sk-block sk-text" v-for="i in (count || 3)" :key="i" :style="randomWidth(i)"></div>
      </div>
    </template>
  </div>
</template>

<script setup>
const props = defineProps({
  type: { type: String, default: 'text' },
  count: { type: Number, default: null },
  showTitle: { type: Boolean, default: false },
  variant: { type: String, default: '' }
})

const widths = ['60%', '75%', '50%', '85%', '65%', '90%', '55%', '70%']
function randomWidth(i) {
  return { width: widths[(i - 1) % widths.length] }
}
</script>

<style scoped>
.skeleton-wrapper { width: 100%; }
.sk-block { background: linear-gradient(90deg, #e0e0e0 25%, #f0f0f0 50%, #e0e0e0 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite; border-radius: 6px; }
@keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
.sk-row { display: flex; gap: 12px; flex-wrap: wrap; }

.sk-badge { width: 100px; height: 28px; }
.sk-tag { width: 120px; height: 24px; }
.sk-title { width: 100%; height: 32px; margin-bottom: 8px; }
.sk-title.short { width: 65%; }
.sk-text { width: 100%; height: 16px; margin-bottom: 8px; }
.sk-text.short { width: 45%; }
.sk-btn { width: 140px; height: 44px; border-radius: 6px; }
.sk-img { width: 100%; height: 200px; }
.sk-img.large { height: 300px; }
.sk-img.small { width: 60%; height: 180px; }
.sk-icon { width: 52px; height: 52px; border-radius: 12px; }
.sk-avatar { width: 120px; height: 120px; border-radius: 12px; margin-bottom: 12px; }
.sk-float { width: 180px; height: 60px; border-radius: 8px; }
.sk-social { width: 36px; height: 36px; border-radius: 50%; }
.sk-step-num { width: 50px; height: 50px; border-radius: 50%; }
.sk-input { width: 100%; height: 42px; }
.sk-input.large { height: 100px; }
.sk-stat { width: 100px; height: 50px; }

.sk-hero { display: flex; gap: 30px; align-items: center; }
.sk-hero-left { flex: 1; display: flex; flex-direction: column; gap: 12px; }
.sk-hero-right { flex: 1; position: relative; min-height: 400px; }
.sk-hero-right .sk-img.small { position: absolute; bottom: 0; right: 0; }
.sk-hero-right .sk-float { position: absolute; bottom: 30px; left: 30%; }

.sk-card-grid, .sk-team-grid, .sk-blog-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 24px; }
.sk-team-grid { grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); }
.sk-blog-grid { grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); }
.sk-card, .sk-blog-card, .sk-team-member { border: 1px solid #e8e8e8; border-radius: 12px; padding: 24px; display: flex; flex-direction: column; gap: 10px; }
.sk-team-member { align-items: center; text-align: center; }
.sk-blog-body { display: flex; flex-direction: column; gap: 10px; }

.sk-counter-grid { display: flex; justify-content: space-around; gap: 20px; flex-wrap: wrap; }
.sk-counter { display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 20px; min-width: 150px; }

.sk-content-split { display: flex; gap: 40px; align-items: center; }
.sk-split-left { flex: 0 0 45%; display: flex; flex-direction: column; gap: 12px; position: relative; }
.sk-split-left .sk-badge { position: absolute; bottom: 0; right: 0; }
.sk-split-right { flex: 1; display: flex; flex-direction: column; gap: 12px; }

.sk-section-header { display: flex; flex-direction: column; align-items: center; gap: 10px; margin-bottom: 30px; }

.sk-faq-list { display: flex; flex-direction: column; gap: 12px; }
.sk-faq-item { border: 1px solid #e8e8e8; border-radius: 8px; padding: 18px; }

.sk-sidebar { display: flex; flex-direction: column; gap: 24px; }
.sk-sidebar-widget { display: flex; flex-direction: column; gap: 8px; }

.sk-article { display: flex; flex-direction: column; gap: 12px; }

.sk-contact-cards { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 24px; }
.sk-contact-card { border: 1px solid #e8e8e8; border-radius: 12px; padding: 30px; display: flex; flex-direction: column; align-items: center; gap: 10px; text-align: center; }

.sk-contact-form { display: flex; flex-direction: column; gap: 16px; }

.sk-process-steps { display: flex; justify-content: space-between; gap: 16px; flex-wrap: wrap; }
.sk-process { flex: 1; min-width: 200px; display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 20px; }

@media (max-width: 768px) {
  .sk-hero { flex-direction: column; }
  .sk-hero-right { min-height: 250px; width: 100%; }
  .sk-content-split { flex-direction: column; }
  .sk-split-left { flex: none; width: 100%; }
}
</style>
