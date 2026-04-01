# Career-Tracker | Serverless Backend & Data Architecture
### Automated Data Pipeline for the 2026 Frontend Job Market

This repository houses the architectural logic and backend configurations for a real-time career search ecosystem. It serves as the data-source for the [Angular Job Board](https://github.com/Peterbgood/angular-job-board), demonstrating a seamless integration between **Google Sheets API**, **Google Apps Script**, and modern frontend frameworks.

---

## 🏗️ Architectural Overview
Instead of a traditional SQL/Node.js backend, this project utilizes a **Serverless "Sheets-as-a-DB"** architecture. This allows for rapid data entry, zero-cost hosting, and instant UI updates without the overhead of database migrations.

### **The Data Flow:**
1. **Input:** Job opportunities are logged in a structured Google Sheet (FISS, TeamHealth, etc.).
2. **Process:** A custom **Google Apps Script** (GAS) acts as the API layer, fetching and formatting the spreadsheet rows.
3. **Transport:** Data is delivered via a **JSONP Handshake** to bypass CORS redirects within the Google ecosystem.
4. **Consumption:** The Angular frontend consumes the stream using **Reactive Signals** for real-time UI rendering.

---

## 🛠️ Technical Components
* **Logic Layer:** Google Apps Script (JavaScript)
* **API Pattern:** REST-compliant GET requests with JSONP support.
* **Data Schema:** * `jobTitle`: String
    * `company`: String
    * `locationType`: Enum (Remote/Hybrid/On-site)
    * `salaryRange`: String
    * `status`: Workflow stage (Applied/Interviewing/Offer)
* **Automation:** Triggers for data validation and timestamping.

---

## 🛡️ Key Technical Solutions
### **CORS & Redirect Resolution**
One of the primary challenges in this architecture was handling the `302 Redirect` issued by Google Apps Script. 
* **The Solution:** Implemented a robust JSONP communication bridge within the Angular `HttpClient` module, ensuring stable data delivery across domains without the need for a proxy server.

### **Data Normalization**
Includes logic to handle varied input formats from different job boards, normalizing them into a consistent camelCase JSON structure for frontend consumption.

---

## 🚀 Strategic Purpose
As a **Senior Web Developer with 13+ years of experience**, I built this tracker to demonstrate:
1. **Efficiency:** Building high-utility tools with minimal infrastructure costs.
2. **Problem Solving:** Overcoming modern browser security hurdles (CORS).
3. **Full-Stack Thinking:** Managing the entire lifecycle of data from entry to visualization.

---

## 📫 Contact
**Peter Good** *Senior Frontend Web Developer* 📍 Seymour, TN | Expert in React, Angular, and Fintech Solutions

---
*Powered by Google Cloud & Angular 19*
