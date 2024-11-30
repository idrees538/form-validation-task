import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { updateFormData } from '../redux/formSlice';
import formFields from '../formFields.json';

const schemas = formFields.map(step => {
  const fields = step.fields.reduce((acc, field) => {
    acc[field.identifier] = field.validation.required ? z.string().nonempty({ message: field.validation.message }) : z.string().optional();
    return acc;
  }, {});
  return z.object(fields);
});

const FormStep = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const dispatch = useDispatch();
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schemas[currentStep]),
  });

  const onSubmit = (data) => {
    dispatch(updateFormData(data));
    if (currentStep < formFields.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      alert('Form submitted!');
    }
  };

  const onPrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const stepTitles = [' Personal Information', ' Web Preference', 'Personal Information'];
  const stepDescriptions = ['Help us to get know you by answering the following question.', 'This section is about your preferences on our website.', 'This section is about your personal information.', 'This section is about your additional information.'];

  return (
    <div className="bg-gray-200 min-h-screen flex flex-col items-start justify-center pl-20 pt-6">
    <div className="ml-auto absolute right-[20%] top-32">
        {stepTitles.map((title, index) => (
          <div className={`rounded-full flex items-center justify-left bg-gray-200 p-2 m-2`}>
            <div className={`rounded-full text-lg w-6 h-6 flex items-center justify-center ${currentStep === index ? 'bg-green-500 text-blue-500' : 'bg-white text-black'}`}>{index + 1}</div>
            <h3 className={`text-lg ${currentStep === index ? 'text-blue-500' : 'text-black'}`}>{title}</h3>
          </div>

        ))}
      </div>
      {formFields.length > 0 && (
        <>
          <h2 className="text-2xl font-bold">{stepTitles[currentStep]}</h2>
          <p className="text-base">{stepDescriptions[currentStep]}</p>
          
          <form className="bg-white p-8 rounded-md shadow-md w-[62%] mt-8 border-t-4 border-green-500" onSubmit={handleSubmit(onSubmit)}>
            {formFields[currentStep].fields.map((field) => (
              <div className="mb-6">
                <label htmlFor={field.identifier} className="block text-black font-bold">
                  <span className="text-green-500 text-2xl">• </span>{field.label}?<span className="text-red-500">*</span>
                </label>
                {field.identifier === 'expertise' ? (
                  field.options.map((option, index) => (
                    <div key={index}>
                      <input
                        id={`${field.identifier}-${index}`}
                        type="checkbox"
                        value={option}
                        {...register(`${field.identifier}-${index}`)}
                        className="mr-2"
                      />
                      <label htmlFor={`${field.identifier}-${index}`}>{option}</label>
                    </div>
                  ))
                ) : (
                  <input
                    id={field.identifier}
                    type={field.type}
                    placeholder={field.placeholder}
                    {...register(field.identifier)}
                    className="mt-1 p-2 w-full border-gray-300 rounded-md"
                  />
                )}
                {field.description && <p className="text-black">{field.description}</p>}
                {errors[field.identifier] && (
                  <p className="text-red-500 mt-1">{errors[field.identifier]?.message}</p>
                )}
              </div>
            ))}
            <div className="flex justify-end">
              <button type="button" onClick={onPrevious} className="p-2 rounded-md text-white bg-green-500 mr-2">
                Previous
              </button>
              <button type="submit" className="p-2 rounded-md text-white bg-blue-800">
                {currentStep < formFields.length - 1 ? 'Next' : 'Submit'}
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
};

export default FormStep;
