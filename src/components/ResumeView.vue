<template>
  <article class="resume-view">
    <div class="resume-page shadow-sm">
      <div class="resume-page__accent-bar" aria-hidden="true"></div>

      <header class="resume-page__header">
        <div class="resume-page__identity">
          <h1 class="resume-page__name">{{ resume.name }}</h1>
          <p class="resume-page__title">{{ resume.title }}</p>
        </div>
        <p class="resume-page__contact">
          <span>{{ resume.contact.location }}</span>
          <span class="resume-page__contact-sep" aria-hidden="true">|</span>
          <a :href="`tel:${phoneHref}`" class="resume-page__link">{{ resume.contact.phone }}</a>
          <span class="resume-page__contact-sep" aria-hidden="true">|</span>
          <a :href="`mailto:${resume.contact.email}`" class="resume-page__link">{{ resume.contact.email }}</a>
        </p>
      </header>

      <div class="resume-page__body">
        <section class="resume-section resume-section--experience">
          <h2 class="resume-section__heading">Experience</h2>
          <div
            v-for="(job, i) in resume.experience"
            :key="'exp-' + i"
            class="resume-entry"
          >
            <div class="resume-entry__head">
              <p class="resume-entry__primary mb-0">
                <span class="resume-entry__org">{{ job.company }}</span>
                <span class="resume-entry__sep"> – </span>
                <span class="resume-entry__role">{{ job.role }}</span>
              </p>
              <p class="resume-entry__period mb-0">{{ job.period }}</p>
            </div>
            <ul class="resume-entry__list">
              <li v-for="(bullet, j) in job.bullets" :key="'exp-' + i + '-b-' + j">{{ bullet }}</li>
            </ul>
          </div>
        </section>

        <aside class="resume-page__aside">
          <p class="resume-page__summary">{{ resume.summary }}</p>

          <section class="resume-section resume-section--education">
            <h2 class="resume-section__heading">Education</h2>
            <div
              v-for="(edu, i) in resume.education"
              :key="'edu-' + i"
              class="resume-entry"
            >
              <div class="resume-entry__head">
                <p class="resume-entry__primary mb-0">
                  <span class="resume-entry__org">{{ edu.institution }}</span>
                  <span class="resume-entry__sep"> – </span>
                  <span class="resume-entry__role">{{ edu.credential }}</span>
                </p>
                <p class="resume-entry__period mb-0">{{ edu.period }}</p>
              </div>
              <p class="resume-entry__details mb-0">{{ edu.details }}</p>
            </div>
          </section>

          <section class="resume-section resume-section--skills">
            <h2 class="resume-section__heading">Skills</h2>
            <ul class="resume-skills">
              <li v-for="(skill, i) in resume.skills" :key="'skill-' + i">
                <strong>{{ skill.label }}:</strong> {{ skill.text }}
              </li>
            </ul>
          </section>
        </aside>
      </div>
    </div>
  </article>
</template>

<script>
import { RESUME } from '@/constants/resume'

export default {
  name: 'ResumeView',
  data () {
    return {
      resume: RESUME
    }
  },
  computed: {
    phoneHref () {
      return String(this.resume.contact.phone).replace(/[^\d+]/g, '')
    }
  }
}
</script>

<style scoped>
.resume-view {
  display: flex;
  justify-content: center;
  width: 100%;
  padding: clamp(0.75rem, 2.5vh, 1.5rem) clamp(0.75rem, 3vw, 2rem) clamp(1.25rem, 3vh, 2rem);
}

