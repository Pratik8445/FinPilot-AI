# Backend Documentation

## 1. Backend Overview

### Purpose
The backend is the server-side engine for the AI Financial Analyst application. It exposes a REST API that lets users register, authenticate, manage companies, upload financial report PDFs, and receive AI-generated financial analysis.

### Responsibilities
The backend is responsible for:
- Handling HTTP requests from the frontend
- Validating request data
- Managing authentication and authorization with JWT
- Persisting users, companies, reports, and AI analysis results in PostgreSQL
- Extracting text from uploaded PDF files using PyMuPDF
- Sending report content to Groq for AI analysis
- Returning structured responses to the client

### Why the backend exists
The frontend is a React UI, but it cannot reliably store data, process PDFs, or call AI models on its own. The backend exists to centralize these responsibilities in a secure, consistent, and maintainable service.

### Problems it solves
The backend solves several practical problems:
- It keeps business logic out of the browser
- It protects secrets such as the database URL and Groq API key
- It provides a single interface for the frontend to use
- It stores data persistently instead of relying on browser memory
- It performs AI analysis in a controlled environment

---

## 2. Backend Architecture

The backend follows a layered architecture:

```text
Client
↓
API Layer
↓
Services
↓
Repositories
↓
Database
↓
AI Services
↓
Response
```

### API Layer
The API layer contains FastAPI routers and endpoint functions. These files receive incoming HTTP requests and translate them into Python function calls.

Why it exists:
- To define the public interface of the application
- To map URLs to application behavior
- To parse request bodies and query parameters

How data moves:
- The browser sends an HTTP request to a route such as `/api/v1/auth/login`
- The route extracts the request data
- The route passes the data to a service layer function
- The service layer performs business logic and returns a result

### Service Layer
The service layer contains the domain logic for features such as authentication, company management, report handling, and AI analysis.

Why it exists:
- To keep business rules separate from the HTTP layer
- To make logic easier to test and modify
- To prevent endpoint files from becoming too large

How data moves:
- The endpoint creates a service object
- The service uses repository objects or direct ORM access to interact with the database
- The service returns a domain object or response model

### Repository Layer
The repository layer is responsible for database access patterns.

Why it exists:
- To isolate data access code from business logic
- To make persistence logic explicit
- To simplify future changes in the database layer

How data moves:
- Services call repository methods
- Repositories issue SQLAlchemy queries
- Results are returned as model instances

### Database Layer
The database layer is built around SQLAlchemy and PostgreSQL.

Why it exists:
- To persist data across application restarts
- To support structured querying and relationships
- To make the system reliable and consistent

How data moves:
- The ORM creates and updates model instances
- The database stores rows for users, companies, reports, and analyses
- Those rows are later loaded and returned to the application

### AI Services Layer
The AI layer is responsible for sending report content to Groq and parsing the response.

Why it exists:
- To separate AI integration from the core application flow
- To make AI failure handling explicit
- To keep the model prompt logic in one place

How data moves:
- The report service or AI analysis service passes extracted text to Groq
- Groq returns a JSON response
- The response is parsed into a schema object and stored in the database

### Why this architecture is scalable
This architecture is scalable because each layer has a narrow responsibility. As the product grows, new endpoints can be added without rewriting persistence logic, and new services can be introduced without changing the API layer. It also supports replacing technologies later, for example swapping the AI provider or database driver, without changing the surrounding app structure.

---

## 3. Folder Structure

### Root backend files
- `main.py`: application entrypoint and FastAPI initialization
- `requirements.txt`: Python dependency list
- `.env`: environment variable configuration
- `test_db.py`: simple database connectivity smoke test
- `alembic.ini`: Alembic configuration file for database migrations
- `uploads/`: directory used to store uploaded PDF files temporarily or persistently

### app/
Why it exists:
- The main application package containing all backend logic.

What belongs inside:
- API routes, services, models, schemas, and supporting utilities.

When it is used:
- On every backend request.

What should never be placed there:
- Frontend assets or browser-only code.

### app/api/
Why it exists:
- To organize API-related code.

What belongs inside:
- Dependency helpers and versioned endpoint routers.

When it is used:
- During request handling.

What should never be placed there:
- Database ORM models or AI prompt logic.

### app/api/v1/
Why it exists:
- To provide versioned API routing under `/api/v1`.

What belongs inside:
- Endpoint definitions for authentication, companies, reports, health checks, and AI analysis.

When it is used:
- Whenever the application receives a request that matches the versioned route prefix.

What should never be placed there:
- Business logic that should be moved to services.

### app/api/v1/endpoints/
Why it exists:
- To store endpoint-specific router modules.

What belongs inside:
- Route definitions for auth, companies, reports, analysis, and health.

When it is used:
- When a request enters the API layer.

What should never be placed there:
- Raw database queries or AI model calls directly; those belong in services.

### app/core/
Why it exists:
- To hold shared infrastructure concerns.

What belongs inside:
- Configuration, security helpers, exception handlers, and logging.

When it is used:
- Everywhere in the application.

What should never be placed there:
- Feature-specific business logic.

### app/database/
Why it exists:
- To manage database engine setup, session management, and the SQLAlchemy base class.

What belongs inside:
- Connection configuration, session factories, and declarative base.

When it is used:
- On startup and for each request that needs database access.

What should never be placed there:
- Endpoint route definitions or AI prompts.

### app/models/
Why it exists:
- To define the SQLAlchemy ORM models.

What belongs inside:
- User, Company, FinancialReport, and AIAnalysis models.

When it is used:
- When tables are created and when the ORM loads or writes rows.

What should never be placed there:
- HTTP request/response structures or UI components.

### app/repositories/
Why it exists:
- To encapsulate persistence operations.

What belongs inside:
- CRUD-like methods for each model domain.

When it is used:
- From services that need database reads or writes.

What should never be placed there:
- Authentication or PDF-extraction logic.

### app/schemas/
Why it exists:
- To define validation and response models using Pydantic.

What belongs inside:
- Request schemas, response schemas, and AI response parsing models.

When it is used:
- For request validation and response serialization.

What should never be placed there:
- Database models or service business logic.

### app/services/
Why it exists:
- To contain the primary business logic of the application.

What belongs inside:
- Authentication service, company service, report service, AI analysis service, and Groq service.

When it is used:
- From endpoints after request validation.

What should never be placed there:
- UI-specific code or frontend state management.

