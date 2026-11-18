import React from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import styles from './index.module.css';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

function TutorialCard({nummer, titel, stichworte, link, start = false}) {
  return (
    <Link
      to={link}
      className={start ? `${styles.card} ${styles.cardStart}` : styles.card}>
      <span className={start ? styles.cardMarke : styles.cardNummer}>{nummer}</span>
      <span className={styles.cardTitel}>{titel}</span>
      <span className={styles.cardStichworte}>{stichworte}</span>
    </Link>
  );
}

export default function Home() {
  // Nur die freigegebenen Tutorials - gesteuert ueber tutorials.js
  const {siteConfig} = useDocusaurusContext();
  const freigegeben = siteConfig.customFields.tutorials;

  return (
    <Layout
      title="Angular mit TypeScript"
      description="Lernsituationen LF10 – Fachinformatiker Anwendungsentwicklung">
      <header className={styles.hero}>
        <div className="container">
          <Heading as="h1" className={styles.heroTitle}>
            Angular mit TypeScript
          </Heading>
          <p className={styles.heroSubtitle}>
            Lernsituationen LF10 – Fachinformatiker Anwendungsentwicklung
          </p>
        </div>
      </header>

      <main className="container">
        <section className={styles.section}>
          <Heading as="h2">Worum es geht</Heading>
          <p>
            Hier lernst du Angular kennen, ein Framework für Weboberflächen. Du
            lernst es in drei bis vier aufeinander aufbauenden Schritten. Jeder
            Schritt ist ein Tutorial aus mehreren Arbeitsblättern, die du der
            Reihe nach bearbeitest. Den Anfang macht TypeScript, die Sprache, in
            der Angular-Anwendungen geschrieben werden.
          </p>
        </section>

        <section className={styles.section}>
          <Heading as="h2">So fängst du an</Heading>
          <p>
            Richte zuerst deinen Rechner ein. Danach arbeitest du die Tutorials
            der Reihe nach ab. Jedes enthält Aufgaben, die du abhaken kannst – die
            Haken bleiben in deinem Browser erhalten, solange du dasselbe Gerät
            benutzt.
          </p>
          <div className={styles.cardGrid}>
            <TutorialCard
              start
              nummer="Start"
              titel="Entwicklungsumgebung einrichten"
              stichworte="Node.js · WebStorm · Git"
              link="/vorbereitung/einrichten"
            />
            {freigegeben.map((t) => (
              <TutorialCard
                key={t.id}
                nummer={t.nummer}
                titel={t.titel}
                stichworte={t.stichworte}
                link={`/${t.id}/`}
              />
            ))}
          </div>
          <p className={styles.hinweis}>
            <em>Weitere Tutorials folgen.</em>
          </p>
        </section>

        <section className={styles.section}>
          <Heading as="h2">Infoblätter</Heading>
          <p>
            Infoblätter erklären, was hinter einer Aufgabe steckt: Begriffe,
            Hintergründe und Vergleiche mit Java. Du musst sie nicht vorher
            lesen. Im Arbeitsblatt steht an der passenden Stelle ein Link, wenn
            dir etwas fehlt. Alle Infoblätter findest du im Menü oben unter
            „Infoblätter“.
          </p>
          <p>
            <Link className="button button--secondary" to="/infoblaetter/">
              Zu den Infoblättern
            </Link>
          </p>
        </section>

        <section id="impressum" className={styles.section}>
          <Heading as="h2">Impressum</Heading>
          <p>
            Diese Seite ist Teil einer schulischen Lernsituation im
            Bildungsgang Fachinformatiker/in – Anwendungsentwicklung am
            Schulzentrum Utbremen, Bremen.
          </p>
          <p>
            Verantwortlich im Sinne des § 5 DDG ist das Schulzentrum Utbremen.
            Vollständiges Impressum:{' '}
            <Link to="https://www.szut.de/impressum.html">
              szut.de/impressum.html
            </Link>
          </p>
          <p>
            Diese Seite dient ausschließlich der schulischen Ausbildung und
            verfolgt keine kommerziellen Zwecke.
          </p>
        </section>
      </main>
    </Layout>
  );
}
