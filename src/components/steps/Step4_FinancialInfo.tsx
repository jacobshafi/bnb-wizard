import { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useFormData } from '../../context/FormContext';
import { usePersistentForm } from '../../hooks/usePersistentForm';
import { toast } from 'react-toastify';

const schema = z.object({
  salary: z.number().min(1, 'Required'),
  additionalIncome: z.number().optional(),
  mortgage: z.number().optional(),
  otherCredits: z.number().optional(),
});

type Inputs = z.infer<typeof schema>;

type Props = {
  onNext: () => void;
  onBack: () => void;
};

export default function Step4_FinancialInfo({ onNext, onBack }: Props) {
  const { data, setData, loaded } = useFormData();

  const form = usePersistentForm<Inputs>(
    {
      salary: data.salary ?? 0,
      additionalIncome: data.additionalIncome,
      mortgage: data.mortgage,
      otherCredits: data.otherCredits,
    },
    {
      resolver: zodResolver(schema),
    },
    loaded
  );

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = form;

  const [showIncome, setShowIncome] = useState<boolean>(false);
  const [showMortgage, setShowMortgage] = useState<boolean>(false);
  const [showCredits, setShowCredits] = useState<boolean>(false);

  useEffect(() => {
    if (loaded) {
      setShowIncome(data.showAdditionalIncome ?? false);
      setShowMortgage(data.showMortgage ?? false);
      setShowCredits(data.showOtherCredits ?? false);
    }
  }, [loaded]);

  useEffect(() => {
    if (!showIncome) setValue('additionalIncome', undefined);
    if (!showMortgage) setValue('mortgage', undefined);
    if (!showCredits) setValue('otherCredits', undefined);
  }, [showIncome, showMortgage, showCredits, setValue]);

  if (!loaded) return <div className="text-center p-10">Loading...</div>;

  const onSubmit = (formData: Inputs) => {
    const income = formData.salary + (showIncome ? formData.additionalIncome || 0 : 0);
    const expenses = (showMortgage ? formData.mortgage || 0 : 0) + (showCredits ? formData.otherCredits || 0 : 0);
    const terms = data.terms || 0;
    const loanAmount = data.loanAmount || 0;
    const threshold = (income - expenses) * terms * 0.5;

    if (threshold < loanAmount) {
      toast.error("Your financial capacity isn't sufficient.");
      return;
    }

    const changed =
      data.salary !== formData.salary ||
      (showIncome ? data.additionalIncome !== formData.additionalIncome : !!data.additionalIncome) ||
      (showMortgage ? data.mortgage !== formData.mortgage : !!data.mortgage) ||
      (showCredits ? data.otherCredits !== formData.otherCredits : !!data.otherCredits) ||
      data.showAdditionalIncome !== showIncome ||
      data.showMortgage !== showMortgage ||
      data.showOtherCredits !== showCredits;

    setData({
      salary: formData.salary,
      ...(showIncome && { additionalIncome: formData.additionalIncome }),
      ...(showMortgage && { mortgage: formData.mortgage }),
      ...(showCredits && { otherCredits: formData.otherCredits }),
      showAdditionalIncome: showIncome,
      showMortgage: showMortgage,
      showOtherCredits: showCredits,
    });

    if (changed) {
      toast.success('Financial info saved');
    }
    onNext();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Step 4: Financial Info</h2>

      {/* Salary */}
      <div>
        <label htmlFor="salary" className="block text-sm font-medium text-gray-700 mb-1">
          Monthly Salary
        </label>
        <input
          id="salary"
          type="number"
          {...register('salary', { valueAsNumber: true })}
          className={`w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.salary ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.salary && <p className="text-red-500 text-sm mt-1">{errors.salary.message}</p>}
      </div>

      {/* Additional Income */}
      <div className="space-y-2">
        <label htmlFor="additionalIncomeToggle" className="flex gap-2 items-center">
          <input
            id="additionalIncomeToggle"
            type="checkbox"
            checked={showIncome}
            onChange={() => setShowIncome(!showIncome)}
          />
          Include Additional Income
        </label>
        {showIncome && (
          <>
            <label htmlFor="additionalIncome" className="sr-only">Additional Income</label>
            <input
              id="additionalIncome"
              type="number"
              {...register('additionalIncome', { valueAsNumber: true })}
              className="input"
            />
          </>
        )}
      </div>

      {/* Mortgage */}
      <div className="space-y-2">
        <label htmlFor="mortgageToggle" className="flex gap-2 items-center">
          <input
            id="mortgageToggle"
            type="checkbox"
            checked={showMortgage}
            onChange={() => setShowMortgage(!showMortgage)}
          />
          Include Mortgage
        </label>
        {showMortgage && (
          <>
            <label htmlFor="mortgage" className="sr-only">Mortgage</label>
            <input
              id="mortgage"
              type="number"
              {...register('mortgage', { valueAsNumber: true })}
              className="input"
            />
          </>
        )}
      </div>

      {/* Other Credits */}
      <div className="space-y-2">
        <label htmlFor="otherCreditsToggle" className="flex gap-2 items-center">
          <input
            id="otherCreditsToggle"
            type="checkbox"
            checked={showCredits}
            onChange={() => setShowCredits(!showCredits)}
          />
          Include Other Credits
        </label>
        {showCredits && (
          <>
            <label htmlFor="otherCredits" className="sr-only">Other Credits</label>
            <input
              id="otherCredits"
              type="number"
              {...register('otherCredits', { valueAsNumber: true })}
              className="input"
            />
          </>
        )}
      </div>

      <div className="flex justify-between pt-2">
        <button type="button" onClick={onBack} className="btn-secondary">Back</button>
        <button type="submit" className="btn-primary">Next</button>
      </div>
    </form>
  );
}
