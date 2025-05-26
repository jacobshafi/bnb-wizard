import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFormData } from '../../context/FormContext';
import { usePersistentForm } from '../../hooks/usePersistentForm';
import { toast } from 'react-toastify';

const schema = z.object({
  email: z.string().email('Enter a valid email'),
  phone: z.string().regex(/^\+\d{10,15}$/, 'Must be E.164 format (+1234567890)'),
});

type Inputs = z.infer<typeof schema>;

type Props = {
  onNext: () => void;
  onBack: () => void;
};

export default function Step2_ContactDetails({ onNext, onBack }: Props) {
  const { data, setData, loaded } = useFormData();

  const form = usePersistentForm<Inputs>(
    {
      email: data.email || '',
      phone: data.phone || '',
    },
    {
      resolver: zodResolver(schema),
    },
    loaded
  );

  const { register, handleSubmit, formState: { errors } } = form;

  if (!loaded) return <div className="text-center p-10">Loading...</div>;

  const onSubmit = (formData: Inputs) => {
    const changed =
      data.email !== formData.email ||
      data.phone !== formData.phone;
    setData(formData);
    if (changed) {
      toast.success('Contact info saved');
    }
    onNext();
  };


  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Step 2: Contact Info</h2>

      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
        </label>
        <input
          id="email" // ← Match this with htmlFor
          type="email"
          autoComplete="email"
          {...register('email')}
          className={`w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.email ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
      </div>

      {/* Phone */}
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
          Phone
        </label>
        <input
          id="phone"
          type="tel"
          autoComplete="tel"
          {...register('phone')}
          className={`w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.phone ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-2">
        <button type="button" onClick={onBack} className="btn-secondary">
          Back
        </button>
        <button type="submit" className="btn-primary">
          Next
        </button>
      </div>
    </form>
  );
}
