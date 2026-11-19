# Azure App Service infrastructure

Staging and production each get a resource group, a Linux Premium v4 (`P0v4`)
plan with one worker, and a Node.js 26 web app in UK South. Staging is a
separate app, not a deployment slot. Both apps run with `NODE_ENV=production`.
Dev uses Linux Basic (`B1`) with the same worker count, runtime, and region.

## Resource names

Names follow `nhsuk-<app_name>-<azure_abbreviation>-<environment>-<location>`.
Use the app name without the `nhsuk-` prefix in tfvars. The `location` object
sets `short` for the three-letter suffix in resource names and `long` for the
Azure region. Both environments use `location = { short = "uks", long = "uksouth" }`.
UK South is the only deployment region currently supported.

| Resource | [Microsoft abbreviation](https://learn.microsoft.com/azure/cloud-adoption-framework/ready/azure-best-practices/resource-abbreviations) | Staging example |
| --- | --- | --- |
| Resource group | `rg` | `nhsuk-service-manual-rg-stag-uks` |
| App Service plan | `asp` | `nhsuk-service-manual-asp-stag-uks` |
| Web app | `app` | `nhsuk-service-manual-app-stag-uks` |

If resources already exist under previous names, review the plan before applying.
Terraform replaces those resources rather than renaming them in place, and the
web app's default hostname will change.

## Prerequisites

- Terraform 1.9 or later.
- An existing Azure Storage account and private blob container for Terraform
  state. They are not created by this configuration. Enable blob versioning
  and soft delete to help recover state if needed.
- A service principal with `Storage Blob Data Contributor` on the state
  container and permission to create resource groups and App Service
  resources in the target subscription. Register `Microsoft.Web` in that
  subscription before running Terraform.
- Set `ARM_TENANT_ID`, `ARM_SUBSCRIPTION_ID`, `ARM_CLIENT_ID` and
  `ARM_CLIENT_SECRET` in your shell. Both the provider and backend use these
  credentials; do not put them in tfvars, backend arguments or source control.

## Plan and apply

Use Terraform directly. Azure Developer CLI (`azd`) and an `azd` deployment
record are not required.

From the repository root in PowerShell, choose `dev`, `stag`, or `prod`. Use the
same selection for the input file, state key and Terraform data directory.
The example assumes the state account is in the target subscription.

```powershell
Set-Location infrastructure
$environment = 'stag'
$stateAccount = '<state-storage-account>'
$stateContainer = '<state-container>'

terraform init "-backend-config=storage_account_name=$stateAccount" `
  "-backend-config=container_name=$stateContainer" `
  "-backend-config=key=nhsuk-service-manual-$environment.tfstate"

terraform plan "-var-file=vars\$environment.tfvars" "-out=$environment.tfplan"
# Review the plan before applying:
terraform apply "$environment.tfplan"
```

Web app names are globally unique. If Azure reports a name collision, choose
a different `app_name` in the relevant tfvars file before the first deployment.
Mock tests cannot check live name availability, subscription quota, or
regional support for the SKU and runtime.

Terraform provisions the hosting resources, not the application. The current
pipeline is unchanged. The deployment package must include the built assets
and runtime dependencies: App Service mounts the zip read-only and runs
`npm start`. Use an Entra-authenticated deployment method; publishing basic
authentication is disabled.

App Service probes the homepage (`/`) for health. Applying this setting to an
existing app can restart it. A single worker still has no failover capacity.

## Test without Azure credentials

From this directory, in a shell that is not running a deployment:

```powershell
$env:TF_DATA_DIR = '.terraform-test'
terraform init -backend=false
terraform fmt -check -recursive
terraform validate
terraform test "-var-file=vars\stag.tfvars"
terraform test "-var-file=vars\prod.tfvars"
```

Tests use a mocked AzureRM provider. Even the test marked `apply` runs only
against the mock; it does not contact Azure or create real resources. The
initial `terraform init` needs access to the provider registry.

The pull request workflow runs these checks plus TFLint and Checkov. From
this directory, with those tools installed, run:

```powershell
tflint --init
tflint --recursive
$env:CKV_NO_TELEMETRY = '1'
checkov --directory . --framework terraform --compact --quiet --skip-download
```

Checkov fails the job on any finding that is not covered by a documented
inline exception on the affected resource.
