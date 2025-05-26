import { useState } from 'react';
import Step1 from '../components/steps/Step1_PersonalInfo';
import Step2 from '../components/steps/Step2_ContactDetails';
import Step3 from '../components/steps/Step3_LoanRequest';
import Step4 from '../components/steps/Step4_FinancialInfo';
import Step5 from '../components/steps/Step5_Review';

export default function Wizard() {
    const [step, setStep] = useState(0);
  
    const steps = [
      <Step1 onNext={() => setStep(1)} />,
      <Step2 onNext={() => setStep(2)} onBack={() => setStep(0)} />,
      <Step3 onNext={() => setStep(3)} onBack={() => setStep(1)} />,
      <Step4 onNext={() => setStep(4)} onBack={() => setStep(2)} />,
      <Step5 onBack={() => setStep(3)} />,
    ];
  
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-xl w-full bg-white p-6 rounded-lg shadow-lg">
          {steps[step]}
        </div>
      </div>
    );
  }