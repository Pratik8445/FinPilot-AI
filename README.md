# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.





# AI Financial Analyst - Complete Project Documentation

## 1. Project Overview

### What this project is
AI Financial Analyst is a full-stack web application that allows users to upload annual financial reports in PDF format and receive AI-generated financial analysis. The system combines a React frontend, a FastAPI backend, a PostgreSQL database, and the Groq LLM API to create a practical AI-powered financial research workflow.

### Problem statement
Most financial analysis workflows are slow, manual, and difficult to scale. Analysts often need to read long reports, extract key business insights, identify risks, and summarize performance manually. This process can be time-consuming and inconsistent across users.

This project addresses that problem by automating the first layer of financial analysis:
- Extracting text from uploaded PDF reports
- Sending the extracted content to an LLM for summarization and analysis
- Returning structured financial insights such as company overview, revenue trends, profitability, risks, and investment recommendations

### Why the project exists
The project exists to demonstrate how modern AI capabilities can be applied to real-world financial document analysis. It is not just a demo of a chatbot; it is a working software product concept that combines:
- a user interface,
- a backend API,
- database persistence,
- file handling,
- AI model integration,
- authentication,
- and business workflow logic.

### Business value
The project creates business value by reducing the time needed to process financial reports and by making analysis more accessible to non-experts. A user can upload a report and receive a concise interpretation in minutes instead of manually reading large documents.

### Real-world use case
A small investment firm, analyst team, or startup finance department can use this system to process multiple annual reports quickly. A user can upload a 10-K, annual report, or financial statement PDF and immediately receive AI-generated insights that help with research, decision-making, or summarization.

In the real world, this idea can evolve into:
- an internal analyst assistant,
- a financial research tool,
- a funding or diligence platform,
- or an enterprise-grade document intelligence product.

---

## 2. Features

The application currently includes the following features.

### 2.1 User authentication
Users can register, log in, and access protected parts of the application. The system uses JWT-based authentication to protect routes and ensure only authenticated users can manage their data.

### 2.2 Company management
Users can create, view, edit, and delete companies. Each report is associated with a company, so the project organizes analysis around business entities rather than just uploaded files.

### 2.3 Financial report upload
Users can upload PDF financial reports through the frontend. The system accepts a company selection, report year, and file. The backend validates the input and stores the uploaded file.

### 2.4 PDF text extraction
Once a file is uploaded, the backend extracts text from the PDF using PyMuPDF. This step is essential because the AI model needs readable content to analyze the report.

### 2.5 AI financial analysis
The backend sends the extracted report text to the Groq LLM. The model is prompted to generate structured JSON containing:
- company overview
- revenue analysis
- profitability
- risks
- investment recommendation
- overall rating

### 2.6 Report detail and analysis view
Users can open a report and view its analysis. The UI presents the analysis in a polished card-based layout with sections for each dimension of the financial assessment.

### 2.7 Dashboard overview
The dashboard provides a summary of the user’s companies and reports. It also shows estimated AI usage cost, which is a useful touchpoint for demonstrating the practical economics of AI usage.

### 2.8 Search and list pages
The application includes searchable list pages for companies and reports so users can navigate their content easily.

### 2.9 Delete and cleanup workflows
Users can delete reports and companies. Deleting a report removes its local file and linked analysis data from the application workflow.

---

## 3. High-Level Architecture

The system is composed of several layers that work together.

```text
User
↓
Frontend (React + Vite)
↓
Backend API (FastAPI)
↓
Database (PostgreSQL via SQLAlchemy)
↓
AI Engine (Groq LLM)
↓
External Services
↓
Response to User
```

### User
The user interacts with the web application through a browser.

### Frontend
The React app handles all UI behavior, navigation, forms, authentication state, routing, and user interactions.

### Backend
The FastAPI backend exposes the business logic through API endpoints. It validates requests, processes files, interacts with the database, calls AI services, and returns structured responses.

### Database
The PostgreSQL database stores users, companies, reports, and analysis results.

### AI Engine
The Groq LLM analyzes the extracted text and generates structured financial insights.

### External Services
The application depends on the Groq API and the database service.

### Response
The application returns data to the frontend, which renders it to the user in a meaningful format.

---

## 4. Complete Project Flow

This section explains the full request lifecycle for the most important user action: uploading a report and analyzing it.

### 4.1 User action
A user navigates to the upload page, selects a company, chooses a year, and uploads a PDF report.

### 4.2 Frontend collects input
The React page builds a form payload containing:
- company ID
- report year
- PDF file

