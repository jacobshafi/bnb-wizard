import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Step5 from '../components/steps/Step5_Review';
import { FormProvider } from '../context/FormContext';
import { vi } from 'vitest';
import { toast } from 'react-toastify';

vi.mock('react-toastify', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn()
  }
}));

test('requires checkbox to finalize', async () => {
  render(
    <FormProvider>
      <Step5 onBack={vi.fn()} />
    </FormProvider>
  );

  const finalizeButton = screen.getByRole('button', { name: /finalize/i });
  expect(finalizeButton).toBeDisabled();

  // Enable the button by checking the checkbox
  fireEvent.click(screen.getByLabelText(/i confirm/i));
  expect(finalizeButton).not.toBeDisabled();

  // Click the button and verify success message
  fireEvent.click(finalizeButton);
  
  await waitFor(() => {
    expect(toast.success).toHaveBeenCalledWith('🎉 Application finalized!');
  });
});