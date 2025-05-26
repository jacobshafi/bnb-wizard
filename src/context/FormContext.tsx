import { createContext, useContext, useState, useEffect } from 'react';

export type FormData = {
  // Step 1: Personal Info
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;

  // Step 2: Contact Info
  email?: string;
  phone?: string;

  // Step 3: Loan Request
  loanAmount?: number;
  upfrontPayment?: number;
  terms?: number;

  // Step 4: Financial Info
  salary?: number;
  additionalIncome?: number;
  mortgage?: number;
  otherCredits?: number;

  // Toggle states for Step 4
  showAdditionalIncome?: boolean;
  showMortgage?: boolean;
  showOtherCredits?: boolean;
};

const FormContext = createContext<{
  data: FormData;
  setData: (values: Partial<FormData>) => void;
  loaded: boolean;
}>({
  data: {},
  setData: () => {},
  loaded: false,
});

export const FormProvider = ({ 
  children, 
  initialData 
}: { 
  children: React.ReactNode;
  initialData?: Partial<FormData>;
}) => {
  const [data, setState] = useState<FormData>(initialData || {});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!initialData) {
      const saved = localStorage.getItem('formData');
      if (saved) {
        try {
          setState(JSON.parse(saved));
        } catch {
          // Fallback in case of corrupted JSON
          setState({});
        }
      }
    }
    setLoaded(true);
  }, [initialData]);

  const setData = (values: Partial<FormData>) => {
    setState((prev) => {
      const updated = { ...prev, ...values };
      localStorage.setItem('formData', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <FormContext.Provider value={{ data, setData, loaded }}>
      {children}
    </FormContext.Provider>
  );
};

export const useFormData = () => useContext(FormContext);