---

## 4. Explain Every File

### backend/main.py
Purpose:
- Application entrypoint for the FastAPI backend.

Why required:
- It creates the FastAPI application, attaches middleware, mounts routes, and initializes database tables on startup.

Who calls it:
- The Python process started with Uvicorn or a similar ASGI server.

Which files depend on it:
- The app is imported indirectly by the server process; it wires the rest of the application together.

Functions inside:
- `lifespan()`: creates database tables on startup and logs application lifecycle events.
- `root()`: returns a basic welcome message at `/`.

Classes inside:
- None.

How execution reaches this file:
- The server starts the Python module and executes the FastAPI app creation.

When it executes:
- On application startup and when the root endpoint is called.

What it returns:
- A JSON message for the root endpoint.

What would happen if removed:
- The backend would not start as an application.

Dependencies:
- FastAPI, CORS middleware, router registration, settings, logger, database engine.

Best practices used:
- Startup lifecycle is centralized.
- CORS is configured explicitly.

Possible improvements:
- Add a health check that verifies the database connection instead of only creating tables.

### backend/requirements.txt
Purpose:
- Declares Python dependencies for the project.

Why required:
- It allows the environment to be reproduced consistently.

Who calls it:
- Developers and package installers.

Which files depend on it:
- No source code file depends on it directly; it is used by the environment setup process.

Functions inside:
- None.

Classes inside:
- None.

How execution reaches this file:
- It is read by `pip install -r requirements.txt`.

When it executes:
- During environment setup.

What it returns:
- A list of packages.

What would happen if removed:
- Dependency installation would become manual and error-prone.

Dependencies:
- None.

Best practices used:
- The list is explicit.

Possible improvements:
- Pin a production environment more strictly or split dev and prod dependencies.

### backend/.env
Purpose:
- Stores environment variables for local development.

Why required:
- It provides configuration values for app name, port, database URL, secrets, and Groq credentials.

Who calls it:
- `pydantic-settings` through `Settings` in `app/core/config.py`.

Which files depend on it:
- `app/core/config.py`.

Functions inside:
- None.

Classes inside:
- None.

How execution reaches this file:
- The settings loader reads the file automatically when the app starts.

When it executes:
- On application startup.

What it returns:
- Environment values.

What would happen if removed:
- The app would use default values or fail if required values were missing.

Dependencies:
- Python dotenv support through Pydantic settings.

Best practices used:
- Secrets are centralized in one place.

Possible improvements:
- Do not commit secrets to version control; use a production secret store instead.

### backend/app/api/v1/router.py
Purpose:
- Central router that includes all versioned API routers.

Why required:
- It exposes the full API under one prefix: `/api/v1`.

Who calls it:
- `main.py`.

Which files depend on it:
- `main.py`.

Functions inside:
- None.

Classes inside:
- None.

How execution reaches this file:
- Imported by `main.py` and included in the FastAPI app.

When it executes:
- On application startup and when routes are registered.

What it returns:
- A router object.

What would happen if removed:
- The backend would not expose the API endpoints in this module tree.

Dependencies:
- Endpoint routers for auth, health, companies, reports, and analysis.

Best practices used:
- Versioned API structure is explicit.

Possible improvements:
- Clean up duplicate imports in this file.

### backend/app/api/dependencies.py
Purpose:
- Provides dependency helpers for authentication.

Why required:
- It decodes JWTs and returns the current authenticated user.

Who calls it:
- Endpoints that use `Depends(get_current_user)`.

Which files depend on it:
- Endpoint modules that rely on authentication.

Functions inside:
- `get_current_user()`.

Classes inside:
- None.

How execution reaches this file:
- Imported by endpoints via `from app.core.security import get_current_user` in the current implementation, not via `app.api.dependencies.py` directly.

When it executes:
- When protected routes are called.

What it returns:
- A `User` object if the token is valid.

What would happen if removed:
- Protected endpoints would not have a standard authentication dependency.

Dependencies:
- OAuth2PasswordBearer, JWT decode logic, repository access.

Best practices used:
- Token validation is centralized.

Possible improvements:
- Simplify the duplicate implementation and use one authentication approach consistently.

### backend/app/core/config.py
Purpose:
- Loads application configuration from environment variables.

Why required:
- It centralizes configuration values used by the whole application.

Who calls it:
- Main app, security helpers, Groq service, database connection.

Which files depend on it:
- `main.py`, `app/database/connection.py`, `app/core/security.py`, `app/services/groq_service.py`.

Functions inside:
- `get_settings()`.

Classes inside:
- `Settings`.

How execution reaches this file:
- Imported by modules that need configuration.

When it executes:
- On application startup and when configuration is read.

What it returns:
- A settings object with environment-backed values.

What would happen if removed:
- The application would lose a central configuration source.

Dependencies:
- `pydantic-settings`.

Best practices used:
- Configuration is strongly typed and environment-driven.

Possible improvements:
- Add validation rules for required variables and safer defaults.

### backend/app/core/exceptions.py
Purpose:
- Registers custom exception handlers for FastAPI.

Why required:
- It ensures API errors return a consistent JSON structure.

Who calls it:
- `main.py`.

Which files depend on it:
- `main.py`.

Functions inside:
- `register_exception_handlers()`.

Classes inside:
- None.

How execution reaches this file:
- Called during app startup in `main.py`.

When it executes:
- When exceptions are raised in the app.

What it returns:
- JSON error responses.

What would happen if removed:
- Errors would produce default FastAPI behavior or stack-trace-like responses.

Dependencies:
- FastAPI, logger.

Best practices used:
- Centralized error handling improves consistency.

Possible improvements:
- Add more specific handlers for database errors and validation errors.

### backend/app/core/logger.py
Purpose:
- Configures application logging.

Why required:
- It provides consistent logs for startup, errors, and AI processing events.

Who calls it:
- `main.py`, `exceptions.py`, `groq_service.py`.

Which files depend on it:
- `main.py`, `app/core/exceptions.py`, `app/services/groq_service.py`.

Functions inside:
- `setup_logger()`.

Classes inside:
- None.

How execution reaches this file:
- Imported when modules need logging.

When it executes:
- When the logger is imported and configured.

What it returns:
- A Python logger instance.

What would happen if removed:
- Logging would fall back to Python defaults and become less structured.

Dependencies:
- Python logging.

Best practices used:
- Logging is centralized and simple.

