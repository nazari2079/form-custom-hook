import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";

type DefaultValuesType = Record<string, unknown>;
export type ErrorsType<ValuesType> = Partial<Record<keyof ValuesType, string>>;

export type FormConfigs<ValuesType> = {
  initialValues?: ValuesType;
  validate?: (values: ValuesType) => ErrorsType<ValuesType>;
  validateOnChange?: boolean;
  onSubmit: (values: ValuesType) => void;
  onError?: (errors: ErrorsType<ValuesType>) => void;
};

export function useForm<ValuesType = DefaultValuesType>(
  configs?: FormConfigs<ValuesType>
) {
  const [values, setValues] = useState(
    configs?.initialValues || ({} as ValuesType)
  );
  const [errors, setErrors] = useState<ErrorsType<ValuesType>>({});

  function setData<K extends keyof ValuesType>(name: K, value: ValuesType[K]) {
    const newValues = { ...values, [name]: value } as ValuesType;

    if (
      configs?.validate &&
      typeof configs.validate === "function" &&
      configs?.validateOnChange
    )
      setErrors(() => configs.validate!(newValues));

    setValues(newValues);
  }

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    event.persist();

    const type = event.target.type;
    const name = event.target.name as keyof ValuesType;
    const value = event.target[
      type === "checkbox" ? "checked" : "value"
    ] as ValuesType[keyof ValuesType];
    setData(name, value);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    if (event) event.preventDefault();

    if (Object.keys(errors).length || !values) {
      if (configs?.onError && typeof configs?.onError === "function")
        configs.onError(errors);
    } else configs?.onSubmit(values);
  }

  function registerInput(name: keyof ValuesType) {
    return {
      name,
      value: values[name],
      onChange: handleInputChange,
    };
  }

  return {
    values,
    errors,
    handleInputChange,
    setData,
    handleSubmit,
    registerInput,
  };
}
