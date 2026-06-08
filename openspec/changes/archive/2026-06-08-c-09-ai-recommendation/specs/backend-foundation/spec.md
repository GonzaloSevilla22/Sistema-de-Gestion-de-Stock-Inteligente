## MODIFIED Requirements

### Requirement: Environment variables are documented
The system SHALL provide a `backend/.env.example` file listing all required environment variables with example values.

#### Scenario: .env.example lists all required variables
- **WHEN** `backend/.env.example` is read
- **THEN** it contains entries for `DATABASE_URL`, `AI_API_KEY`, `AI_PROVIDER`, and `CORS_ORIGINS`