Possible improvements:
- Add rotating file logs and more structured log formatting.

### backend/app/core/security.py
Purpose:
- Handles password hashing, token creation, token decoding, and authentication dependencies.

Why required:
- It powers the application’s authentication system and protects user credentials.

Who calls it:
- Auth endpoints, user service, and protected endpoints.

Which files depend on it:
- `app/services/user_service.py`, `app/api/v1/endpoints/auth.py`, `app/api/v1/endpoints/company.py`, `app/api/v1/endpoints/financial_report.py`, `app/api/v1/endpoints/ai_analysis.py`, and `app/api/dependencies.py`.

Functions inside:
- `hash_password()`
- `verify_password()`
- `create_access_token()`
- `decode_access_token()`
- `get_current_user()`

Classes inside:
- None.

How execution reaches this file:
- Imported by the modules that need authentication or password handling.

When it executes:
- On login, registration, and any protected request.

What it returns:
- Hashed passwords, JWTs, or authenticated users.

What would happen if removed:
- Authentication would not work.

Dependencies:
- Passlib, JWT library, SQLAlchemy, settings.

Best practices used:
- Password hashing is delegated to a secure password context.
- JWT creation is centralized.

Possible improvements:
- Add refresh token support and stronger token rotation.

### backend/app/database/base.py
Purpose:
- Defines the declarative base class for SQLAlchemy models.

Why required:
- All ORM models inherit from this base class so SQLAlchemy can manage them consistently.

Who calls it:
- All model files.

Which files depend on it:
- All model modules.

Functions inside:
- None.

Classes inside:
- `Base`.

How execution reaches this file:
- Imported by each SQLAlchemy model.

When it executes:
- When the models are loaded.

What it returns:
- A declarative base class.

What would happen if removed:
- SQLAlchemy models would not be able to register with the metadata system properly.

Dependencies:
- SQLAlchemy.

Best practices used:
- Standard declarative pattern.

Possible improvements:
- Add common mixins for timestamps or soft-delete behavior.

### backend/app/database/connection.py
Purpose:
- Creates the SQLAlchemy engine.

Why required:
- It establishes the connection to PostgreSQL using the configured URL.

Who calls it:
- `app/database/session.py`.

Which files depend on it:
- `app/database/session.py`, `backend/test_db.py`.

Functions inside:
- None.

Classes inside:
- None.

How execution reaches this file:
- Imported by the session module and the test DB script.

When it executes:
- On startup and when database access is initialized.

What it returns:
- A SQLAlchemy engine object.

What would happen if removed:
- The app would not be able to connect to the database.

Dependencies:
- SQLAlchemy, settings.

Best practices used:
- `pool_pre_ping=True` helps detect stale database connections.

Possible improvements:
- Add connection pool tuning for production load.

### backend/app/database/session.py
Purpose:
- Provides the database session factory and `get_db()` dependency helper.

Why required:
- It ensures each request gets a database session that is closed afterward.

Who calls it:
- Endpoint functions and protected route dependencies.

Which files depend on it:
- All endpoint modules and security helpers.

Functions inside:
- `get_db()`.

Classes inside:
- None.

How execution reaches this file:
- Imported by endpoints through dependency injection.

When it executes:
- For every request that uses a database-backed endpoint.

What it returns:
- A SQLAlchemy session generator.

What would happen if removed:
- Endpoints would not have a standard way to query the database.

Dependencies:
- SQLAlchemy sessionmaker and engine.

Best practices used:
- Session lifecycle is managed explicitly.

Possible improvements:
- Add transaction handling for larger operations.

### backend/app/models/user.py
Purpose:
- Defines the `User` ORM model.

Why required:
- It stores user account information.

Who calls it:
- Repositories, services, and security helpers.

Which files depend on it:
- `app/services/user_service.py`, `app/repositories/user_repository.py`, `app/core/security.py`, `app/api/v1/endpoints/auth.py`.

Functions inside:
- None.

Classes inside:
- `User`.

How execution reaches this file:
- Imported when the models are loaded during app startup.

When it executes:
- At import time and when database operations run.

What it returns:
- A model class definition.

What would happen if removed:
- User accounts could no longer be stored in the database.

Dependencies:
- SQLAlchemy, declarative base.

Best practices used:
- The email column is unique and indexed.

Possible improvements:
- Add timestamps for update tracking and a soft-delete field.

### backend/app/models/company.py
Purpose:
- Defines the `Company` ORM model.

Why required:
- It stores the companies that users manage.

Who calls it:
- Company service and repository.

Which files depend on it:
- `app/services/company_service.py`, `app/repositories/company_repository.py`.

Functions inside:
- None.

Classes inside:
- `Company`.

How execution reaches this file:
- Imported during model initialization and by the repository/service layer.

When it executes:
- At import time and during CRUD operations.

What it returns:
- A model class definition.

What would happen if removed:
- Company management would break.

Dependencies:
- SQLAlchemy, declarative base.

Best practices used:
- The ticker column is unique.

Possible improvements:
- Add ownership relationships to users if multi-user access is needed.

### backend/app/models/financial_report.py
Purpose:
- Defines the `FinancialReport` ORM model.

Why required:
- It stores report metadata and extracted text for each uploaded PDF.

Who calls it:
- Financial report service and repository.

Which files depend on it:
- `app/services/financial_report_service.py`, `app/repositories/financial_report_repository.py`, `app/services/ai_analysis_service.py`.

Functions inside:
- None.

Classes inside:
- `FinancialReport`.

How execution reaches this file:
- Imported by the service layer and during app startup.

When it executes:
- During upload and report lookup operations.

What it returns:
- A model instance.

What would happen if removed:
- Uploaded reports could not be represented in the database.

Dependencies:
- SQLAlchemy, declarative base.

Best practices used:
- The report stores both file metadata and extracted text.

Possible improvements:
- Store the PDF file content in object storage instead of local disk for production use.

### backend/app/models/ai_analysis.py
Purpose:
- Defines the `AIAnalysis` ORM model.

Why required:
- It stores AI-generated financial analysis output for each report.

Who calls it:
- AI analysis service and repository.

Which files depend on it:
- `app/services/ai_analysis_service.py`, `app/repositories/ai_analysis_repository.py`.

Functions inside:
- None.

Classes inside:
- `AIAnalysis`.

How execution reaches this file:
- Imported during app startup and by the AI analysis service.

