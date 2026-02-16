import { highlight, kebabCase, slugify, unindent } from './filters.js'

describe('Filters', () => {
  describe('highlight', () => {
    it('Applies code highlighting', () => {
      expect(highlight('hello <br> world')).toBe(
        'hello <span class="hljs-tag">&lt;<span class="hljs-name">br</span>&gt;</span> world'
      )
    })
  })

  describe('kebabCase', () => {
    it.each([
      {
        input: 'exampleErrorSummary',
        output: 'example-error-summary'
      },
      {
        input: 'example.errorSummary',
        output: 'example-error-summary'
      },
      {
        input: 'exampleERRORSummary',
        output: 'example-error-summary'
      },
      {
        input: 'not camel case example',
        output: 'not-camel-case-example'
      }
    ])("Formats '$input' to '$output'", ({ input, output }) => {
      expect(kebabCase(input)).toEqual(output)
    })
  })

  describe('slugify', () => {
    it.each([
      {
        input: 'Example heading',
        output: 'example-heading'
      },
      {
        input: 'Example   heading',
        output: 'example-heading'
      },
      {
        input: 'Example: Heading',
        output: 'example-heading'
      },
      {
        input: 'Example - Heading',
        output: 'example-heading'
      },
      {
        input: 'Example -- Heading',
        output: 'example-heading'
      },
      {
        input: "Example's Heading",
        output: 'examples-heading'
      }
    ])("Formats '$input' to '$output'", ({ input, output }) => {
      expect(slugify(input)).toEqual(output)
    })
  })

  describe('unindent', () => {
    it.each([
      {
        input: `
        Example heading
        `,
        output: `
Example heading
`
      },
      {
        input: `
          Example heading
        `,
        output: `
  Example heading
`
      },
      {
        input: `
            Example heading
        `,
        output: `
    Example heading
`
      },
      {
        input: `
          <p>
            Example heading
          </p>
        `,
        output: `
  <p>
    Example heading
  </p>
`
      },
      {
        input: `
        <p>
          Example heading
        </p>
        `,
        output: `
<p>
  Example heading
</p>
`
      },
      {
        input: `
<p>
  Example heading
</p>
`,
        output: `
<p>
  Example heading
</p>
`
      },
      {
        input: `
          <p>
        -   Example heading 1
        +   Example heading 2
          </p>
        `,
        output: `
  <p>
-   Example heading 1
+   Example heading 2
  </p>
`
      },
      {
        input: `
            <p>
          -   Example heading 1
          +   Example heading 2
            </p>
        `,
        output: `
    <p>
  -   Example heading 1
  +   Example heading 2
    </p>
`
      }
    ])('Removes smallest indentation from all lines', ({ input, output }) => {
      expect(unindent(input)).toEqual(output)
    })
  })
})
