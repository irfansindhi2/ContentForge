import React from 'react';
import { useFormLogic } from '../../hooks/useFormLogic';
import FormField from './FormField';

/**
 * Component that renders a form, utilizing the useFormLogic hook.
 *
 * @returns {JSX.Element} - The rendered form component.
 */
function Form() {
  const { formDetails, formValues, handleInputChange, handleSubmit, loading } = useFormLogic();

  // Extract the id from the query parameters
  const searchParams = new URLSearchParams(window.location.search);
  const id = searchParams.get('id');

  // Render loading state if data is still being fetched
  if (loading) {
    return <div>Loading...</div>;
  }
  
  return (
    <div>
      <h1>{id ? `Edit ${formValues.formName}` : `Create New ${formValues.formName}`}</h1>
      <form onSubmit={handleSubmit}>
        {formDetails.map(detail => (
          <FormField
            key={detail.form_detail_id}
            detail={detail}
            value={formValues[detail.column_name]}
            handleInputChange={handleInputChange}
          />
        ))}
        <button type="submit">{id ? 'Update' : 'Create'}</button>
      </form>
    </div>
  );
}

export default Form;
