module.exports = class Html {
  constructor(html, css) {
    this.html = html;
    this.css = css;
  }

  getWrappedHtml() {
    return `<html>
      <head>
        <link rel="stylesheet" href="file://${this.css}" />
        <style>
          @media print {
            .pagebreak:not(:last-child) {
              page-break-after: always !important;
            }
          }
        </style>
      </head>
      <body>
        <div>
          ${this.html.map((html) => `<div class="pagebreak">${html}</div>`).join('')}
        </div>
      </body>
    </html>`
  }
}