When it executes:
- When analysis is created or fetched.

What it returns:
- A model instance.

What would happen if removed:
- AI analysis results could not be persisted.

Dependencies:
- SQLAlchemy, declarative base.

Best practices used:
- The analysis is linked one-to-one to a report via a unique foreign key.

Possible improvements:
- Add a status field for pending, complete, and failed analysis states.

### backend/app/repositories/user_repository.py
Purpose:
- Contains database operations for users.

Why required:
- It isolates user CRUD from service logic.

Who calls it:
- `UserService` and authentication-related code.

Which files depend on it:
- `app/services/user_service.py`, `app/api/v1/endpoints/auth.py`, `app/api/dependencies.py`.

Functions inside:
- `create()`
- `get_by_email()`
- `get_by_id()`
- `get_all()`
- `delete()`

Classes inside:
- `UserRepository`.

How execution reaches this file:
- Instantiated by the user service.

When it executes:
- When user creation, login, or lookup occurs.

What it returns:
- User model objects or None.

What would happen if removed:
- User-related persistence would need to be moved elsewhere.

Dependencies:
- SQLAlchemy, `User` model.

Best practices used:
- Repository methods are straightforward and focused.

Possible improvements:
- Add update methods and explicit transaction handling.

### backend/app/repositories/company_repository.py
Purpose:
- Contains database operations for companies.

Why required:
- It centralizes all company persistence behavior.

Who calls it:
- `CompanyService`.

Which files depend on it:
- `app/services/company_service.py`.

Functions inside:
- `create()`
- `get_all()`
- `get_by_id()`
- `update()`
- `delete()`

Classes inside:
- `CompanyRepository`.

How execution reaches this file:
- Instantiated by the company service.

When it executes:
- During company CRUD operations.

What it returns:
- Company model objects.

What would happen if removed:
- Company CRUD would break or need to be embedded in the service layer.

Dependencies:
- SQLAlchemy, `Company` model, Pydantic `CompanyCreate` schema.

Best practices used:
- Data is created from a schema model using `model_dump()`.

Possible improvements:
- Add stronger input validation and error handling around updates.

### backend/app/repositories/financial_report_repository.py
Purpose:
- Contains database operations for financial reports.

Why required:
- It encapsulates report persistence operations.

Who calls it:
- `FinancialReportService`.

Which files depend on it:
- `app/services/financial_report_service.py`.

Functions inside:
- `create()`
- `get_all()`
- `get_by_id()`
- `delete()`

Classes inside:
- `FinancialReportRepository`.

How execution reaches this file:
- Instantiated indirectly by the service layer.

When it executes:
- When a report is uploaded or fetched.

What it returns:
- Report model objects.

What would happen if removed:
- Report persistence would not work cleanly.

Dependencies:
- SQLAlchemy, `FinancialReport` model.

Best practices used:
- CRUD methods are simple and focused.

Possible improvements:
- Add update and query methods for filtering by company or year.

### backend/app/repositories/ai_analysis_repository.py
Purpose:
- Contains database operations for AI analysis results.

Why required:
- It stores and retrieves analyses linked to reports.

Who calls it:
- `AIAnalysisService`.

Which files depend on it:
- `app/services/ai_analysis_service.py`.

Functions inside:
- `create()`
- `get_by_report()`
- `get_by_id()`

Classes inside:
- `AIAnalysisRepository`.

How execution reaches this file:
- Instantiated by the AI analysis service.

When it executes:
- When AI analysis is created or retrieved.

What it returns:
- AI analysis model instances.

What would happen if removed:
- The AI analysis results could not be persisted or loaded efficiently.

Dependencies:
- SQLAlchemy, `AIAnalysis` model.

Best practices used:
- A single analysis per report is retrieved through the report ID.

Possible improvements:
- Add update and delete methods and status handling.

### backend/app/schemas/auth.py
Purpose:
- Defines Pydantic schemas for authentication payloads and tokens.

Why required:
- It validates request shapes and serializes auth responses.

Who calls it:
- Auth endpoints and services.

Which files depend on it:
- `app/api/v1/endpoints/auth.py`, `app/services/user_service.py`.

Functions inside:
- None.

Classes inside:
- `UserRegister`
- `UserLogin`
- `Token`

How execution reaches this file:
- Imported by the auth endpoint and service layer.

When it executes:
- On request validation and response model serialization.

What it returns:
- Schema objects.

What would happen if removed:
- The API would not have typed auth models.

Dependencies:
- Pydantic.

Best practices used:
- Strong typing for request and response shapes.

Possible improvements:
- Remove unused schemas if they are not actively used.

### backend/app/schemas/user.py
Purpose:
- Defines schemas for user creation and user responses.

Why required:
- It validates the create-user request and defines the response model returned by the API.

Who calls it:
- Auth endpoints and user services.

Which files depend on it:
- `app/api/v1/endpoints/auth.py`, `app/services/user_service.py`.

Functions inside:
- None.

Classes inside:
- `UserCreate`
- `UserResponse`

How execution reaches this file:
- Imported by the auth router and service.

When it executes:
- On registration and response serialization.

What it returns:
- Pydantic models.

What would happen if removed:
- The API would lose structured user request/response validation.

Dependencies:
- Pydantic.

Best practices used:
- Validation constraints such as min length are applied.

Possible improvements:
- Add more robust password validation rules.

### backend/app/schemas/company.py
Purpose:
- Defines company request and response schemas.

Why required:
- It keeps company payloads consistent and typed.

Who calls it:
- Company endpoints and repository.

Which files depend on it:
- `app/api/v1/endpoints/company.py`, `app/services/company_service.py`, `app/repositories/company_repository.py`.

Functions inside:
- None.

Classes inside:
- `CompanyCreate`
- `CompanyUpdate`
- `CompanyResponse`

How execution reaches this file:
- Imported by endpoint and service logic.

When it executes:
- On company CRUD requests.

What it returns:
- Schema objects.

What would happen if removed:
- The API would lose validations for company-related operations.

Dependencies:
- Pydantic.

Best practices used:
- Simple and explicit schemas.

Possible improvements:
- Add normalization for ticker values and stronger field constraints.

### backend/app/schemas/financial_report_schema.py
Purpose:
- Defines the response schema for financial reports.

Why required:
- It controls how reports are serialized in API responses.

Who calls it:
- Financial report endpoints and related response handling.

