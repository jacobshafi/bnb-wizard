import Wizard from './pages/Wizard';
import { FormProvider } from './context/FormContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function App() {
  return (
    <FormProvider>
      <Wizard />
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </FormProvider>
  );
}