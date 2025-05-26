import { useState } from 'react';
import { useFormData } from '../../context/FormContext';
import { toast } from 'react-toastify';

type Props = {
  onBack: () => void;
};

export default function Step5_Review({ onBack }: Props) {
  const { data } = useFormData();
  const [confirmed, setConfirmed] = useState(false);

  const handleSubmit = () => {
    if (!confirmed) {
      toast.error('Please confirm before submitting.');
      return;
    }

    // Normally you'd send data to a server here
    toast.success('🎉 Application Submitted!');
    localStorage.clear(); // optionally clear wizard progress
  };

  const fields = [
    { label: 'First Name', value: data.firstName },
    { label: 'Last Name', value: data.lastName },
    { label: 'Date of Birth', value: data.dateOfBirth },
    { label: 'Email', value: data.email },
    { label: 'Phone', value: data.phone },
    { label: 'Loan Amount', value: data.loanAmount },
    { label: 'Upfront Payment', value: data.upfrontPayment },
    { label: 'Terms (months)', value: data.terms },
    { label: 'Salary', value: data.salary },
    { label: 'Additional Income', value: data.additionalIncome },
    { label: 'Mortgage', value: data.mortgage },
    { label: 'Other Credits', value: data.otherCredits },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Step 5: Review & Submit</h2>

      <div className="space-y-4 bg-gray-100 p-4 rounded-lg shadow-sm divide-y">
        {fields.map((f, idx) => (
          <div key={idx} className="p-3">
            <p className="text-sm text-gray-500">{f.label}</p>
            <p className="text-gray-800 font-medium">{f.value ?? '—'}</p>
          </div>
        ))}
      </div>

      <label className="flex items-center gap-2">
        <input type="checkbox" checked={confirmed} onChange={() => setConfirmed(!confirmed)} />
        I confirm the above details are correct
      </label>

      <div className="flex justify-between pt-2">
        <button type="button" onClick={onBack} className="btn-secondary">
          Back
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!confirmed}
          className={`btn-primary ${!confirmed ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          Submit
        </button>
      </div>
    </div>
  );
}
