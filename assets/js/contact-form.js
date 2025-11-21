document.addEventListener('DOMContentLoaded', function() {
  const forms = document.querySelectorAll('.email-form');

  forms.forEach(function(form) {
    form.addEventListener('submit', async function(event) {
      event.preventDefault();

      const thisForm = this;
      const action = thisForm.getAttribute('action');
      const submitButton = thisForm.querySelector('button[type="submit"]');
      const loadingMessage = thisForm.querySelector('.loading');
      const errorMessage = thisForm.querySelector('.error-message');
      const sentMessage = thisForm.querySelector('.sent-message');

      // Validate form action
      if (!action) {
        displayError(thisForm, 'The form action property is not set!');
        return;
      }

      // Reset form states
      loadingMessage.style.display = 'block';
      errorMessage.style.display = 'none';
      sentMessage.style.display = 'none';
      submitButton.disabled = true;

      try {
        const formData = new FormData(thisForm);
        const response = await fetch(action, {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json'
          }
        });

        const data = await response.json();
        
        loadingMessage.style.display = 'none';
        
        if (data.ok) {
          sentMessage.style.display = 'block';
          thisForm.reset();
        } else {
          throw new Error(data.error || 'Form submission failed!');
        }
      } catch (error) {
        loadingMessage.style.display = 'none';
        errorMessage.textContent = error.message;
        errorMessage.style.display = 'block';
      } finally {
        submitButton.disabled = false;
      }
    });
  });

  function displayError(thisForm, error) {
    thisForm.querySelector('.loading').style.display = 'none';
    thisForm.querySelector('.error-message').textContent = error instanceof Error ? error.message : error;
    thisForm.querySelector('.error-message').style.display = 'block';
  }
}); 