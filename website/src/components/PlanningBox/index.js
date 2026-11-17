import React from 'react';
import styles from './styles.module.css';

/**
 * PlanningBox — hebt Planungsartefakte (Story, AC, Sprint-Backlog) mit
 * demselben hellen Gelb hervor, egal wo im Arbeitsblatt sie auftauchen.
 *
 * Nutzung in MDX (ohne Import, siehe src/theme/MDXComponents.js) — Leerzeilen
 * um den Markdown-Inhalt herum sind nötig, damit MDX ihn als Markdown parst:
 *   <PlanningBox>
 *
 *   | # | Task |
 *   |---|---|
 *
 *   </PlanningBox>
 */
export default function PlanningBox({children}) {
  return <div className={styles.box}>{children}</div>;
}
