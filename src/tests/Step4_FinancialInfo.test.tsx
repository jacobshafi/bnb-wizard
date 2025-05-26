import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Step4 from '../components/steps/Step4_FinancialInfo';
import { FormProvider } from '../context/FormContext';
import { vi } from 'vitest';
import { toast } from 'react-toastify';

vi.mock('react-toastify', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn()
  }
}));

test('fails if salary + income - expenses does not cover loan', async () => {
  const initialData = {
    loanAmount: 20000,
    terms: 12
  };

  render(
    <FormProvider initialData={initialData}>
      <Step4 onNext={vi.fn()} onBack={vi.fn()} />
    </FormProvider>
  );

  fireEvent.change(screen.getByLabelText(/monthly salary/i), { target: { value: '500' } });
  fireEvent.click(screen.getByRole('button', { name: /next/i }));

  await waitFor(() => {
    expect(toast.error).toHaveBeenCalledWith("Your financial capacity isn't sufficient.");
  });
});
