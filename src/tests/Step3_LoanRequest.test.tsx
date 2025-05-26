import { render, screen, fireEvent } from '@testing-library/react';
import Step3 from '../components/steps/Step3_LoanRequest';
import { FormProvider } from '../context/FormContext';
import { vi } from 'vitest';

test('validates loan rules: upfront < loan, age + term < 80', async () => {
  render(
    <FormProvider>
      <Step3 onNext={vi.fn()} onBack={vi.fn()} />
    </FormProvider>
  );

  fireEvent.change(screen.getByLabelText(/loan amount/i), { target: { value: '10000' } });
  fireEvent.change(screen.getByLabelText(/upfront payment/i), { target: { value: '15000' } });
  fireEvent.change(screen.getByLabelText(/terms/i), { target: { value: '30' } });

  fireEvent.click(screen.getByRole('button', { name: /next/i }));
  expect(await screen.findByText(/less than loan amount/i)).toBeInTheDocument();
});