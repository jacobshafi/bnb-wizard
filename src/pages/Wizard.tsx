import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Step1 from '../components/steps/Step1_PersonalInfo';
import Step2 from '../components/steps/Step2_ContactDetails';
import Step3 from '../components/steps/Step3_LoanRequest';
import Step4 from '../components/steps/Step4_FinancialInfo';
import Step5 from '../components/steps/Step5_Review';

export default function Wizard() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4" role="main">
      <div className="max-w-xl w-full bg-white p-6 rounded-lg shadow-lg">
        <Routes>
          <Route index element={<Navigate to="step-1" replace />} />
          <Route path="step-1" element={<Step1 onNext={() => navigate('/wizard/step-2')} />} />
          <Route path="step-2" element={<Step2 onNext={() => navigate('/wizard/step-3')} onBack={() => navigate('/wizard/step-1')} />} />
          <Route path="step-3" element={<Step3 onNext={() => navigate('/wizard/step-4')} onBack={() => navigate('/wizard/step-2')} />} />
          <Route path="step-4" element={<Step4 onNext={() => navigate('/wizard/step-5')} onBack={() => navigate('/wizard/step-3')} />} />
          <Route path="step-5" element={<Step5 onBack={() => navigate('/wizard/step-4')} />} />
          <Route path="*" element={<Navigate to="step-1" replace />} />
        </Routes>
      </div>
    </div>
  );
}