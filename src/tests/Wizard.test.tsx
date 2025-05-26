import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '../App';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { toast } from 'react-toastify';
import { vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';

vi.mock('react-toastify', async () => {
  const actual = await vi.importActual('react-toastify');
  return {
    ...actual,
    toast: {
      error: vi.fn(),
      success: vi.fn(),
    },
    ToastContainer: () => null,
  };
});

const server = setupServer(
  http.post('/entities', () => {
    return HttpResponse.json({ uuid: 'test-id' });
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test('user can complete the wizard end-to-end', async () => {
  render(
    <App RouterWrapper={({ children }) => <MemoryRouter initialEntries={['/']}>{children}</MemoryRouter>} />
  );

  const user = userEvent.setup();

  // Step 1
  await user.type(screen.getByLabelText(/first name/i), 'John');
  await user.type(screen.getByLabelText(/last name/i), 'Doe');
  await user.type(screen.getByLabelText(/date of birth/i), '1990-01-01');
  await user.click(screen.getByRole('button', { name: /next/i }));

  // Step 2
  await screen.findByLabelText(/email/i); // waits for step 2 to load
  await user.type(screen.getByLabelText(/email/i), 'john@example.com');
  await user.type(screen.getByLabelText(/phone/i), '+12345678901');
  await user.click(screen.getByRole('button', { name: /next/i }));

  // Step 3
  await screen.findByLabelText(/loan amount/i);
  fireEvent.change(screen.getByLabelText(/loan amount/i), { target: { value: '20000' } });
  fireEvent.change(screen.getByLabelText(/upfront payment/i), { target: { value: '5000' } });
  fireEvent.change(screen.getByLabelText(/terms/i), { target: { value: '12' } });
  fireEvent.click(screen.getByRole('button', { name: /next/i }));

  // Step 4
  await screen.findByLabelText(/monthly salary/i);
  fireEvent.change(screen.getByLabelText(/monthly salary/i), { target: { value: '4000' } });
  fireEvent.click(screen.getByRole('button', { name: /next/i }));

  // Step 5
  await screen.findByRole('checkbox', { name: /confirm/i });
  fireEvent.click(screen.getByLabelText(/confirm/i));
  fireEvent.click(screen.getByRole('button', { name: /submit/i }));

  await waitFor(() => {
    expect(toast.success).toHaveBeenCalledWith('🎉 Application Submitted!');
  });
});
