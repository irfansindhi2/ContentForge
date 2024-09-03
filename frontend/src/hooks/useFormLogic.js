import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchFormDetails, fetchInformation, submitForm } from '../services/formService';
import { formatDate } from '../utils/utils';

/**
 * Custom hook that manages form logic including state, fetching data, and submission.
 *
 * @returns {Object} - Contains form details, form values, and handlers for input changes and form submission.
 */
export const useFormLogic = () => {
  const { formName } = useParams();
  const navigate = useNavigate();
  const [formDetails, setFormDetails] = useState([]);
  const [formValues, setFormValues] = useState({});
  const [loading, setLoading] = useState(true); // Add loading state

  // Extract id from query parameters
  const id = new URLSearchParams(location.search).get('id');

  /**
   * Initializes the form by fetching form details and, if in edit mode, existing form data.
   *
   * @throws {Error} - If form details or information cannot be retrieved.
   */
  useEffect(() => {
    async function initializeForm() {
      try {
        setLoading(true); // Start loading
        // Fetch the form details for the specified formName
        const formDetailsData = await fetchFormDetails(formName, id);
        setFormDetails(formDetailsData.formDetails);

        if (id) {
          // Edit mode: Fetch the existing information for the specified form entry
          const informationData = await fetchInformation(formName, id);
          const initialValues = { formName };

          // Populate form values with the fetched information, formatting dates if necessary
          formDetailsData.formDetails.forEach(detail => {
            if (detail.input_type === 'Date') {
              initialValues[detail.column_name] = formatDate(informationData[detail.column_name]);
            } else if (detail.lov_sql_convert_in) {
              initialValues[detail.column_name] = detail.lov_sql_convert_in;
            } else {
              initialValues[detail.column_name] = informationData[detail.column_name] || '';
            }
          });

          setFormValues(initialValues);
        } else {
          // Create mode: Initialize form values with default values from form details
          const initialValues = { formName };

          formDetailsData.formDetails.forEach(detail => {
            initialValues[detail.column_name] = detail.default_value || '';
          });

          setFormValues(initialValues);
        }
      } catch (error) {
        console.error('Error fetching form details or information:', error);
        throw new Error('Failed to initialize form');
      } finally {
        setLoading(false); // End loading
      }
    }

    // Call the initialization function on component mount
    initializeForm();
  }, [formName, id]);

  /**
   * Updates the form values state when an input field changes.
   *
   * @param {Event} e - The input change event.
   */
  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
  
    if (e.target.type === 'file') {
      if (files[0]) {
        setFormValues(prevValues => ({
          ...prevValues,
          [name]: files[0]  // Store the file object instead of just the name
        }));
      }
    } else {
      setFormValues(prevValues => ({
        ...prevValues,
        [name]: value,
      }));
    }
  };

  /**
   * Submits the form data to the server.
   *
   * @param {Event} e - The form submission event.
   * @returns {Promise<void>} - Resolves when the form is successfully submitted.
   * @throws {Error} - If the form submission fails.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { formName, ...filteredValues } = formValues;
  
      // Create a FormData object to send both text data and files
      const formData = new FormData();
      Object.keys(filteredValues).forEach(key => {
        if (filteredValues[key] instanceof File) {
          formData.append(key, filteredValues[key]);
        } else {
          formData.append(key, filteredValues[key]);
        }
      });
  
      console.log('Form data being sent:', Object.fromEntries(formData));
  
      await submitForm({ formData, formName, id, navigate });
    } catch (error) {
      console.error('Error submitting form:', error);
      throw new Error('Failed to submit form');
    }
  };

  // Return the form details, current form values, and the handlers for input change and submission
  return {
    formDetails,
    formValues,
    handleInputChange,
    handleSubmit,
    loading,
  };
};