Which files depend on it:
- `app/api/v1/endpoints/financial_report.py`.

Functions inside:
- None.

Classes inside:
- `FinancialReportResponse`.

How execution reaches this file:
- Imported by the endpoint module.

When it executes:
- On report response serialization.

What it returns:
- A Pydantic model instance.

What would happen if removed:
- API responses would not have a structured shape for reports.

Dependencies:
- Pydantic.

Best practices used:
- `from_attributes=True` allows ORM models to be converted to responses.

Possible improvements:
- Separate response and persistence schemas for better clarity.

### backend/app/schemas/ai_analysis_schema.py
Purpose:
- Defines the schema for AI analysis responses.

Why required:
- It ensures the API returns a stable and typed analysis payload.

Who calls it:
- AI analysis endpoints and the AI analysis service layer.

Which files depend on it:
- `app/api/v1/endpoints/ai_analysis.py`.

Functions inside:
- None.

Classes inside:
- `AIAnalysisResponse`.

How execution reaches this file:
- Imported by endpoint modules.

When it executes:
- On analysis request and response serialization.

What it returns:
- A Pydantic model instance.

What would happen if removed:
- The API would lose a typed response for analysis results.

Dependencies:
- Pydantic.

Best practices used:
- Strong typing and ORM compatibility.

Possible improvements:
- Add stricter validation for the overall rating field.

### backend/app/schemas/groq_schema.py
Purpose:
- Defines a schema for the Groq response payload.

Why required:
- It validates the structure of the AI model output and enforces range constraints on the rating field.

Who calls it:
- `GroqService`.

Which files depend on it:
- `app/services/groq_service.py`.

Functions inside:
- None.

Classes inside:
- `GroqAnalysisResult`.

How execution reaches this file:
- Imported by the Groq service.

When it executes:
- When AI output is parsed.

What it returns:
- A validated Pydantic model.

What would happen if removed:
- The AI service would have less structured validation of the model output.

Dependencies:
- Pydantic.

Best practices used:
- Range validation is applied to `overall_rating`.

Possible improvements:
- Add a more detailed schema for each section if the analysis becomes richer.

### backend/app/schemas/report_analysis_response.py
Purpose:
- Combines report and analysis schemas into one response model.

Why required:
- It is a convenience schema for a combined report-and-analysis response shape.

Who calls it:
- It is not currently wired into the active endpoints.

Which files depend on it:
- No active endpoint currently imports it.

Functions inside:
- None.

Classes inside:
- `ReportAnalysisResponse`.

How execution reaches this file:
- It can be imported by future code.

When it executes:
- When used by a route or service.

What it returns:
- A combined schema object.

What would happen if removed:
- No active runtime behavior would break; it is currently unused in the main flow.

Dependencies:
- Other Pydantic schemas.

Best practices used:
- Reusable response composition.

Possible improvements:
- Use it in a future endpoint that returns both a report and its analysis together.

### backend/app/services/user_service.py
Purpose:
- Implements user registration and login behavior.

Why required:
- It contains the business logic behind user account creation and authentication.

Who calls it:
- Auth router endpoints.

Which files depend on it:
- `app/api/v1/endpoints/auth.py`.

Functions inside:
- `register()`
- `login()`

Classes inside:
- `UserService`.

How execution reaches this file:
- Instantiated by the auth endpoints.

When it executes:
- On registration and login requests.

What it returns:
- A new user or a JWT token.

What would happen if removed:
- Registration and login would fail or need to be moved into the router directly.

Dependencies:
- Security helpers, repository, schemas.

Best practices used:
- Duplicate user checks are handled before creation.
- Password hashing is delegated to the security layer.

Possible improvements:
- Add email verification and password reset flows.

### backend/app/services/company_service.py
Purpose:
- Implements CRUD logic for companies.

Why required:
- It keeps company business logic separate from the API layer.

Who calls it:
- Company endpoints.

Which files depend on it:
- `app/api/v1/endpoints/company.py`.

Functions inside:
- `create()`
- `get_all()`
- `get_by_id()`
- `update()`
- `delete()`

Classes inside:
- `CompanyService`.

How execution reaches this file:
- Instantiated by the company router.

When it executes:
- On company create, read, update, and delete requests.

What it returns:
- Company model instances or success results.

What would happen if removed:
- The router would no longer have a clean place to put company logic.

Dependencies:
- Repository and schema models.

Best practices used:
- The service uses a single repository dependency.

Possible improvements:
- Add authorization rules so only the owning user can manage a company.

### backend/app/services/financial_report_service.py
Purpose:
- Handles report upload, file storage, PDF text extraction, database persistence, and AI analysis triggering.

Why required:
- It is the core workflow engine for report ingestion.

Who calls it:
- The financial report router.

Which files depend on it:
- `app/api/v1/endpoints/financial_report.py`.

Functions inside:
- `upload_report()`
- `get_all_reports()`
- `get_report()`
- `delete_report()`

Classes inside:
- `FinancialReportService`.

How execution reaches this file:
- The endpoint creates an instance of the service and calls its methods.

When it executes:
- When a PDF is uploaded, fetched, or deleted.

What it returns:
- A report object after upload or when reading data.

What would happen if removed:
- Report upload and analysis would not work.

Dependencies:
- PyMuPDF, file system operations, repository, AI analysis service, company model.

Best practices used:
- File uploads are saved locally and extracted securely.
- The service triggers AI analysis automatically after upload.

Possible improvements:
- Use object storage instead of local filesystem for production.
- Add asynchronous processing for analysis so uploads do not block the request.

### backend/app/services/ai_analysis_service.py
Purpose:
- Coordinates AI analysis for a report.

Why required:
- It loads the report, prevents duplicate analyses, calls the Groq service, and stores the result.

Who calls it:
- The report service during upload and the analysis router for explicit analysis requests.

Which files depend on it:
- `app/services/financial_report_service.py`, `app/api/v1/endpoints/ai_analysis.py`.

Functions inside:
- `analyze_report()`
- `get_analysis()`

Classes inside:
- `AIAnalysisService`.

How execution reaches this file:
- Instantiated by report upload and analysis endpoints.

When it executes:
- During AI analysis generation and lookup.

What it returns:
- A new analysis object or an existing one.

What would happen if removed:
- AI analysis would either not run or need to be handled manually elsewhere.

Dependencies:
- Groq service, repository, report model.

