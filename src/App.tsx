import { useForm } from "./hooks/useForm";
import { ErrorsType } from "./hooks/useForm";

type FormValuesType = {
  firstName: string;
  lastName: string;
  age: number;
};

function validate(values: FormValuesType) {
  const errors: ErrorsType<FormValuesType> = {};

  if (!values.firstName) errors.firstName = "required";
  if (!values.lastName) errors.lastName = "required";
  if (!values.age) errors.age = "required";
  else if (values.age > 35 || values.age < 18) errors.age = "must be in 18-35";

  return errors;
}

function getUrlQueryParams() {
  if (!window) return;
  const search = location.search.substring(1);
  if (search)
    return JSON.parse(
      '{"' +
        decodeURI(search)
          .replace(/"/g, '\\"')
          .replace(/&/g, '","')
          .replace(/=/g, '":"') +
        '"}'
    );
  else return {};
}

function App() {
  const {
    values,
    errors,
    handleInputChange,
    setData,
    handleSubmit,
    registerInput,
  } = useForm<FormValuesType>({
    initialValues: getUrlQueryParams(),
    validate,
    validateOnChange: true,
    onSubmit: (values) => console.log("values:", values),
    onError: (errors) =>
      console.log("error in:", Object.keys(errors).join(", ")),
  });

  return (
    <form className="p-10 flex flex-col w-1/2 mx-auto" onSubmit={handleSubmit}>
      <b className="text-lg mb-1">Form Custom Hook</b>
      <a
        href="/?firstName=Mohammad&lastName=Nazari&age=23"
        className="mb-8 text-sm"
      >
        *use url query params for initial values
      </a>
      <label htmlFor="firstName" className="mb-2 mt-4">
        First Name:
      </label>
      <div className="flex justify-between">
        <input
          className="w-full mr-2"
          type="text"
          id="firstName"
          name="firstName"
          value={values?.firstName}
          onChange={handleInputChange}
        />
        <button
          type="button"
          className="bg-blue-700 w-fit text-white shrink-0"
          onClick={() => setData("firstName", "Mohammad")}
        >
          set First Name to 'Mohammad'
        </button>
      </div>
      {errors.firstName && (
        <div className="text-sm text-red-500">{errors.firstName}</div>
      )}
      <label htmlFor="lastName" className="mb-2 mt-4">
        Last Name:
      </label>
      {/* Uncontrolled Input */}
      <input type="text" id="lastName" {...registerInput("lastName")} />
      {errors.lastName && (
        <div className="text-sm text-red-500">{errors.lastName}</div>
      )}
      <label htmlFor="age" className="mb-2 mt-4">
        Age:
      </label>
      <input
        type="number"
        id="age"
        name="age"
        value={values?.age}
        onChange={handleInputChange}
      />
      {errors.age && <div className="text-sm text-red-500">{errors.age}</div>}
      <button
        type="submit"
        className="bg-green-700 text-white border-none mt-5 w-[200px] mx-auto"
      >
        submit
      </button>
    </form>
  );
}

export default App;
