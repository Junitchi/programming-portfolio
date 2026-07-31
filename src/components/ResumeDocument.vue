<template>
  <div
    class="resume-page"
    :class="{
      'resume-page--landscape': layout === 'landscape',
      'resume-page--portrait': layout === 'portrait',
      'resume-page--export': forExport,
      'shadow-sm': !forExport
    }"
  >
    <div class="resume-page__accent-bar" aria-hidden="true"></div>

    <header class="resume-page__header">
      <div class="resume-page__identity">
        <h1 class="resume-page__name">{{ resume.name }}</h1>
        <p class="resume-page__title">{{ resume.title }}</p>
      </div>
      <p class="resume-page__contact">
        <span>{{ resume.contact.location }}</span>
        <span class="resume-page__contact-sep" aria-hidden="true">|</span>
        <a v-if="!forExport" :href="`tel:${phoneHref}`" class="resume-page__link">{{ resume.contact.phone }}</a>
        <span v-else>{{ resume.contact.phone }}</span>
        <span class="resume-page__contact-sep" aria-hidden="true">|</span>
        <a v-if="!forExport" :href="`mailto:${resume.contact.email}`" class="resume-page__link">{{ resume.contact.email }}</a>
        <span v-else class="resume-page__link-text">{{ resume.contact.email }}</span>
        <span class="resume-page__contact-sep" aria-hidden="true">|</span>
        <a
          v-if="!forExport"
          :href="resume.contact.website"
          class="resume-page__link"
          target="_blank"
          rel="noopener noreferrer"
        >{{ resume.contact.website }}</a>
        <span v-else class="resume-page__link-text">{{ resume.contact.website }}</span>
      </p>
    </header>

    <template v-if="layout === 'landscape'">
      <div class="resume-page__body">
        <div class="resume-page__main">
          <p class="resume-page__summary">{{ resume.summary }}</p>
          <section class="resume-section resume-section--experience">
            <h2 class="resume-section__heading">Experience</h2>
            <div
              v-for="(job, i) in resume.experience"
              :key="'exp-' + i"
              class="resume-entry"
            >
              <div class="resume-entry__head resume-entry__head--stacked">
                <div class="resume-entry__primary">
                  <p class="resume-entry__org mb-0">{{ job.company }}</p>
                  <p class="resume-entry__role mb-0">{{ job.role }}</p>
                </div>
                <p class="resume-entry__period mb-0">{{ job.period }}</p>
              </div>
              <ul class="resume-entry__list">
                <li v-for="(bullet, j) in job.bullets" :key="'exp-' + i + '-b-' + j">{{ bullet }}</li>
              </ul>
            </div>
          </section>
        </div>

        <aside class="resume-page__aside">
          <section class="resume-section resume-section--education">
            <h2 class="resume-section__heading">Education</h2>
            <div
              v-for="(edu, i) in resume.education"
              :key="'edu-' + i"
              class="resume-entry"
            >
              <div class="resume-entry__head resume-entry__head--stacked">
                <div class="resume-entry__primary">
                  <p class="resume-entry__org mb-0">{{ edu.institution }}</p>
                  <p class="resume-entry__role mb-0">{{ edu.credential }}</p>
                </div>
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
    </template>

    <template v-else>
      <div class="resume-page__portrait-content">
      <p class="resume-page__summary resume-page__summary--portrait">{{ resume.summary }}</p>

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
        <ul class="resume-skills resume-skills--portrait">
          <li v-for="(skill, i) in resume.skills" :key="'skill-' + i">
            <strong>{{ skill.label }}:</strong> {{ skill.text }}
          </li>
        </ul>
      </section>
      </div>
    </template>
  </div>
</template>

<script>
import { RESUME } from '@/constants/resume'

