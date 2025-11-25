import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach, beforeAll, afterAll } from 'vitest';

// Приховуємо попередження про act() від Material-UI компонентів
// та очікувані помилки з console.error в тестах
// Ці попередження виникають через внутрішні оновлення стану MUI і не впливають на тести
const originalError = console.error;
beforeAll(() => {
  console.error = (...args: unknown[]) => {
    // Приховуємо попередження про act()
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Warning: An update to') &&
      args[0].includes('inside a test was not wrapped in act(...)')
    ) {
      return;
    }
    // Приховуємо Error об'єкти, які виводяться через console.error в тестах
    // (це очікувані помилки, які тести перевіряють)
    // Важливі помилки все одно будуть показані через expect assertions
    if (args[0] instanceof Error) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});

afterEach(() => {
  cleanup();
});