Best practices used:
- Duplicate analysis is prevented by checking the database first.

Possible improvements:
- Add asynchronous background processing and analysis status tracking.

### backend/app/services/groq_service.py
Purpose:
- Sends report text to Groq and parses the JSON result.

Why required:
- It isolates the AI provider integration from the rest of the app.

Who calls it:
- `AIAnalysisService`.

Which files depend on it:
- `app/services/ai_analysis_service.py`.

Functions inside:
- `analyze_financial_report()`

Classes inside:
- `GroqService`.

How execution reaches this file:
- Instantiated by the AI analysis service.

When it executes:
- When the AI service needs to generate an analysis.

What it returns:
- A validated `GroqAnalysisResult` object.

What would happen if removed:
- The backend would no longer be able to call Groq for AI analysis.

Dependencies:
- Groq SDK, settings, logger, Groq schema.

Best practices used:
- The prompt requests valid JSON only.
- Errors are logged and raised so the outer layers can return a meaningful response.

Possible improvements:
- Add retry logic, prompt tuning, and response caching.

### backend/app/api/v1/endpoints/auth.py
Purpose:
- Exposes authentication endpoints for user registration, login, and profile retrieval.

Why required:
- It allows the frontend to create accounts and authenticate users.

Who calls it:
- The frontend via HTTP requests.

Which files depend on it:
- The router registration in `app/api/v1/router.py`.

Functions inside:
- `register()`
- `login()`
- `get_me()`

Classes inside:
- None.

How execution reaches this file:
- The router module is included in the main API router.

When it executes:
- When `/api/v1/auth/register`, `/api/v1/auth/login`, or `/api/v1/auth/me` is called.

What it returns:
- User data or an access token.

What would happen if removed:
- Authentication would no longer work.

Dependencies:
- Auth service, repository, security helpers, user schemas.

Best practices used:
- The endpoint uses dependency injection for database sessions.

Possible improvements:
- Add password reset, email verification, and refresh token support.

### backend/app/api/v1/endpoints/company.py
Purpose:
- Exposes CRUD endpoints for companies.

Why required:
- It allows users to manage companies in the platform.

Who calls it:
- The frontend company pages.

Which files depend on it:
- `app/api/v1/router.py`.

Functions inside:
- `create_company()`
- `get_companies()`
- `get_company()`
- `update_company()`
- `delete_company()`

Classes inside:
- None.

How execution reaches this file:
- Included in the versioned router.

When it executes:
- When company routes are called.

What it returns:
- Company objects or no content for delete.

What would happen if removed:
- The frontend could not create or manage companies.

Dependencies:
- Company service, repository, security helper, schemas.

Best practices used:
- Protected routes require an authenticated user.

Possible improvements:
- Add ownership constraints and better filtering by user.

### backend/app/api/v1/endpoints/financial_report.py
Purpose:
- Exposes report upload, listing, retrieval, and deletion endpoints.

Why required:
- It enables the report workflow from the frontend.

Who calls it:
- The frontend upload, reports, and report-detail screens.

Which files depend on it:
- `app/api/v1/router.py`.

Functions inside:
- `upload_report()`
- `get_reports()`
- `get_report()`
- `delete_report()`

Classes inside:
- None.

How execution reaches this file:
- Included in the API router.

When it executes:
- When reports are uploaded or retrieved.

What it returns:
- A report object or a success message.

What would happen if removed:
- The report module would stop functioning.

Dependencies:
- Financial report service, database session, security helper.

Best practices used:
- Multipart form upload is used for PDF files.

Possible improvements:
- Move file storage to cloud object storage and process analysis asynchronously.

### backend/app/api/v1/endpoints/ai_analysis.py
Purpose:
- Exposes endpoints to trigger or retrieve AI analysis for a report.

Why required:
- It allows the frontend to request analysis results for a specific report.

Who calls it:
- The frontend report detail page.

Which files depend on it:
- `app/api/v1/router.py`.

Functions inside:
- `analyze_report()`
- `get_analysis()`

Classes inside:
- None.

How execution reaches this file:
- Included in the API router.

When it executes:
- When analysis is triggered or fetched.

What it returns:
- AI analysis data.

What would happen if removed:
- The report analysis feature would not have a public endpoint.

Dependencies:
- AI analysis service, database session, security helper.

Best practices used:
- The service prevents duplicate analysis runs.

Possible improvements:
- Add asynchronous job status tracking and queue-based execution.

### backend/app/api/v1/endpoints/health.py
Purpose:
- Exposes a health check endpoint.

Why required:
- It allows monitoring or manual validation that the API is alive.

Who calls it:
- Developers, monitoring tools, or the frontend navbar status UI (though the frontend currently does not call it).

Which files depend on it:
- `app/api/v1/router.py`.

Functions inside:
- `health()`.

Classes inside:
- None.

How execution reaches this file:
- Included in the API router.

When it executes:
- When `/api/v1/health` is requested.

What it returns:
- A simple JSON payload with status and version information.

What would happen if removed:
- The health check endpoint would disappear.

Dependencies:
- FastAPI router.

Best practices used:
- Small and explicit endpoint.

Possible improvements:
- Add database and AI dependency checks to make the health endpoint more useful.

### backend/app/api/v1/endpoints/users.py
Purpose:
- This file exists but is empty.

Why required:
- It appears to be a placeholder or scaffold file for future user-related endpoints.

Who calls it:
- No runtime code currently imports it.

Which files depend on it:
- None in the current implementation.

Functions inside:
- None.

Classes inside:
- None.

How execution reaches this file:
- It is not currently registered in the router.

When it executes:
- Never in the current implementation.

What it returns:
- Nothing.

What would happen if removed:
- No current functionality would be affected.

Dependencies:
- None.

Best practices used:
- None beyond the placeholder structure.

Possible improvements:
- Either implement the intended user endpoints or remove the file if it is not needed.

### backend/test_db.py
Purpose:
- A small database connectivity smoke test.

Why required:
- It confirms that the SQLAlchemy engine can connect to PostgreSQL.

Who calls it:
- Developers manually.

Which files depend on it:
- None.

Functions inside:
- None.

Classes inside:
- None.

How execution reaches this file:
- Run directly with Python.

When it executes:
- When developers test the database connection.

What it returns:
- Console output showing connection success.

What would happen if removed:
- The project would lose a simple smoke test for the database connection.