### 4.3 React sends request
The frontend uses Axios to send a multipart form-data request to the backend endpoint `/api/v1/reports/upload`.

### 4.4 FastAPI receives the request
The FastAPI endpoint receives the incoming request and passes the data to the financial report service.

### 4.5 Router validates and routes
The router directs the request to the right endpoint module. The data is routed through the reports API layer.

### 4.6 Service executes business logic
The financial report service checks whether the selected company exists. If yes, it creates a storage location for the uploaded file and saves it locally.

### 4.7 File is stored on disk
The uploaded PDF is written into the `uploads` folder. The application saves the path for later reference.

### 4.8 PDF text is extracted
The backend uses PyMuPDF to open the PDF and extract text page by page.

### 4.9 Repository writes to database
The extracted content and report metadata are written to the database using the financial report repository.

### 4.10 AI analysis starts
After the report record is stored, the application calls the AI analysis service.

### 4.11 AI service sends prompt to Groq
The AI service passes the extracted text to the Groq service, which constructs a prompt for the language model.

### 4.12 LLM returns structured analysis
The model returns JSON containing the requested analysis sections and an overall rating.

### 4.13 Response is parsed and validated
The backend parses the JSON and validates it against a Pydantic schema.

### 4.14 Analysis is stored in database
The structured analysis is saved to the database and linked to the original report.

### 4.15 Response is returned to frontend
The backend returns the report object or analysis object to the frontend.

### 4.16 Frontend renders result
The React page redirects the user to the report detail view, where the app displays the analysis.

---

## 5. End-to-End Data Flow

### Data flow summary
Data moves through the system in the following way:

```text
Browser input
↓
React state/form
↓
Axios request
↓
FastAPI route
↓
Service layer
↓
Repository layer
↓
PostgreSQL database
↓
Groq API
↓
Response parsing
↓
Database persistence
↓
Frontend rendering
```

### Where data travels

#### User input data
User input such as name, email, password, company name, company ticker, report year, and file selection is collected in the React interface.

#### API payload data
The frontend converts these values into HTTP requests using Axios. For uploads, it uses multipart form data.

#### Backend processing data
The backend receives the request and validates it using Pydantic models and FastAPI request parsing.

#### Persistence data
The application persists structured data in PostgreSQL through SQLAlchemy ORM models.

#### File data
PDF files are saved to the local uploads directory and referenced by the report model.

#### AI data
Extracted text is sent to the Groq API. The response is parsed and stored as structured insights.

#### UI data
The frontend receives these values and renders them to pages like the dashboard, reports page, and report detail page.

---

## 6. Folder Structure

The repository is organized into two main parts: backend and frontend.

```text
ai-financial-analyst/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   ├── core/
│   │   ├── database/
│   │   ├── models/
│   │   ├── repositories/
│   │   ├── schemas/
│   │   └── services/
│   ├── uploads/
│   ├── main.py
│   ├── requirements.txt
│   └── test_db.py
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   ├── vite.config.js
│   └── index.html
└── README_PROJECT.md
```

### Why the backend and frontend are separated
The backend and frontend are separated because they have different responsibilities.

The frontend is responsible for:
- displaying the user interface,
- handling browser interactions,
- managing client-side state,
- and calling the API.

The backend is responsible for:
- authentication,
- file handling,
- database access,
- AI processing,
- and business rules.

This separation improves maintainability, scalability, and clarity. It also allows the frontend and backend to evolve independently.

### Root folder explanation
The project root contains the overall application workspace. It groups the frontend and backend into clearly separated areas so that development, deployment, and documentation are easier to manage.

### Backend folder explanation
The backend folder contains the FastAPI server, dependency list, application package, and uploads directory. It is the business logic core of the system.

### Frontend folder explanation
The frontend folder contains React code, Vite configuration, public assets, and UI pages. It is the user-facing part of the product.

---

## 7. Technology Stack

This section explains every major technology used in the project.

