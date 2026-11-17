import React from 'react';
import styles from './styles.module.css';

/**
 * TaskBadge — zeigt ausgeschrieben die Task aus dem Sprint-Backlog, die in
 * der folgenden Aufgabe bearbeitet wird. Genau das, was ein Entwickler sich
 * beim Griff ins Backlog vornimmt — deshalb der Tasktext, nicht das AC-Kürzel.
 *
 * Nutzung in MDX (ohne Import, siehe src/theme/MDXComponents.js):
 *   <TaskBadge>Ausgabe-DTOs entwerfen</TaskBadge>
 */
export default function TaskBadge({children}) {
  return <div className={styles.badge}>{children}</div>;
}
