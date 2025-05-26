import { usePersistentForm } from '../../hooks/usePersistentForm';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useFormData } from '../../context/FormContext';
import { toast } from 'react-toastify';

const schema = z.object({
  firstName: z.string().min(1, 'First name is required').regex(/^[A-Za-zÄäÖöÜüẞß]+$/, 'Latin/German only, no spaces'),
  lastName: z.string().min(1, 'Last name is required').regex(/^[A-Za-zÄäÖöÜüẞß\s]+$/, 'Latin/German letters only'),
  dateOfBirth: z.string().refine((val) => {
    const dob = new Date(val);
    const age = new Date().getFullYear() - dob.getFullYear();
    return age >= 18 && age <= 79;
  }, 'Age must be between 18 and 79'),
});

type Inputs = z.infer<typeof schema>;

type Props = {
  onNext: () => void;
};

export default function Step1_PersonalInfo({ onNext }: Props) {
  const { data, setData, loaded } = useFormData();

  const form = usePersistentForm<Inputs>(
    {
      firstName: data.firstName || '',
      lastName: data.lastName || '',
      dateOfBirth: data.dateOfBirth || '',
    },
    { resolver: zodResolver(schema) },
    loaded
  );

  const { register, handleSubmit, formState: { errors } } = form;

  if (!loaded) return <div className="text-center p-10">Loading...</div>;

  const onSubmit = (formData: Inputs) => {
    const changed =
      data.firstName !== formData.firstName ||
      data.lastName !== formData.lastName ||
      data.dateOfBirth !== formData.dateOfBirth;
    setData(formData);
    if (changed) {
      toast.success('Personal info saved');
    }
    onNext();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Step 1: Personal Info</h2>

      {/* First Name */}
      <div>
        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
          First Name
        </label>
        <input
          id="firstName"
          autoComplete="new-firstname"
          {...register('firstName')}
          className={`w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.firstName ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.firstName && (
          <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>
        )}
      </div>

      {/* Last Name */}
      <div>
        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
          Last Name
        </label>
        <input
          id="lastName"
          autoComplete="new-lastname"
          {...register('lastName')}
          className={`w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.lastName ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.lastName && (
          <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>
        )}
      </div>

      {/* Date of Birth */}
      <div>
        <label htmlFor="dob" className="block text-sm font-medium text-gray-700 mb-1">
          Date of Birth
        </label>
        <input
          id="dob"
          type="date"
          {...register('dateOfBirth')}
          className={`w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.dateOfBirth ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.dateOfBirth && (
          <p className="text-red-500 text-sm mt-1">{errors.dateOfBirth.message}</p>
        )}
      </div>

      <div className="pt-2">
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
          Next
        </button>
      </div>
    </form>
  );
}
