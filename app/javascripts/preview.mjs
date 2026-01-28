const $forms = document.querySelectorAll('form[action="/form-handler"]')

// Prevent preview form submissions
$forms.forEach(($form) => {
  $form.addEventListener('submit', (event) => {
    event.preventDefault()
  })
})
