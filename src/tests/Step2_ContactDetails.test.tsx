// src/tests/Step2_ContactDetails.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import Step2_ContactDetails from '../components/steps/Step2_ContactDetails';
import { FormProvider } from '../context/FormContext';
import { vi } from 'vitest';

function renderWithContext(ui: React.ReactNode) {
  return render(<FormProvider>{ui}</FormProvider>);
}

test('validates email and phone', async () => {
  renderWithContext(
    <Step2_ContactDetails onNext={vi.fn()} onBack={vi.fn()} />
  );

  // Submit without entering any input
  fireEvent.click(screen.getByRole('button', { name: /next/i }));

  // Expect validation messages to appear
  expect(await screen.findByText(/enter a valid email/i)).toBeInTheDocument();
  expect(await screen.findByText(/must be e.164 format/i)).toBeInTheDocument();
});
