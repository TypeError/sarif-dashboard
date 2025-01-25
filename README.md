# SARIF Dashboard

SARIF Dashboard is a modern web application for processing and visualizing SARIF (Static Analysis Results Interchange Format) data. This project ensures that all data is processed locally in the browser, maintaining user privacy.

## Features

- **Upload or Paste SARIF**: Users can upload a SARIF file or paste SARIF JSON directly into the application.
- **Client-Side Validation**: SARIF data is validated entirely in the browser using Zod and a custom validation schema.
- **Privacy-Focused**: No data is sent to the server; everything is handled locally.
- **Smooth Navigation**: SARIF content is encoded as base64 and passed via the URL hash for secure client-side navigation.

## Privacy Notice

SARIF Dashboard processes all SARIF data locally in your browser. No data is sent to the server or stored externally.

## Technologies Used

- **Framework**: [Next.js](https://nextjs.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/), [shadcn/ui](https://ui.shadcn.com/)
- **Validation**: [Zod](https://zod.dev/)

## License

This project is licensed under the [MIT License](LICENSE).

## Contact

For questions or feedback, please reach out to [your email/contact info].
