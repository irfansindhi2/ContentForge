/**
 * Fetches form details from the server.
 *
 * @param {string} formName - The name of the form.
 * @returns {Promise<Object>} - The form details retrieved from the server.
 * @throws {Error} - If the form details could not be retrieved.
 */
export const fetchFormDetails = async (formName) => {
    const formDetailsUrl = `${process.env.REACT_APP_API_URL}/api/form/${formName}`;
    const response = await fetch(formDetailsUrl, {
      method: 'GET',
      credentials: 'include',
    });
    return response.json();
  };
  
  /**
   * Fetches information for a specific form entry by ID.
   *
   * @param {string} formName - The name of the form.
   * @param {string} id - The ID of the specific form entry.
   * @returns {Promise<Object>} - The information retrieved from the server.
   * @throws {Error} - If the information could not be retrieved.
   */
  export const fetchInformation = async (formName, id) => {
    const informationUrl = `${process.env.REACT_APP_API_URL}/api/information/${formName}/${id}`;
    const response = await fetch(informationUrl, {
      method: 'GET',
      credentials: 'include',
    });
    return response.json();
  };
  
  /**
   * Submits form data to the server.
   *
   * @param {Object} params - Contains form values, form name, ID, and navigation function.
   * @param {Object} params.formValues - The form values to submit.
   * @param {string} params.formName - The name of the form.
   * @param {string} [params.id] - The ID of the specific form entry (for updating).
   * @param {Function} params.navigate - The navigation function for redirecting after submission.
   * @returns {Promise<void>} - Resolves when the form is successfully submitted.
   * @throws {Error} - If the form submission fails.
   */
  export const submitForm = async ({ formValues, formName, id, navigate }) => {
    const url = id
      ? `${process.env.REACT_APP_API_URL}/api/information/${formName}/${id}`
      : `${process.env.REACT_APP_API_URL}/api/information/${formName}`;
  
    const method = id ? 'PUT' : 'POST';
  
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formValues),
      credentials: 'include',
    });
  
    const result = await response.json();
    console.log('Form submitted successfully:', result);
  
    // Redirect to the list page after successful submission
    navigate(`/list/${formName}`);
  };
  