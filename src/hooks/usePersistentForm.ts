import { useEffect, useRef, useState } from 'react';
import {
  useForm,
  UseFormProps,
  UseFormReturn,
  FieldValues,
  DefaultValues,
} from 'react-hook-form';

export function usePersistentForm<T extends FieldValues>(
  defaultValues: DefaultValues<T>,
  options?: UseFormProps<T>,
  loaded = true
): UseFormReturn<T> {
  const hasReset = useRef(false);
  const [initialized, setInitialized] = useState(false);

  const methods = useForm<T>({
    ...options,
    defaultValues, // this is safe on first render only
  });

  useEffect(() => {
    if (loaded && !hasReset.current) {
      methods.reset(defaultValues);
      hasReset.current = true;
      setInitialized(true);
    }
  }, [loaded, defaultValues, methods]);

  return methods;
}
