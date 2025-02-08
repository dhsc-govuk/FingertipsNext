# **Fingertips Workflow**

This workflow automates the **build, test, containerisation, deployment, and E2E testing** for the Fingertips project.

## **Workflow Triggers**
This workflow is triggered by:
- **Manual dispatch** (`workflow_dispatch`)
- **Push to any branch** (`push`)
- **Pull requests to `main`** (`pull_request`)

---

## **Workflow Job Execution Order**
### **Stage 1: Initial Checks**
1. **`check-changes`** → Determines which components have changed (Database, API, Frontend, or Terraform).
2. **`determine-version`** → Retrieves the semantic version (`semver`) for container tagging.

### **Stage 2: Build & Test (Parallel Execution)**
3. **`database-build`** → Builds the database project if database files or Terraform were modified.
4. **`api-build`** → Builds the API if API or Terraform files were modified.
5. **`frontend-build`** → Builds the frontend if frontend or Terraform files were modified.

### **Stage 3: Containerisation (Parallel Execution)**
6. **`push-container-api`** → Builds & pushes the API container to Azure Container Registry.
7. **`push-container-frontend`** → Builds & pushes the frontend container to Azure Container Registry.

### **Stage 4: Deployment (Sequential Execution)**
8. **`deploy-db-dev`** → Deploys database changes.
9. **`deploy-api-dev`** → Deploys API container **only after DB deployment is successful**.
10. **`deploy-frontend-dev`** → Deploys frontend container **only after API deployment is successful**.

### **Stage 5: End-to-End Testing**
11. **`e2e-tests-development`** → Runs E2E tests **only after frontend deployment is successful**.

---

## **Workflow Order Scenarios**
| **Scenario** | **Expected Jobs** |
|-------------|------------------|
| **PR opened to `main`** | `check-changes` → `determine-version` → `api-build` & `frontend-build` |
| **Push to `main`, no changes** | `check-changes` → `determine-version` *(No builds, no deploys)* |
| **Push with API changes** | `check-changes` → `api-build` → `push-container-api` → `deploy-api-dev` |
| **Push with Frontend & Terraform changes** | `check-changes` → `frontend-build` → `push-container-frontend` → `deploy-frontend-dev` |
| **Push with Database & API changes** | `check-changes` → `database-build` & `api-build` → `push-container-api` → `deploy-db-dev` → `deploy-api-dev` |
| **Push with AI Search Setup changes** | `search-setup` workflow runs |

---

## **Fingertips Search Setup Workflow**
This separate workflow is used only to **publish the Azure AI Search setup**. It is triggered when changes are made to the `search-setup` directory or manually via `workflow_dispatch`.

### **Workflow Triggers**
This workflow is triggered by:
- **Manual dispatch** (`workflow_dispatch`)
- **Push to `main`** when changes occur in:
  - `search-setup/`
  - `.github/workflows/fingertips-ai-search-setup.yml`

### **Workflow Jobs**
#### **`search-setup` - Configures Azure AI Search**
Runs on **Ubuntu latest** and performs the following steps:
1. **Checks out the repository.**
2. **Logs into Azure using a service principal.**
3. **Retrieves Azure Key Vault secrets (`fingertips-ai-search-url` and `fingertips-ai-search-api-key`).**
4. **Sets up Node.js (version `22.x`).**
5. **Installs dependencies (`npm ci`).**
6. **Creates the Azure AI Search index (`npm run create-index`).**
7. **Runs tests (`npm run test`).**

---

## **Secrets Used**
| **Secret** | **Usage** |
|-----------|---------|
| `ARM_CLIENT_ID` | Azure Service Principal Client ID |
| `ARM_CLIENT_SECRET` | Azure Service Principal Client Secret |
| `ARM_SUBSCRIPTION_ID` | Azure Subscription ID |
| `ARM_TENANT_ID` | Azure Tenant ID |
| `AZURE_SQL_CONNECTION_STRING` | SQL Database Connection String |
| `AZURE_CONTAINER_REGISTRY_LOGIN_SERVER` | ACR Login Server |
| `SLACK_WEBHOOK_URL` | Slack Notifications for E2E Test Failures |
| `AZURE_CREDENTIALS` | Azure credentials for AI Search setup |
| `AZURE_KEY_VAULT` | Azure Key Vault used for AI Search secrets |

---