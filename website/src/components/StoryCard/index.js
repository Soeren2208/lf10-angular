import React, {useState} from 'react';
import styles from './styles.module.css';

/**
 * StoryCard — User Story mit Akzeptanzkriterien als zweiseitige Karteikarte.
 *
 * Nutzung in MDX (ohne Import, siehe src/theme/MDXComponents.js):
 *   <StoryCard
 *     story={<>Als ... möchte ich ..., damit ich ...</>}
 *     criteria={[{id: 'A_1', text: '...'}, ...]}
 *   />
 */
export default function StoryCard({
  story,
  criteria = [],
  frontLabel = 'Vorderseite — die Story',
  backLabel = 'Rückseite — die Akzeptanzkriterien',
}) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div className={styles.wrapper}>
      <div className={styles.card} key={flipped ? 'back' : 'front'}>
        {flipped ? (
          <>
            <div className={styles.label}>{backLabel}</div>
            <table className={styles.criteriaTable}>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Akzeptanzkriterium</th>
                </tr>
              </thead>
              <tbody>
                {criteria.map((c) => (
                  <tr key={c.id}>
                    <td>{c.id}</td>
                    <td>{c.text}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button
              type="button"
              className={styles.flipButton}
              onClick={() => setFlipped(false)}
            >
              ← Zur Vorderseite
            </button>
          </>
        ) : (
          <>
            <div className={styles.label}>{frontLabel}</div>
            <div className={styles.storyText}>{story}</div>
            <button
              type="button"
              className={styles.flipButton}
              onClick={() => setFlipped(true)}
            >
              Karte umdrehen →
            </button>
          </>
        )}
      </div>
    </div>
  );
}