| Category | Technology | Why it is used |
|---|---|---|
| Frontend language | JavaScript / JSX | React components are written in modern JavaScript syntax with JSX |
| Frontend framework | React | Used to build the interactive user interface |
| Frontend build tool | Vite | Used for fast development and optimized production builds |
| Frontend routing | React Router | Used to navigate between login, dashboard, reports, companies, and detail pages |
| Frontend HTTP client | Axios | Used to send requests to the backend API |
| Backend language | Python | Used to build the API and business logic |
| Backend framework | FastAPI | Used to create REST APIs quickly with strong validation and async support |
| API validation | Pydantic | Used to validate request and response data |
| Database ORM | SQLAlchemy | Used to define models and interact with PostgreSQL |
| Database | PostgreSQL | Used as the relational store for users, companies, reports, and analysis |
| Authentication | JWT | Used to protect routes and identify users |
| Password hashing | bcrypt via Passlib | Used to securely hash passwords |
| File parsing | PyMuPDF | Used to extract text from PDF files |
| AI provider | Groq | Used to call a large language model for financial analysis |
| HTTP server | Uvicorn | Used to run the FastAPI application |
| File upload support | Python-Multipart | Used to accept file uploads in FastAPI |
| Environment config | Pydantic Settings + dotenv | Used to load environment values |
| Logging | Python logging | Used for application logs |

### Why each technology was chosen

#### Why FastAPI instead of Flask
FastAPI was chosen because it provides a modern development experience with built-in request validation, automatic docs, good performance, and strong integration with Pydantic. For this project, FastAPI is a better fit than Flask because the project needs clear API schemas and clean request handling.

#### Why React instead of Angular
React was chosen because it is simple to use for a single-page application and works well for building interactive pages such as dashboards, forms, and report detail views. Angular would likely be heavier for this kind of project and would require more boilerplate.

#### Why PostgreSQL instead of MongoDB
PostgreSQL was chosen because the application uses clearly structured data such as users, companies, reports, and analysis records. Relational data fits well into SQL tables and relationships. MongoDB would be more suitable for document-heavy or schemaless data, which is not the strongest fit here.

#### Why Groq instead of OpenAI or other providers
Groq was chosen because the application is designed to demonstrate AI-powered financial analysis using a fast and accessible LLM provider. The code is already structured so the AI provider can be replaced later if needed.

#### Why SQLAlchemy instead of raw SQL
SQLAlchemy was chosen to keep the code cleaner and more maintainable. It allows the project to use Python classes to represent database entities instead of writing repetitive SQL statements.

---

## 8. Project Architecture

### 8.1 Layered architecture
The project follows a layered architecture:
- API layer for routing and request handling
- service layer for business logic
- repository layer for database access
- model layer for persistence entities
- schema layer for validation and serialization

This keeps responsibilities separate and makes the code easier to understand.

### 8.2 Repository pattern
The repository pattern is used to isolate database operations from the service layer. Services call repository classes rather than directly manipulating the database. This makes the code more modular and easier to test.

### 8.3 Dependency injection
FastAPI dependency injection is used for database sessions and authentication. This makes the application easier to compose and more flexible for future changes.

### 8.4 MVC-style organization
Although it is not a classic MVC framework, the structure follows a similar pattern:
- routes = controllers
- services = business logic
- models = data layer
- views = React pages/components

### 8.5 Clean architecture principles
The project follows some clean architecture principles by separating concerns into distinct folders and layers. The business logic is not embedded directly inside the UI or the route handlers.

### 8.6 SOLID principles
The code demonstrates several SOLID-like practices:
- single responsibility in service classes,
- dependency inversion through repository injection,
- separation of concerns between API and business logic.

---

## 9. Design Patterns

### 9.1 Repository pattern
Used to centralize database access operations.

### 9.2 Service layer pattern
Used to keep business logic separate from request handling.

### 9.3 Dependency injection pattern
Used for database sessions and authentication dependencies.

### 9.4 Provider pattern
The authentication context in React acts like a provider for global user state.

### 9.5 Component-based UI pattern
The React frontend uses reusable components such as navbar, sidebar, modal, loading spinner, and error message.

### 9.6 Factory-like construction
The services instantiate repositories and dependencies in a structured way rather than hardcoding everything in routes.

---

## 10. API Architecture

### 10.1 RESTful architecture
The backend exposes REST-style endpoints under `/api/v1`.

### 10.2 Versioning
The API is versioned using the `/api/v1` prefix.

### 10.3 Error handling
The application has centralized exception handlers for:
- validation errors,
- HTTP exceptions,
- and unexpected server errors.

### 10.4 Validation
Pydantic schemas validate request and response models. This prevents malformed input and creates predictable API responses.

### 10.5 Authentication
The API uses bearer-token JWT authentication. Protected endpoints require a valid bearer token to access private features.

### 10.6 Main API endpoints

