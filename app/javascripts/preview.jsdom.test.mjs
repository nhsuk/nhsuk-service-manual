describe('NHS digital service manual previews', () => {
  /** @type {HTMLFormElement} */
  let $form1

  /** @type {HTMLFormElement} */
  let $form2

  beforeEach(() => {
    document.documentElement.innerHTML = ''

    $form1 = document.createElement('form')
    $form2 = document.createElement('form')

    $form1.setAttribute('action', '/form-handler')
    $form2.setAttribute('action', '/search')

    document.body.appendChild($form1)
    document.body.appendChild($form2)
  })

  it('should prevent example form submissions', async () => {
    await import('./preview.mjs')

    const $submit = new Event('submit')
    jest.spyOn($submit, 'preventDefault')
    $form1.dispatchEvent($submit)

    expect($submit.preventDefault).toHaveBeenCalled()
  })

  it('should not prevent other form submissions', async () => {
    await import('./preview.mjs')

    const $submit = new Event('submit')
    jest.spyOn($submit, 'preventDefault')
    $form2.dispatchEvent($submit)

    expect($submit.preventDefault).not.toHaveBeenCalled()
  })
})
