import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './index.module.css';

function HomePage() {
  const logoUrl = useBaseUrl('/img/logo.png');

  return (
    <Layout
      title="Amplifiers"
      description="Composable specialist skills for agent workflows"
    >
      <main className={styles.page}>
        <section className={styles.hero}>
          <div className={styles.heroGlow} />
          <div className={styles.heroInner}>
            <div className={styles.heroCopy}>
              <div className={styles.kicker}>Agent Skills library</div>
              <h1>Attach the right specialist to the task.</h1>
              <p>
                Amplifiers packages specialist instructions, deep references,
                and optional helpers the way modern skill runtimes expect:
                one skill per folder, one clear runtime entrypoint, and deeper
                material loaded only when needed. The model follows the Agent
                Skills pattern used across Anthropic, OpenAI Codex, and related
                tooling.
              </p>
              <div className={styles.actions}>
                <Link className="button button--primary button--lg" to="/docs/intro">
                  Read the docs
                </Link>
                <Link className="button button--secondary button--lg" to="/docs/catalog/skills">
                  Browse skills
                </Link>
              </div>
            </div>
            <div className={styles.heroPanel}>
              <img
                className={styles.logo}
                src={logoUrl}
                alt="Amplifiers logo"
              />
              <ul className={styles.signalList}>
                <li>Runtime skills live in <code>skills/</code></li>
                <li>Recurring combos live in <code>stacks/</code></li>
                <li>Deep material lives in each skill&apos;s <code>references/</code></li>
                <li>Public docs site lives in <code>docs/</code></li>
              </ul>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <span>Repository model</span>
            <h2>One canonical skill layer. Everything else supports it.</h2>
          </div>
          <div className={styles.grid}>
            <article className={styles.card}>
              <h3>Skills</h3>
              <p>Attachable specialists and modifiers that directly shape runtime work.</p>
              <Link to="/docs/catalog/skills">See the skill catalog</Link>
            </article>
            <article className={styles.card}>
              <h3>Stacks</h3>
              <p>Reusable combinations for delivery types that repeatedly need multiple specialists.</p>
              <Link to="/docs/catalog/stacks">See the stack catalog</Link>
            </article>
            <article className={styles.card}>
              <h3>Skill packages</h3>
              <p>Each skill keeps its own references, scripts, assets, and optional runtime metadata.</p>
              <Link to="/docs/catalog/skill_packages">See the package anatomy</Link>
            </article>
          </div>
        </section>

        <section className={styles.sectionAlt}>
          <div className={styles.sectionHeader}>
            <span>How to work with it</span>
            <h2>Start from the delivery, then attach the specialists you need.</h2>
          </div>
          <div className={styles.steps}>
            <div className={styles.step}>
              <strong>1</strong>
              <p>Choose a single skill when the task is narrow and needs one clear specialist.</p>
            </div>
            <div className={styles.step}>
              <strong>2</strong>
              <p>Attach multiple skills when the delivery spans design, writing, and code.</p>
            </div>
            <div className={styles.step}>
              <strong>3</strong>
              <p>Reuse a stack when the same combination keeps showing up in daily work.</p>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}

export default HomePage;
