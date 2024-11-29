import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { updateFormData } from '../redux/formSlice';
import formFields from '../formFields.json';

const schemas = formFields.map(step => {
  const fields = step.fields.reduce((acc, field) => {
    acc[field.identifier] = field.validation.required ? z.string().nonempty({ message: field.validation.message }) : z.string();
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

  const stepTitles = ['Personal Information', 'Web Preference', 'Personal Info'];
  const stepDescriptions = ['Help us to get know you by answering the following question.', 'This section is about your preferences on our website.', 'This section is about your personal information.', 'This section is about your additional information.'];

  return (
    <div style={{backgroundColor: '#e5e7eb', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center', paddingLeft: '2rem'}}>
    
      {formFields.length > 0 && (
        <>
          <h2>{stepTitles[currentStep]}</h2>
          <p>{stepDescriptions[currentStep]}</p>
          <div style={{marginLeft: 'auto'}}>
        {stepTitles.map((title, index) => (
          <h3 style={{color: currentStep === index ? '#3b82f6' : '#000000'}}>{title}</h3>
        ))}
      </div>
          <form style={{backgroundColor: '#ffffff', padding: '2rem', borderRadius: '0.375rem', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', width: '60%', maxWidth: '800px', marginTop: '2rem'}} onSubmit={handleSubmit(onSubmit)}>
            {formFields[currentStep].fields.map((field) => (
              <div style={{marginBottom: '1.5rem'}}>
                <label htmlFor={field.identifier} style={{display: 'block', color: '#000000', fontWeight: 'bold'}}>
                  {field.label}
                </label>
                {['phoneNumber', 'linkedin'].includes(field.identifier) && <p>Some text below the label</p>}
                <input
                  id={field.identifier}
                  type={field.type}
                  placeholder={field.placeholder}
                  {...register(field.identifier)}
                  style={{marginTop: '0.25rem', padding: '0.5rem', width: '100%', border: '1px solid #d1d5db', borderRadius: '0.375rem'}}
                />
                {field.description && <p style={{color: '#000000'}}>{field.description}</p>}
                {errors[field.identifier] && (
                  <p style={{color: '#ef4444', marginTop: '0.25rem'}}>{errors[field.identifier]?.message}</p>
                )}
              </div>
            ))}
            <div style={{display: 'flex', justifyContent: 'flex-end'}}>
              <button type="button" onClick={onPrevious} style={{padding: '0.5rem 1rem', borderRadius: '0.375rem', color: '#ffffff', textAlign: 'center', cursor: 'pointer', border: 'none', backgroundColor: '#3b82f6', marginRight: '0.5rem'}}>
                Previous
              </button>
              <button type="submit" style={{padding: '0.5rem 1rem', borderRadius: '0.375rem', color: '#ffffff', textAlign: 'center', cursor: 'pointer', border: 'none', backgroundColor: '#3b82f6'}}>
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
