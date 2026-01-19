import { getMacroOptions, getMacroOptionsJson } from './macro-options.js'

describe('Macro options', () => {
  describe('getMacroOptions', () => {
    const output = getMacroOptions('radios')

    it('has primary options at the top level', () => {
      expect(output[0].id).toBe('primary')
      expect(output[0].name).toBe('Primary options')
    })

    describe('slugs', () => {
      it('appends slugs to options', () => {
        expect(output[0].params[4]).toMatchObject({
          id: 'form-group',
          name: 'form<wbr>Group',
          slug: 'form-group'
        })
      })

      it('appends slugs to nested options', () => {
        expect(output[0].params[4].params[0]).toMatchObject({
          id: 'classes',
          name: 'form<wbr>Group classes',
          slug: 'form-group-classes'
        })
      })
    })

    describe('nested options', () => {
      it('outputs nested options as a separate group', () => {
        expect(output[1].id).toBe('form-group')
        expect(output[2].id).toBe('before-inputs')
        expect(output[3].id).toBe('after-inputs')
      })

      it('outputs multiple nesting groups', () => {
        expect(output[0].params[7].params[0]).toMatchObject({
          id: 'text',
          name: 'items text',
          slug: 'items-text'
        })
      })
    })

    describe('additional components', () => {
      it('appends additional components that lack design system pages', () => {
        expect(output[5].id).toBe('label')
      })

      it('should only output additional components once', () => {
        const optionsWithLabelInName = output
          .map(({ name }) => name)
          .filter((name) => name.endsWith('<code>label</code> component'))

        expect(optionsWithLabelInName).toHaveLength(1)
      })
    })

    describe('markdown rendering', () => {
      const output = getMacroOptions('text-input')

      it('renders descriptions as markdown', () => {
        expect(output[0].params[0].description).toBe(
          'The ID of the input. Defaults to the value of <code>name</code>.'
        )

        expect(output[0].params[14].description).toBe(
          'Attribute to meet <a href="https://www.w3.org/WAI/WCAG22/Understanding/identify-input-purpose.html">WCAG success criterion 1.3.5: Identify input purpose</a>, for instance <code>&quot;bday-day&quot;</code>. See the <a href="https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#autofill">Autofill section in the HTML standard</a> for a full list of attributes that can be used.'
        )
      })

      it('renders nested options descriptions as markdown', () => {
        expect(output[0].params[12].params[2].params[0].description).toBe(
          'Text to add before the input. If <code>html</code> is provided, the <code>text</code> option will be ignored.'
        )
      })
    })
  })

  describe('getMacroOptionsJson', () => {
    describe('Component directories from NHS.UK frontend', () => {
      it.each([
        'action-link',
        'back-link',
        'breadcrumb',
        'button',
        'card',
        'character-count',
        'checkboxes',
        'contents-list',
        'date-input',
        'details',
        'do-dont-list',
        'error-message',
        'error-summary',
        'fieldset',
        'footer',
        'header',
        'hero',
        'hint',
        'images',
        'input',
        'inset-text',
        'label',
        'pagination',
        'panel',
        'radios',
        'select',
        'skip-link',
        'summary-list',
        'tables',
        'tabs',
        'tag',
        'task-list',
        'textarea',
        'warning-callout'
      ])("should return macro options for '%s' directory", (component) => {
        expect(getMacroOptionsJson(component)).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              name: expect.any(String),
              type: expect.any(String),
              required: expect.any(Boolean),
              description: expect.any(String)
            })
          ])
        )
      })
    })

    describe('Item names from NHS.UK digital service manual', () => {
      it.each([
        'breadcrumbs',
        'buttons',
        'care-cards',
        'do-and-dont-lists',
        'expander',
        'hint-text',
        'table',
        'text-input'
      ])("should return macro options for '%s' item", (component) => {
        expect(getMacroOptionsJson(component)).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              name: expect.any(String),
              type: expect.any(String),
              required: expect.any(Boolean),
              description: expect.any(String)
            })
          ])
        )
      })
    })

    describe('Unknown item names', () => {
      beforeEach(() => {
        jest.spyOn(console, 'log').mockImplementation(() => {})
      })

      it.each([
        'cryptic-text',
        'dont-care-cards',
        'forward-link',
        'unexpander'
      ])("should return empty array for '%s' item", (component) => {
        expect(getMacroOptionsJson(component)).toEqual([])

        expect(console.log).toHaveBeenCalledWith('Not found:', {
          component,
          item: component,
          path: expect.any(String)
        })
      })
    })
  })
})
