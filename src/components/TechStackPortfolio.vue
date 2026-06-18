<template>
  <div class="tech-stack-portfolio">
    <section
      v-for="group in groups"
      :key="group.id"
      class="mb-5"
    >
      <h4 class="mb-3">{{ group.label }}</h4>
      <div class="row g-3">
        <SkillBadge
          v-for="item in group.items"
          :key="item.name"
          :name="item.name"
          :color="item.color"
        />
      </div>
    </section>
  </div>
</template>

<script>
import { TECH_STACK } from '@/constants/skills'
import SkillBadge from './SkillBadge.vue'

export default {
  name: 'TechStackPortfolio',
  components: { SkillBadge },
  data () {
    return {
      groups: TECH_STACK
    }
  }
}
</script>
