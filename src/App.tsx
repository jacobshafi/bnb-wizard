import { Routes, Route, Navigate, BrowserRouter } from 'react-router-dom';
import Wizard from './pages/Wizard';
import { FormProvider } from './context/FormContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

type Props = {
  RouterWrapper?: React.ComponentType<{ children: React.ReactNode }>;
};

export default function App({ RouterWrapper = BrowserRouter }: Props) {
  return (
    <RouterWrapper>
      <FormProvider>
        <Routes>
          <Route path="/wizard/*" element={<Wizard />} />
          <Route path="/" element={<Navigate to="/wizard/step-1" replace />} />
          <Route path="*" element={<div>Not Found</div>} />
        </Routes>
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      </FormProvider>
    </RouterWrapper>
  );
}