import React from 'react';
// Default MDX-Komponenten von Docusaurus (swizzle-freies Wrapping).
import MDXComponents from '@theme-original/MDXComponents';
import TestTable from '@site/src/components/TestTable';
import Task from '@site/src/components/Task';
import FillInTable from '@site/src/components/FillInTable';
import Solution from '@site/src/components/Solution';
import StoryCard from '@site/src/components/StoryCard';
import TaskBadge from '@site/src/components/TaskBadge';
import PlanningBox from '@site/src/components/PlanningBox';
import CodeFile from '@site/src/components/CodeFile';

export default {
  // Bestehende Docusaurus-MDX-Komponenten übernehmen ...
  ...MDXComponents,
  // ... und um projekteigene Komponenten ergänzen, damit sie in
  // jeder .md/.mdx-Datei ohne expliziten Import genutzt werden können.
  TestTable,
  Task,
  FillInTable,
  Solution,
  StoryCard,
  TaskBadge,
  PlanningBox,
  CodeFile,
};