| Endpoint | Purpose |
|---|---|
| POST /api/v1/auth/register | Register a user |
| POST /api/v1/auth/login | Log in and get a JWT |
| GET /api/v1/auth/me | Get current user |
| POST /api/v1/companies | Create a company |
| GET /api/v1/companies | List companies |
| PUT /api/v1/companies/{id} | Update company |
| DELETE /api/v1/companies/{id} | Delete company |
| POST /api/v1/reports/upload | Upload and analyze a report |
| GET /api/v1/reports | List reports |
| GET /api/v1/reports/{id} | Get one report |
| DELETE /api/v1/reports/{id} | Delete report |
| POST /api/v1/analysis/{id} | Trigger analysis |
| GET /api/v1/analysis/{id} | Retrieve analysis |

---

## 11. Database Architecture

### 11.1 Database choice
The project uses PostgreSQL as the relational database.

### 11.2 Tables
The database contains the following main tables:

| Table | Purpose |
|---|---|
| users | Stores account information for each user |
| companies | Stores company records |
| financial_reports | Stores uploaded report metadata and extracted text |
| ai_analysis | Stores the AI-generated analysis for each report |

### 11.3 Relationships
- Each financial report belongs to one company.
- Each AI analysis belongs to one report.
- A report can have only one AI analysis in the current model.

### 11.4 Normalization
The schema is relatively normalized. Report data is separated from company data and analysis data, rather than embedding everything in one table.

### 11.5 Indexes
The models use primary keys and indexes on important fields such as email and IDs.

### 11.6 Transactions
The repository layer uses commit and refresh operations to persist changes. This ensures the state is saved consistently after create, update, and delete operations.

### 11.7 Data model summary

```text
User 1 --- * Company
Company 1 --- * FinancialReport
FinancialReport 1 --- 1 AIAnalysis
```

---

## 12. AI Architecture

### 12.1 Why AI is used
The project uses AI to transform raw financial documents into structured insight. This adds value beyond basic file storage.

### 12.2 Prompt design
The prompt sent to the LLM instructs it to:
- act as a senior financial analyst,
- return only valid JSON,
- include specific analysis sections,
- stay concise,
- and avoid markdown.

### 12.3 Context handling
The AI model receives the extracted text from the PDF report. The prompt attaches the text to the model request, allowing the model to analyze the content.

### 12.4 Model choice
The current implementation uses the Groq model `llama-3.3-70b-versatile`.

### 12.5 Response structure
The response is expected to contain:
- company overview
- revenue analysis
- profitability
- risks
- investment recommendation
- overall rating

### 12.6 Storage strategy
After receiving the analysis, the backend stores it in the database with a link to the corresponding report.

### 12.7 Caching and repeat prevention
The AI analysis service checks whether analysis already exists for a report before creating a new one. This prevents duplicate model calls for the same report.

---

## 13. Security

The project includes several security measures, although it is still an MVP and not yet production-grade in every respect.

### 13.1 Authentication
JWT tokens are used to authenticate users and protect private routes.

### 13.2 Password storage
Passwords are hashed with bcrypt before being stored.

### 13.3 Authorization
Protected endpoints require a valid logged-in user context.

### 13.4 CORS
The backend enables CORS for the local React dev server so the frontend can communicate with the backend.

### 13.5 Input validation
Pydantic schemas validate incoming data, and form validation is implemented on the frontend as well.

### 13.6 File validation
The frontend only accepts PDF files, and the backend rejects invalid PDF content.

### 13.7 Error handling
The application returns structured error responses instead of leaking unhandled exceptions to the client.

### 13.8 Production concerns
For production, the application would need stronger security controls such as:
- refresh tokens,
- role-based access control,
- secret management,
- HTTPS enforcement,
- rate limiting,
- and secure file storage.

---

## 14. Scalability

The project is currently a strong MVP, but it is also designed with scalability in mind.

### 14.1 Small scale: 10 users
At this scale, the current architecture is more than sufficient. A single backend instance and local file storage can support a small team or personal demo.

### 14.2 Medium scale: 100 users
At this scale, the system would benefit from better infrastructure such as:
- a managed database,
- proper environment configuration,
- and stronger monitoring.

### 14.3 Larger scale: 1,000 users
At this scale, the system should include:
- separate application and database servers,
- background workers for AI processing,
- improved logging,
- and possibly caching for repeated reads.

### 14.4 Very large scale: 10,000 users
At this scale, the architecture should move toward:
- containerization,
- load balancing,
- replication,
- autoscaling,
- and asynchronous processing.

### 14.5 Massive scale: 100,000 to 1 million users
At that scale, the system would need:
- multiple backend instances,
- load balancers,
- CDN for static assets,
- Redis or similar cache layer,
- Kafka or a message broker for background tasks,
- and advanced monitoring.