.resume-page {
  --resume-accent: #3d9a49;
  --resume-accent-soft: color-mix(in srgb, var(--resume-accent) 14%, transparent);
  --resume-surface: var(--vido-bg-panel, #ffffff);
  --resume-text: var(--vido-text-primary, #2b2b2b);
  --resume-text-muted: var(--vido-text-muted, #6b7280);
  --resume-text-secondary: var(--vido-text-secondary, #4b5563);
  --resume-border: var(--vido-border-default, #e5e7eb);
  --resume-link: var(--vido-accent, #2563eb);
  --resume-pad-x: clamp(1.75rem, 5vw, 3rem);
  --resume-pad-top: 1.5rem;
  --resume-pad-bottom: 1.85rem;
  --resume-section-gap: 1.15rem;

  width: 100%;
  max-width: 100%;
  background: var(--resume-surface);
  color: var(--resume-text);
  border: 1px solid var(--resume-border);
  border-radius: 0.35rem;
  overflow: hidden;
  font-family: Inter, 'Segoe UI', system-ui, -apple-system, sans-serif;
  line-height: 1.45;
}

html[data-bs-theme='dark'] .resume-page {
  --resume-accent: #5cb968;
}

html[data-theme='mint'] .resume-page,
html[data-theme='slate'] .resume-page,
html[data-theme='lilac'] .resume-page,
html[data-theme='creator'] .resume-page,
html[data-theme='default'] .resume-page {
  --resume-accent: color-mix(in srgb, var(--vido-accent) 55%, #3d9a49);
}

.resume-page__accent-bar {
  height: 0.55rem;
  background: var(--resume-accent);
}

.resume-page__header {
  padding: var(--resume-pad-top) var(--resume-pad-x) 0;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-end;
  gap: 1.5rem 2rem;
}

.resume-page__identity {
  min-width: 0;
}

.resume-page__body {
  display: grid;
  grid-template-columns: minmax(0, 1.65fr) minmax(0, 1fr);
  gap: clamp(1.5rem, 3vw, 2.5rem);
  align-items: start;
  padding: var(--resume-section-gap) var(--resume-pad-x) var(--resume-pad-bottom);
}

.resume-page__body .resume-section {
  padding: 0;
}

.resume-page__aside {
  display: flex;
  flex-direction: column;
  gap: var(--resume-section-gap);
  border-left: 1px solid var(--resume-border);
  padding-left: clamp(1rem, 2vw, 1.5rem);
}

.resume-page__name {
  margin: 0;
  font-size: clamp(1.65rem, 3.5vw, 2.15rem);
  font-weight: 800;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--resume-text);
  line-height: 1.15;
}

.resume-page__title {
  margin: 0.35rem 0 0;
  font-size: clamp(1.05rem, 2.2vw, 1.25rem);
  font-weight: 600;
  color: var(--resume-accent);
}

.resume-page__contact {
  margin: 0;
  font-size: 0.92rem;
  color: var(--resume-text-muted);
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem 0.5rem;
  align-items: center;
  justify-content: flex-end;
  text-align: right;
  max-width: 22rem;
}

.resume-page__contact-sep {
  color: var(--resume-text-muted);
}

.resume-page__link {
  color: var(--resume-link);
  text-decoration: none;
}

.resume-page__link:hover {
  text-decoration: underline;
}

.resume-page__summary {
  margin: 0;
  font-size: 0.95rem;
  color: var(--resume-text-secondary);
}

.resume-section {
  padding: 0;
}

.resume-section--experience {
  padding: 0;
}

.resume-section--skills {
  padding-bottom: 0;
}

.resume-section__heading {
  margin: 0 0 0.85rem;
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--resume-accent);
}

.resume-entry + .resume-entry {
  margin-top: 1rem;
}

.resume-entry__head {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 0.35rem 1rem;
  margin-bottom: 0.35rem;
}

.resume-entry__primary {
  font-size: 0.95rem;
  color: var(--resume-text);
}

.resume-entry__org {
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.02em;
}

.resume-entry__role {
  font-style: italic;
  color: var(--resume-text-muted);
}

.resume-entry__period {
  font-size: 0.82rem;
  font-weight: 600;
  letter-spacing: 0.03em;
  text-transform: uppercase;
  color: var(--resume-text-muted);
  white-space: nowrap;
}

.resume-entry__list {
  margin: 0;
  padding-left: 1.15rem;
  color: var(--resume-text-secondary);
  font-size: 0.93rem;
}

.resume-entry__list li + li {
  margin-top: 0.2rem;
}

.resume-entry__details {
  font-size: 0.93rem;
  color: var(--resume-text-secondary);
}

.resume-skills {
  margin: 0;
  padding-left: 1.15rem;
  font-size: 0.93rem;
  color: var(--resume-text-secondary);
}

.resume-skills li {
  break-inside: avoid;
  margin-bottom: 0.55rem;
}

.resume-skills strong {
  color: var(--resume-text);
  font-weight: 700;
}

@media (max-width: 519px) {
  .resume-page__header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }

  .resume-page__contact {
    justify-content: flex-start;
    text-align: left;
    max-width: none;
  }

  .resume-page__body {
    grid-template-columns: 1fr;
  }

  .resume-page__aside {
    border-left: none;
    padding-left: 0;
  }

  .resume-entry__head {
    flex-direction: column;
    align-items: flex-start;
  }
}

@media (min-width: 768px) {
  .resume-view {
    padding-left: clamp(1rem, 3vw, 2rem);
    padding-right: clamp(1rem, 3vw, 2rem);
  }

  .resume-page {
    --resume-pad-x: clamp(2rem, 4vw, 3rem);
  }
}

@media (orientation: landscape) and (max-height: 520px) {
  .resume-view {
    padding-top: 0.5rem;
    padding-bottom: 0.75rem;
  }

  .resume-page {
    --resume-pad-top: 1rem;
    --resume-pad-bottom: 1.25rem;
    --resume-section-gap: 0.85rem;
  }

  .resume-page__name {
    font-size: clamp(1.45rem, 3vw, 1.85rem);
  }

  .resume-page__summary {
    margin-top: 0;
  }

  .resume-entry + .resume-entry {
    margin-top: 0.75rem;
  }

  .resume-section__heading {
    margin-bottom: 0.6rem;
  }
}
</style>
