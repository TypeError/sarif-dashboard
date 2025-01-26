# SARIF Dashboard

A modern web application for **processing** and **visualizing** SARIF (Static Analysis Results Interchange Format) data, built with **Next.js 13** and **shadcn/ui**. The entire pipeline remains **local** to the browser—no data is uploaded to a server—making it a secure and privacy-focused choice for analyzing and sharing static analysis results.

---

## ✨ Key Features

- **Upload or Paste SARIF**  
  Seamlessly upload a `.sarif` file or paste raw SARIF JSON into the app. The data is processed **client-side**, ensuring complete privacy.

- **Privacy-Focused**  
  All SARIF data is stored in **local storage**, making it secure and available for re-analysis without any server-side processing. No external network calls are made with your data.

- **Interactive & Responsive UI**

  - 📊 **Charts**: Bar charts, doughnut charts, and more to visualize trends in your SARIF data.
  - 📋 **Metrics**: Key insights such as total findings, fixable findings, and severity breakdowns.
  - 🔍 **Data Table**: A filterable, searchable table to drill into specific findings.

- **Modern Tech Stack**  
  Powered by **Next.js 13**, styled with **TailwindCSS**, and built with **shadcn/ui** for a professional, sleek, and user-friendly experience.

---

## 🚀 Getting Started

1. **Clone the repository**:

   ```bash
   git clone https://github.com/TypeError/sarif-dashboard.git
   cd sarif-dashboard
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Run the development server**:

   ```bash
   npm run dev
   ```

   Then open [http://localhost:3000](http://localhost:3000) in your browser.

4. **Usage**:
   - **Landing Page**:  
     Upload a SARIF file or paste SARIF JSON to view results.
   - **Dashboard**:  
     View key metrics, analyze charts, and explore findings in a detailed table.

---

## 🔒 Privacy Notice

All SARIF data is processed **locally** in your browser and stored securely in **local storage**. This means:

- No data is sent to any external servers.
- Your findings are available for future reference within the same browser session.

---

## 📘 Learn More About SARIF

The SARIF format is an open standard for representing static analysis tool results.

- Learn more: [SARIF Specification](https://docs.oasis-open.org/sarif/sarif/v2.1.0/sarif-v2.1.0.html)
- Explore samples: [Microsoft SARIF SDK Samples](https://github.com/microsoft/sarif-sdk/tree/main/src/Samples)

---

## 🛠 Technologies Used

- **Next.js 13** – Modern React framework with app router support.
- **TailwindCSS** – Utility-first CSS for rapid styling.
- **shadcn/ui** – Accessible, unstyled component library.
- **TypeScript** – Strictly typed JavaScript for maintainable code.

---

## 📝 License

This project is licensed under the [MIT License](LICENSE).

---

## 🙋 Contributing

Have ideas to improve the dashboard? Found an issue? Contributions are welcome! Feel free to open an issue or submit a pull request.