### 14.6 Recommended scalability upgrades
The following upgrades would make the project more scalable:

- Load Balancer: distribute requests across multiple backend instances
- NGINX: serve static assets and act as a reverse proxy
- Docker: package the app consistently for deployment
- Redis: cache repeated API responses and session data
- Kafka: process AI analysis jobs asynchronously
- Horizontal Scaling: add more app instances as demand grows
- Vertical Scaling: increase CPU and memory for larger workloads
- Caching: reduce repeated reads and expensive AI calls
- CDN: speed up static frontend assets delivery
- Rate Limiting: protect the API from abuse
- Background Workers: move AI tasks out of the request path
- Async Processing: improve responsiveness and throughput

---

## 15. Deployment

### 15.1 Local development
The app is designed to run locally with:
- a React dev server for the frontend,
- and a Python/FastAPI server for the backend.

### 15.2 Docker
Docker is a natural next step for deployment. The frontend and backend could be containerized independently or together.

### 15.3 Docker Compose
Docker Compose could be used to define the app, database, and supporting services in one setup.

### 15.4 CI/CD
The project could be deployed through GitHub Actions for automated build and deployment pipelines.

### 15.5 Kubernetes
For larger-scale deployment, the app could be moved to Kubernetes for orchestration and scaling.

### 15.6 Cloud deployment
Cloud deployment options include Azure, AWS, or GCP. A production deployment would likely involve:
- managed PostgreSQL,
- object storage for uploaded reports,
- a managed container platform,
- and secrets management.

---

## 16. Future Improvements

The current app is a solid MVP, but there are many realistic improvements for the next phase.

### 16.1 Background AI processing
Currently, AI analysis happens during the upload request. A better design would move this into a background worker so the user does not have to wait for the full model response.

### 16.2 Cloud file storage
The current implementation uses local disk storage. In production, cloud object storage would be more reliable and scalable.

### 16.3 Database migrations
The project uses SQLAlchemy model creation on startup, but a formal migration workflow would be stronger for production and team collaboration.

### 16.4 Better testing
The project would benefit from unit tests, integration tests, and end-to-end tests for core flows.

### 16.5 Better authentication flows
The app could add refresh tokens, password reset, email verification, and role-based permissions.

### 16.6 Advanced analytics UI
The frontend could support richer charts, saved searches, and historical trend analysis across multiple companies and years.

### 16.7 Multi-tenant and enterprise features
The platform could evolve into a multi-user enterprise product with team workspaces, audit logs, and access controls.

---

## 17. Resume Value

This project is strong from a resume and interview perspective because it demonstrates that the builder understands how to combine multiple modern technologies into a complete product.

### Why it impresses recruiters
Recruiters like projects that show:
- end-to-end software development,
- API design,
- database modeling,
- AI integration,
- and frontend/backend coordination.

This project does all of that in one repository.

### Interview discussion points
A candidate can discuss:
- why the project uses a layered architecture,
- how the AI workflow works,
- why the backend and frontend are separated,
- how authentication and authorization are handled,
- how data moves from frontend to database to AI service and back,
- and what tradeoffs were made in the current implementation.

### Architecture decisions to highlight
Good interview talking points include:
- choosing FastAPI for speed and validation,
- using SQLAlchemy for clean database abstraction,
- separating services and repositories for maintainability,
- and using React for a modern single-page experience.

### Tradeoffs to explain
A strong interview answer should also mention tradeoffs such as:
- using local file storage for simplicity instead of cloud object storage,
- performing AI processing synchronously instead of asynchronously,
- and using a simple authentication approach rather than a full enterprise auth system.

### What companies expect
Companies typically expect developers to understand:
- system design basics,
- API architecture,
- database relationships,
- authentication flows,
- and how to build a practical product from multiple layers.

This project demonstrates those skills in a concrete and understandable way.

---

## 18. Summary

AI Financial Analyst is a full-stack AI application that brings together a React frontend, a FastAPI backend, a PostgreSQL database, and Groq-powered financial analysis. It is a practical example of how modern web development and AI integration can be combined into a working, real-world product.

The project is valuable because it is not just a frontend demo or a single-script AI prototype. It is a complete workflow that includes:
- user registration and login,
- company management,
- financial report upload,
- PDF text extraction,
- AI content generation,
- database persistence,
- and responsive frontend rendering.

That makes it a strong example of modern full-stack engineering and a strong candidate for technical interviews, portfolio reviews, and recruiter discussions.
