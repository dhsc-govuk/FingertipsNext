## **Workflow Triggers**

This workflow is triggered by:

- **Manual dispatch** (`workflow_dispatch`)
- **Push to any branch** (`push`)
- **Pull requests to `main`** (`pull_request`)

---

## **Workflow Job Execution Order**

### **Stage 1: Initial Checks**

1. **`check-changes`** → Determines which components have changed (Database, API, Frontend, Terraform, or Search Setup).
2. **`determine-version`** → Retrieves the semantic version (`semver`) for container tagging.

### **Stage 2: Build & Test (Parallel Execution)**

3. **`database-build`** → Builds the database project if database files or Terraform were modified.
4. **`api-build-and-test`** → Builds and tests the API if API or Terraform files were modified.
5. **`frontend-build-and-test`** → Builds and tests the frontend if frontend or Terraform files were modified.

### **Stage 3: Containerisation (Parallel Execution)**

6. **`push-container-api`** → Builds & pushes the API container to Azure Container Registry.
7. **`push-container-frontend`** → Builds & pushes the frontend container.

### **Stage 4: Local End-to-End Testing**

8. **`e2e-and-api-tests`** → Runs local API and E2E tests **after** building the database project, or pushing the API and frontend containers.

### **Stage 5: Deployment (Sequential Execution)**

9. **`deploy-db-dev`** → Deploys database changes.
10. **`search-setup-dev`** → Runs search setup deployment and integration tests **after DB deployment**.
11. **`deploy-api-dev`** → Deploys API container **only after search setup is successful**.
12. **`deploy-frontend-dev`** → Deploys frontend container **only after API deployment is successful**.

### **Stage 6: End-to-End Testing**

13. **`e2e-tests-development`** → Runs E2E tests **only after frontend deployment is successful**.

---

## **Workflow Order Scenarios**

| **Scenario**                                                     | **Expected Jobs**                                                                                                                                                                                                                                                  |
| ---------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **PR opened to `main` (API, Frontend, or Search Setup changes)** | `check-changes` & `determine-version` → `api-build-and-test` & `frontend-build-and-test` → `e2e-tests-local` → `deploy-api-dev` (terraform validate) → `deploy-frontend-dev` (terraform validate)                                                                  |
| **Push with API changes**                                        | `check-changes` & `determine-version` → `api-build-and-test` → `push-container-api` → `e2e-tests-local` → `deploy-api-dev` (terraform deploy) → `e2e-tests-dev`                                                                                                    |
| **Push with Frontend & Terraform changes**                       | `check-changes` → `determine-version` → `api-build-and-test` & `frontend-build-and-test` → `push-container-api` & `push-container-frontend` → `e2e-tests-local` → `deploy-api-dev` (terraform deploy) → `deploy-frontend-dev` (terraform deploy) → `e2e-tests-dev` |
| **Push with Database & API changes**                             | `check-changes` & `determine-version` → `database-build` & `api-build-and-test` → `push-container-api` → `e2e-tests-local` → `deploy-db-dev` → `deploy-api-dev` (terraform deploy) → `e2e-tests-dev`                                                               |
| **Push Frontend and AI Search Setup changes**                    | `check-changes` & `determine-version` → `frontend-build-and-test` → `push-container-frontend` → `e2e-tests-local` → `search-setup-dev` → `deploy-frontend-dev` (terraform deploy) → `e2e-tests-dev`                                                                |

---

## **Secrets Used**

| **Secret**                              | **Usage**                                  |
| --------------------------------------- | ------------------------------------------ |
| `ARM_CLIENT_ID`                         | Azure Service Principal Client ID          |
| `ARM_CLIENT_SECRET`                     | Azure Service Principal Client Secret      |
| `ARM_SUBSCRIPTION_ID`                   | Azure Subscription ID                      |
| `ARM_TENANT_ID`                         | Azure Tenant ID                            |
| `AZURE_SQL_CONNECTION_STRING`           | SQL Database Connection String             |
| `AZURE_CONTAINER_REGISTRY_LOGIN_SERVER` | ACR Login Server                           |
| `SLACK_WEBHOOK_URL`                     | Slack Notifications for E2E Test Failures  |
| `AZURE_CREDENTIALS`                     | Azure credentials for AI Search setup      |
| `AZURE_KEY_VAULT`                       | Azure Key Vault used for AI Search secrets |