export default {
  name: 'ResumeDocument',
  props: {
    layout: {
      type: String,
      default: 'landscape',
      validator: (value) => ['landscape', 'portrait'].includes(value)
    },
    forExport: {
      type: Boolean,
      default: false
    }
  },
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
.resume-page {
  --resume-accent: #3d9a49;
  --resume-surface: var(--vido-bg-panel, #ffffff);
  --resume-text: var(--vido-text-primary, #2b2b2b);
  --resume-text-muted: var(--vido-text-muted, #6b7280);
  --resume-text-secondary: var(--vido-text-secondary, #4b5563);
  --resume-border: var(--vido-border-default, #e5e7eb);
  --resume-link: var(--vido-accent, #2563eb);
  --resume-pad-x: clamp(2.5rem, 7vw, 4rem);
  --resume-pad-top: 2.25rem;
  --resume-pad-bottom: 2.5rem;
  --resume-section-gap: 1.35rem;
  --resume-header-gap: 1.5rem;

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

.resume-page--portrait {
  --resume-pad-x: 3.5rem;
  max-width: 816px;
}

.resume-page--portrait.resume-page {
  border-radius: 0;
}

.resume-page--export {
  --resume-pad-x: 3.5rem;
  --resume-pad-top: 2.25rem;
  --resume-pad-bottom: 2.5rem;
  --resume-section-gap: 1.1rem;
  --resume-header-gap: 1rem;
  --resume-block-gap: 1.1rem;
  border: none;
  border-radius: 0;
  box-shadow: none;
  line-height: 1.4;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  height: 100%;
  min-height: 100%;
  max-height: 100%;
  font-family: 'Segoe UI', Arial, Helvetica, sans-serif;
}

.resume-page--landscape.resume-page--export {
  width: 100%;
  max-width: 100%;
}

.resume-page--portrait.resume-page--export {
  width: 100%;
  max-width: 100%;
}

.resume-page--export .resume-page__accent-bar {
  height: 0.5rem;
}

.resume-page--export .resume-page__name {
  font-size: 1.65rem;
}

.resume-page--export .resume-page__title {
  font-size: 1.1rem;
  margin-top: 0.2rem;
}

.resume-page--export .resume-page__contact {
  font-size: 0.88rem;
}

.resume-page--export .resume-page__summary {
  font-size: 0.9rem;
}

.resume-page--export .resume-page__body {
  flex: 1;
  min-height: 0;
  gap: 1.35rem;
  padding-top: 0.15rem;
  align-items: start;
}

.resume-page--export .resume-page__main,
.resume-page--export .resume-page__aside {
  justify-content: flex-start;
}

.resume-page--export .resume-page__aside {
  padding-left: 1.15rem;
}

.resume-page--export .resume-page__portrait-content {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  gap: var(--resume-block-gap);
  padding-bottom: var(--resume-pad-bottom);
}

.resume-page--export .resume-section__heading {
  font-size: 1rem;
  margin-bottom: 0.7rem;
}

.resume-page--export .resume-entry + .resume-entry {
  margin-top: 0.75rem;
}

.resume-page--export .resume-page__summary,
.resume-page--export .resume-entry__primary,
.resume-page--export .resume-entry__list,
.resume-page--export .resume-entry__details,
.resume-page--export .resume-skills {
  font-size: 0.88rem;
  word-spacing: 0.04em;
}

.resume-page--export .resume-entry__period {
  font-size: 0.8rem;
}

.resume-page--export .resume-entry__list {
  padding-left: 1.05rem;
}

.resume-page--export .resume-entry__list li + li {
  margin-top: 0.12rem;
}

.resume-page--export .resume-skills {
  padding-left: 1.05rem;
}

.resume-page--export .resume-skills li {
  margin-bottom: 0.32rem;
}

.resume-page--export .resume-page__header {
  gap: 0.85rem 1.25rem;
  flex-shrink: 0;
}

.resume-page--export .resume-page__summary--portrait {
  margin: 0;
  padding: 0 var(--resume-pad-x);
}

.resume-page--export.resume-page--portrait .resume-section {
  padding: 0 var(--resume-pad-x);
}

.resume-page--export.resume-page--portrait .resume-section--skills {
  padding-bottom: 0;
}

.resume-page--export .resume-skills--portrait {
  column-gap: 1.25rem;
}

html[data-bs-theme='dark'] .resume-page {
  --resume-accent: #5cb968;
}

html[data-theme='mint'] .resume-page,
html[data-theme='slate'] .resume-page,
html[data-theme='lilac'] .resume-page,
html[data-theme='creator'] .resume-page,
html[data-theme='default'] .resume-page,
html[data-theme='light'] .resume-page,
html[data-theme='oat'] .resume-page,
html[data-theme='family'] .resume-page {
  --resume-accent: var(--vido-accent);
}

.resume-page__accent-bar {
  height: 0.55rem;
  background: var(--resume-accent);
}

.resume-page__header {
  padding: var(--resume-pad-top) var(--resume-pad-x) var(--resume-header-gap);
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-end;
  gap: 1.5rem 2rem;
}

.resume-page--portrait .resume-page__header {
  flex-direction: column;
  align-items: flex-start;
  gap: 0.65rem;
  padding-bottom: 0.5rem;
}

.resume-page__identity {
  min-width: 0;
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

.resume-page--portrait .resume-page__name {
  font-size: 2.15rem;
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

.resume-page--portrait .resume-page__contact {
  justify-content: flex-start;
  text-align: left;
  max-width: none;
}

.resume-page__contact-sep {
  color: var(--resume-text-muted);
}

.resume-page__link,
.resume-page__link-text {
  color: var(--resume-link);
  text-decoration: none;
}

.resume-page__link:hover {
  text-decoration: underline;
}

.resume-page__body {
  display: grid;
  grid-template-columns: minmax(0, 1.65fr) minmax(0, 1fr);
  gap: clamp(1.5rem, 3vw, 2.5rem);
  align-items: start;
  padding: 0 var(--resume-pad-x) var(--resume-pad-bottom);
}

.resume-page__main {
  display: flex;
  flex-direction: column;
  gap: var(--resume-section-gap);
  min-width: 0;
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

.resume-page__summary {
  margin: 0;
  font-size: 0.95rem;
  color: var(--resume-text-secondary);
}

.resume-page__portrait-content {
  display: flex;
  flex-direction: column;
  gap: var(--resume-section-gap);
  padding-bottom: var(--resume-pad-bottom);
}

.resume-page__summary--portrait {
  margin: var(--resume-section-gap) 0 0;
  padding: 0 var(--resume-pad-x);
}

.resume-page--portrait .resume-section {
  padding: 0 var(--resume-pad-x);
}

.resume-page--portrait .resume-section--skills {
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

.resume-entry__head--stacked {
  flex-wrap: nowrap;
  align-items: flex-start;
}

.resume-entry__head--stacked .resume-entry__primary {
  flex: 1;
  min-width: 0;
}

.resume-entry__head--stacked .resume-entry__org,
.resume-entry__head--stacked .resume-entry__role {
  display: block;
}

.resume-entry__head--stacked .resume-entry__role {
  margin-top: 0.08rem;
}

.resume-entry__head--stacked .resume-entry__period {
  flex-shrink: 0;
  margin-left: 1rem;
  text-align: right;
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

.resume-skills--portrait {
  columns: 2;
  column-gap: 2rem;
}

.resume-skills li {
  break-inside: avoid;
  margin-bottom: 0.55rem;
}

.resume-skills strong {
  color: var(--resume-text);
  font-weight: 700;
}

@media (max-width: 767px) {
  .resume-page--landscape,
  .resume-page--portrait {
    --resume-pad-x: 1.15rem;
  }

  .resume-entry__head--stacked {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.2rem;
  }

  .resume-entry__head--stacked .resume-entry__period {
    margin-left: 0;
    text-align: left;
    white-space: normal;
  }

  .resume-entry__head:not(.resume-entry__head--stacked) {
    flex-direction: column;
    align-items: flex-start;
  }

  .resume-entry__head:not(.resume-entry__head--stacked) .resume-entry__primary {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.1rem;
  }

  .resume-entry__head:not(.resume-entry__head--stacked) .resume-entry__sep {
    display: none;
  }

  .resume-entry__head:not(.resume-entry__head--stacked) .resume-entry__org,
  .resume-entry__head:not(.resume-entry__head--stacked) .resume-entry__role {
    display: block;
  }

  .resume-skills--portrait {
    columns: 1;
  }
}

@media (max-width: 519px) {
  .resume-page--landscape .resume-page__header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }

  .resume-page--landscape .resume-page__contact {
    justify-content: flex-start;
    text-align: left;
    max-width: none;
  }

  .resume-page--landscape .resume-page__body {
    grid-template-columns: 1fr;
  }

  .resume-page--landscape .resume-page__aside {
    border-left: none;
    padding-left: 0;
  }
}

@media (min-width: 768px) {
  .resume-page--landscape {
    --resume-pad-x: clamp(2.75rem, 5.5vw, 4rem);
  }
}

@media (orientation: landscape) and (max-height: 520px) {
  .resume-page--landscape {
    --resume-pad-top: 1rem;
    --resume-pad-bottom: 1.25rem;
    --resume-section-gap: 0.85rem;
    --resume-header-gap: 1rem;
  }

  .resume-page--landscape .resume-page__name {
    font-size: clamp(1.45rem, 3vw, 1.85rem);
  }

  .resume-entry + .resume-entry {
    margin-top: 0.75rem;
  }

  .resume-section__heading {
    margin-bottom: 0.6rem;
  }
}
</style>
