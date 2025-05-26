// src/test/Wizard.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Wizard from '../pages/Wizard';
import { FormProvider } from '../context/FormContext';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { toast } from 'react-toastify';
import { vi } from 'vitest';

vi.mock('react-toastify', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn()
  }
}));

const server = setupServer(
  http.post('/entities', () => {
    return HttpResponse.json({ uuid: 'test-id' });
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

function renderWizard() {
  render(
    <FormProvider>
      <Wizard />
    </FormProvider>
  );
}

test('user can complete the wizard end-to-end', async () => {
  renderWizard();

  // Step 1
  fireEvent.change(screen.getByLabelText(/first name/i), { target: { value: 'John' } });
  fireEvent.change(screen.getByLabelText(/last name/i), { target: { value: 'Doe' } });
  fireEvent.change(screen.getByLabelText(/date of birth/i), { target: { value: '1990-01-01' } });
  fireEvent.click(screen.getByRole('button', { name: /next/i }));

  // Step 2
  await screen.findByRole('heading', { name: /step 2/i });
  fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'john@example.com' } });
  fireEvent.change(screen.getByLabelText(/phone/i), { target: { value: '+12345678901' } });
  fireEvent.click(screen.getByRole('button', { name: /next/i }));

  // Step 3
  await screen.findByRole('heading', { name: /step 3/i });
  fireEvent.change(screen.getByLabelText(/loan amount/i), { target: { value: '20000' } });
  fireEvent.change(screen.getByLabelText(/upfront payment/i), { target: { value: '5000' } });
  fireEvent.change(screen.getByLabelText(/terms/i), { target: { value: '12' } });
  fireEvent.click(screen.getByRole('button', { name: /next/i }));

  // Step 4
  await screen.findByRole('heading', { name: /step 4/i });
  fireEvent.change(screen.getByLabelText(/monthly salary/i), { target: { value: '4000' } });
  fireEvent.click(screen.getByRole('button', { name: /next/i }));

  // Step 5
  await screen.findByRole('heading', { name: /step 5/i });
  fireEvent.click(screen.getByLabelText(/i confirm/i));
  fireEvent.click(screen.getByRole('button', { name: /finalize/i }));

  await waitFor(() => {
    expect(toast.success).toHaveBeenCalledWith('🎉 Application finalized!');
  });
});
