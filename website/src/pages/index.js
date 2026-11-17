import React from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import styles from './index.module.css';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

// Die Infoblätter sind immer erreichbar.
const infoblaetter = [
  {
    titel: 'Entwicklungsumgebung einrichten',
    beschreibung: 'Node.js, WebStorm und die PowerShell-Einstellung – Schritt für Schritt und mit Prüfung',
    link: '/infoblaetter/einrichten',
  },
  {
    titel: 'Was ist TypeScript – und warum gibt es das?',
    beschreibung: 'Von JavaScript 1995 über die Probleme großer Anwendungen zu TypeScript – und was es kann und nicht kann',
    link: '/infoblaetter/warum-typescript',
  },
  {
    titel: 'Typen: Daten beschreiben',
    beschreibung: 'Interface, Union-Typen, optionale Felder, ?? und ?. – und die häufigsten Compiler-Meldungen übersetzt',
    link: '/infoblaetter/typen',
  },
];

const lernziele = [
  'Daten mit Interfaces, Union-Typen und optionalen Feldern beschreiben',
  'Mit Array-Methoden (filter, map, find, reduce) Listen auswerten',
  'Listen unveränderlich ändern und erklären, warum das wichtig ist',
  'Eine Klasse mit Konstruktor-Attributen und einen asynchronen Datenabruf schreiben',
  'Compiler-Fehlermeldungen lesen und für die Fehlersuche nutzen',
];

function TutorialCard({nummer, titel, stichworte, link}) {
  return (
    <Link to={link} className={styles.card}>
      <span className={styles.cardNummer}>{nummer}</span>
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
            Hier entsteht Schritt für Schritt das Wissen, das du für das
            Frontend-Projekt brauchst: zuerst TypeScript, dann die Arbeit mit
            Angular, Signals und Formularen. Die Tutorials bauen aufeinander
            auf und werden der Reihe nach bearbeitet.
          </p>
          <p>
            Die Infoblätter liefern den fachlichen Hintergrund und lassen sich
            jederzeit nachschlagen. Fang dort an, wenn du deinen Rechner noch
            einrichten musst.
          </p>
        </section>

        <section className={styles.section}>
          <Heading as="h2">Lernziele</Heading>
          <ul className={styles.linkListe}>
            {lernziele.map((z) => (
              <li key={z}>{z}</li>
            ))}
          </ul>
        </section>

        <section className={styles.section}>
          <Heading as="h2">Tutorials</Heading>
          {freigegeben.length > 0 ? (
            <>
              <p>
                Arbeite die Tutorials der Reihe nach ab. Jedes enthält
                Aufgaben, die du abhaken kannst – die Haken bleiben in deinem
                Browser erhalten, solange du dasselbe Gerät benutzt.
              </p>
              <div className={styles.cardGrid}>
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
            </>
          ) : (
            <p>
              <em>
                Die Tutorials werden im Laufe des Schuljahres freigeschaltet.
                Richte bis dahin deinen Rechner ein.
              </em>
            </p>
          )}
        </section>

        <section className={styles.section}>
          <Heading as="h2">Infoblätter</Heading>
          <p>Nachschlagematerial – unabhängig davon, an welchem Tutorial du gerade arbeitest:</p>
          <ul className={styles.linkListe}>
            {infoblaetter.map((item) => (
              <li key={item.titel}>
                <Link to={item.link}>
                  <strong>{item.titel}</strong>
                </Link>
                {' – '}
                {item.beschreibung}
              </li>
            ))}
          </ul>
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