Dependencies:
- SQLAlchemy.

Best practices used:
- Minimal and straightforward.

Possible improvements:
- Turn it into a formal test file and add assertions.

---

## 5. Request Lifecycle

The request lifecycle is the path from the browser to the database and back.

```text
Browser
↓
FastAPI
↓
Router
↓
Schema Validation
↓
Service Layer
↓
Repository
↓
Database
↓
AI Analysis
↓
Response
```

### Browser
The user interacts with the React frontend. The frontend might submit a login form, upload a PDF, or request a report analysis.

### FastAPI
The request hits the FastAPI application running under Uvicorn. The application uses a router prefix of `/api/v1`.

### Router
The router selects the relevant endpoint based on the URL and HTTP method. For example, `/reports/upload` maps to the financial report router.

### Schema Validation
Pydantic validates request data. For example, login and registration payloads are validated against schemas.

### Service Layer
The endpoint delegates to a service, such as `FinancialReportService` or `UserService`, which contains the domain logic.

### Repository
The service uses a repository to perform create, read, update, or delete operations against SQLAlchemy models.

### Database
The ORM persists data in PostgreSQL tables such as `users`, `companies`, `financial_reports`, and `ai_analysis`.

### AI Analysis
For report uploads, the service extracts text from the PDF and sends it to the Groq model. The response is parsed and stored.

### Response
The backend returns a response model to the frontend, and the frontend updates the UI.

---

## 6. API Explanation

### Authentication Endpoints

#### POST /api/v1/auth/register
Purpose:
- Create a new user account.

Request:
- JSON body with `name`, `email`, and `password`.

Response:
- A user object with `id`, `name`, `email`, and `created_at`.

Flow:
- The endpoint receives the payload.
- The user service checks whether the email already exists.
- If valid, it hashes the password and creates the user via the repository.

Errors:
- Returns `400` if the email is already registered.

Status codes:
- `201 Created` on success.
- `400 Bad Request` on validation or duplicate email issues.

#### POST /api/v1/auth/login
Purpose:
- Authenticate a user and return a JWT token.

Request:
- Form data with `username` and `password`.

Response:
- An auth token object with `access_token` and `token_type`.

Flow:
- The endpoint receives form data.
- The service looks up the email.
- It verifies the password hash and returns a JWT.

Errors:
- Returns `401 Unauthorized` on invalid credentials.

Status codes:
- `200 OK` on success.
- `401 Unauthorized` on failure.

#### GET /api/v1/auth/me
Purpose:
- Return the currently authenticated user profile.

Request:
- Requires a bearer token.

Response:
- User profile details.

Flow:
- The auth dependency validates the token.
- The user is fetched from the database.

Errors:
- Returns `401` if the token is missing or invalid.

Status codes:
- `200 OK` on success.
- `401 Unauthorized` on failure.

### Company Endpoints

#### POST /api/v1/companies
Purpose:
- Create a company.

Request:
- JSON body with `name`, `ticker`, and `sector`.

Response:
- A company object.

Errors:
- Returns `401` if the user is not authenticated.

Status codes:
- `201 Created`.

#### GET /api/v1/companies
Purpose:
- List all companies.

Request:
- Requires authentication.

Response:
- A list of company objects.

#### GET /api/v1/companies/{company_id}
Purpose:
- Retrieve a single company by ID.

Response:
- A single company object.

Errors:
- Returns `404 Not Found` if the company does not exist.

#### PUT /api/v1/companies/{company_id}
Purpose:
- Update a company.

#### DELETE /api/v1/companies/{company_id}
Purpose:
- Delete a company.

### Report Endpoints

#### POST /api/v1/reports/upload
Purpose:
- Upload a PDF report and trigger AI analysis.

Request:
- Multipart form data containing `company_id`, `report_year`, and `file`.

Response:
- A report object.

Flow:
- The file is saved to the local uploads directory.
- PDF text is extracted using PyMuPDF.
- The report metadata is saved to the database.
- AI analysis is triggered automatically.

Errors:
- Returns `400` for invalid PDFs.
- Returns `404` if the company does not exist.

Status codes:
- `201 Created` on success.

#### GET /api/v1/reports/
Purpose:
- List reports.

Response:
- A list of report objects.

#### GET /api/v1/reports/{report_id}
Purpose:
- Retrieve a report by ID.

#### DELETE /api/v1/reports/{report_id}
Purpose:
- Delete a report and its local file.

### Analysis Endpoints

#### POST /api/v1/analysis/{report_id}
Purpose:
- Trigger AI analysis for a report.

Response:
- An analysis object.

Behavior:
- If an analysis already exists for the report, the existing one is returned.

#### GET /api/v1/analysis/{report_id}
Purpose:
- Retrieve analysis for a report.

Errors:
- Returns `404` if no analysis exists.

### Health Endpoint

#### GET /api/v1/health
Purpose:
- Show that the API is healthy.

---

## 7. Database

### Models
The application uses four main SQLAlchemy models:
- `User`
- `Company`
- `FinancialReport`
- `AIAnalysis`

### Relationships
- `FinancialReport.company_id` references `Company.id`
- `AIAnalysis.report_id` references `FinancialReport.id`

### Primary Keys
- Each model uses an integer `id` as its primary key.

### Foreign Keys
- `FinancialReport.company_id` is a foreign key to companies.
- `AIAnalysis.report_id` is a foreign key to financial_reports.

### Tables
- `users`
- `companies`
- `financial_reports`
- `ai_analysis`

### Indexes
- Primary keys are indexed by default.
- The `User.email` column is indexed and unique.
- The `Company.id` and `User.id` columns use indexes.

### CRUD Flow
- Create: repository methods add a new model instance and commit it.
- Read: repositories query by ID, email, or report ID.
- Update: company updates call the repository and commit changes.
- Delete: repositories delete the object and commit the transaction.

### Notes
The current implementation uses local SQLite-style ORM semantics but the configured database URL points to PostgreSQL. The application is designed for PostgreSQL, but the code does not include migrations or separate database-specific logic beyond SQLAlchemy connection setup.

---

## 8. AI Flow

### How AI starts
AI analysis starts in one of two places:
- Immediately after uploading a report
- When the frontend explicitly triggers the analysis endpoint

### Prompt generation
The Groq service constructs a prompt that instructs the model to return valid JSON containing:
- `company_overview`
- `revenue_analysis`
- `profitability`
- `risks`
- `investment_recommendation`
- `overall_rating`

