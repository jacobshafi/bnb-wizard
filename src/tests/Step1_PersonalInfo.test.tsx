import { render, screen, fireEvent } from '@testing-library/react';
import Step1 from '../components/steps/Step1_PersonalInfo';
import { FormProvider } from '../context/FormContext';

test('validates required fields and age restriction', async () => {
  render(
    <FormProvider>
      <Step1 onNext={vi.fn()} />
    </FormProvider>
  );

  fireEvent.click(screen.getByRole('button', { name: /next/i }));

  expect(await screen.findByText(/first name is required/i)).toBeInTheDocument();
  expect(screen.getByText(/last name is required/i)).toBeInTheDocument();
  expect(screen.getByText(/age must be between 18 and 79/i)).toBeInTheDocument();

  fireEvent.change(screen.getByLabelText(/first name/i), { target: { value: 'Jürgen Schmidt' } });
  fireEvent.click(screen.getByRole('button', { name: /next/i }));

  expect(await screen.findByText(/no spaces/i)).toBeInTheDocument();
});