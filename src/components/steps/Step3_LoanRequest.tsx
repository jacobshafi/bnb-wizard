import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFormData } from '../../context/FormContext';
import { usePersistentForm } from '../../hooks/usePersistentForm';
import { toast } from 'react-toastify';

const schema = z.object({
  loanAmount: z.number().min(10000, 'Minimum is 10,000').max(70000, 'Maximum is 70,000'),
  upfrontPayment: z.number().nonnegative('Must be 0 or greater'),
  terms: z.number().min(10, 'Min 10 months').max(30, 'Max 30 months'),
});

type Inputs = z.infer<typeof schema>;

type Props = {
  onNext: () => void;
  onBack: () => void;
};

export default function Step3_LoanRequest({ onNext, onBack }: Props) {
  const { data, setData, loaded } = useFormData();

  const age = (() => {
    if (!data.dateOfBirth) return 0;
    const dob = new Date(data.dateOfBirth);
    const today = new Date();
    let years = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) years--;
    return years;
  })();

  const form = usePersistentForm<Inputs>(
    {
      loanAmount: data.loanAmount || 10000,
      upfrontPayment: data.upfrontPayment || 0,
      terms: data.terms || 10,
    },
    { resolver: zodResolver(schema) },
    loaded
  );

  const { register, handleSubmit, formState: { errors }, setError } = form;

  if (!loaded) return <div className="text-center p-10">Loading...</div>;

  const onSubmit = (formData: Inputs) => {
    if (formData.upfrontPayment >= formData.loanAmount) {
      setError('upfrontPayment', { message: 'Must be less than loan amount' });
      toast.error('Upfront payment must be less than loan amount');
      return;
    }

    if ((formData.terms / 12) + age >= 80) {
      setError('terms', { message: 'Terms too long given your age (must stay under 80)' });
      toast.error('Loan terms too long for your age');
      return;
    }

    setData(formData);
    toast.success('Loan request saved');
    onNext();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Step 3: Loan Request</h2>

      {/* Loan Amount */}
      <div>
        <label htmlFor="loanAmount" className="block text-sm font-medium text-gray-700 mb-1">
          Loan Amount
        </label>
        <input
          id="loanAmount"
          type="number"
          {...register('loanAmount', { valueAsNumber: true })}
          className={`w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.loanAmount ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.loanAmount && (
          <p className="text-red-500 text-sm mt-1">{errors.loanAmount.message}</p>
        )}
      </div>

      {/* Upfront Payment */}
      <div>
        <label htmlFor="upfrontPayment" className="block text-sm font-medium text-gray-700 mb-1">
          Upfront Payment
        </label>
        <input
          id="upfrontPayment"
          type="number"
          {...register('upfrontPayment', { valueAsNumber: true })}
          className={`w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.upfrontPayment ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.upfrontPayment && (
          <p className="text-red-500 text-sm mt-1">{errors.upfrontPayment.message}</p>
        )}
      </div>

      {/* Terms */}
      <div>
        <label htmlFor="terms" className="block text-sm font-medium text-gray-700 mb-1">
          Terms (Months)
        </label>
        <input
          id="terms"
          type="number"
          {...register('terms', { valueAsNumber: true })}
          className={`w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.terms ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.terms && (
          <p className="text-red-500 text-sm mt-1">{errors.terms.message}</p>
        )}
      </div>


      <div className="flex justify-between pt-2">
        <button type="button" onClick={onBack} className="btn-secondary">Back</button>
        <button type="submit" className="btn-primary">Next</button>
      </div>
    </form>
  );
}