The prompt includes a truncated version of the extracted PDF text.

### Model call
The code uses the `groq` Python SDK and calls:
- `llama-3.3-70b-versatile`

The request uses `response_format={"type": "json_object"}`.

### Response parsing
The returned message content is parsed with `json.loads()` and then validated against `GroqAnalysisResult` using Pydantic.

### Error handling
Errors are logged and raised. The AI analysis service catches them and returns an HTTP 502 error with a clear message if the AI analysis fails.

### Storage
After successful analysis, the result is stored in the `ai_analysis` table.

---

## 9. Configuration

### .env
The `.env` file stores local runtime configuration.

Key values include:
- `APP_NAME`
- `APP_VERSION`
- `HOST`
- `PORT`
- `DATABASE_URL`
- `SECRET_KEY`
- `ALGORITHM`
- `ACCESS_TOKEN_EXPIRE_MINUTES`
- `GROQ_API_KEY`

### config.py
The `Settings` class loads values from `.env` using `pydantic-settings`.

### Environment Variables
The app expects the following values:
- Database URL for PostgreSQL
- Secret key for JWT signing
- Groq API key for AI analysis

### Secrets
The backend currently stores secrets in `.env` for local development. In a production environment, they should be moved to a dedicated secret manager.

### Security
The configuration includes a secret key and algorithm used for JWT creation and verification.

---

## 10. Dependencies

### FastAPI
Used because it provides a modern, fast, async-capable web framework for building REST APIs. It also integrates with Pydantic for validation.

### SQLAlchemy
Used for ORM-based database access and model definition.

### Pydantic
Used for schema validation and response modeling.

### Uvicorn
Used as the ASGI server to run the FastAPI application.

### PyMuPDF
Used to extract text from uploaded PDF files.

### Groq SDK
Used to connect to the Groq AI model.

### Passlib and Python-JOSE
Used for password hashing and JWT handling.

### Psycopg2-binary
Used as the PostgreSQL driver for SQLAlchemy.

### Python-Multipart
Used to accept file uploads through FastAPI.

---

## 11. Error Handling

The backend uses several layers of error handling:

### try/except blocks
The services and AI flow wrap operations that can fail, especially around PDF parsing and Groq calls.

### Logging
Errors are logged via the configured logger.

### Exceptions
The application registers handlers for:
- `ValueError`
- `HTTPException`
- generic exceptions

### Validation
Pydantic validates request bodies and the Groq service validates the AI response model.

---

## 12. Security

### Authentication
JWT-based authentication is implemented with bearer tokens.

### Authorization
Protected endpoints require a valid token and user lookup.

### CORS
The backend enables CORS for the React dev server on `localhost:5173` and `127.0.0.1:5173`.

### Password hashing
Passwords are hashed with bcrypt via Passlib before being stored.

### Input validation
Pydantic schemas validate incoming data.

### Token handling
The security helpers create and decode access tokens using a configured secret and algorithm.

### Important note
The project uses an authentication pattern that is suitable for a demo or MVP, but it does not yet implement features such as refresh tokens, password reset, or role-based authorization.

---

## 13. Scalability

### With 100 users
The current architecture can support a small number of concurrent users. The main bottlenecks would be the local file storage and the synchronous AI analysis flow.

### With 1,000 users
The design would need improvements such as:
- a production database server
- object storage instead of local files
- background job processing for AI analysis
- rate limiting and caching

### With 10,000 users
The application would likely need:
- multiple backend instances behind a load balancer
- a managed PostgreSQL service
- a queue for AI work
- more robust observability

### With 100,000 users
The application would need:
- container orchestration
- autoscaling
- a CDN or static asset hosting strategy
- separate services for AI processing and API handling

### With 1 million users
The architecture would need major scaling investments:
- multi-region deployment
- asynchronous workers
- distributed caching
- tighter monitoring and operational automation

### Bottlenecks
The current implementation has obvious bottlenecks:
- local PDF storage
- synchronous AI execution inside the upload request
- no explicit queue or worker processing
- no database connection pool tuning beyond the default engine configuration

### Scaling strategy
A realistic scaling path would be:
- move file uploads to cloud storage
- move AI analysis to background workers
- place the app behind a load balancer
- use a managed database and separate secrets management

---

## 14. Complete Backend Flow

### Startup
1. The FastAPI app is created in `main.py`.
2. The app registers CORS middleware and exception handlers.
3. The API router is included.
4. The database engine is created.
5. SQLAlchemy creates the tables defined by the imported models.
6. The app logs that startup is complete.

### Request Example: user login
1. The frontend sends a login request to `/api/v1/auth/login`.
2. FastAPI routes the request to the auth endpoint.
3. The endpoint uses the user service.
4. The service checks the repository for the user email.
5. The password is verified with bcrypt.
6. A JWT is created and returned.

### Request Example: report upload
1. The frontend sends a PDF to `/api/v1/reports/upload`.
2. The endpoint delegates to `FinancialReportService`.
3. The service checks that the company exists.
4. The PDF is stored on disk.
5. Text is extracted with PyMuPDF.
6. A new financial report record is created in the database.
7. The AI analysis service starts analysis for that report.
8. The analysis result is stored and returned to the client.

### Shutdown
When the application is stopped, the startup lifecycle simply logs shutdown. There is no custom cleanup logic for database connections or long-running jobs in the current implementation.

---

## 15. Backend Summary

The backend is a practical FastAPI-based application for AI-powered financial report analysis. It combines a layered architecture, JWT authentication, SQLAlchemy persistence, and Groq-powered AI analysis into a single cohesive system.

### Why this architecture was chosen
It is a clean and accessible architecture for a modern Python API:
- FastAPI keeps the API ergonomic and fast
- SQLAlchemy provides database abstraction
- Pydantic handles validation cleanly
- Repository/service separation keeps business logic organized

### Industry best practices
The implementation follows several good practices:
- Clear separation between API, service, and repository layers
- Environment-based configuration
- Centralized error handling
- Structured logging
- Explicit schema models for validation

### Possible future improvements
The project could be improved substantially by:
- moving file storage to cloud object storage
- processing AI analysis asynchronously in the background
- adding database migrations with Alembic more formally
- adding unit and integration tests
- adding refresh tokens and role-based access control
- introducing caching and rate limiting for production scale
