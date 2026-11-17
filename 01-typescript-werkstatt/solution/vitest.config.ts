import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['src/**/*.test.ts'],
    // Jeder Test wird einzeln mit Namen aufgelistet: Die roten Zeilen sind deine Arbeitsliste.
    reporters: ['verbose'],
  },
});
