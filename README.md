# NHS digital service manual

## Prerequisite

Install the long-term support (LTS) version of <a href="https://nodejs.org/en/">Node.js</a>, which includes NPM.

## Running the application

Clone the repo: `git clone https://github.com/nhsuk/nhsuk-service-manual.git nhsuk-service-manual` and whilst in the project directory `cd nhsuk-service-manual`, install the required npm packages with: `npm install`

Run the project in development mode `npm run watch` and visit <a href="http://localhost:3000">http://localhost:3000</a>.

## Build Notes

This repository includes various files used for deployment: `azure-pipelines.yml` and those in the `deploy` folder. The aim of this section is to give the purpose of these files, explain their use, and explain briefly why certain decisions were made due to pitfalls we ran across. This should be applicable to any node.js app, and is stored here for discoverability reasons.

If the repository is for a public application stored in GitHub, it may be built and released in the [NHSUK GitHub WebApps project](https://dev.azure.com/nhsuk/nhsuk.GitHub.WebApps). Alternatively, you may want to create your own project for better control.

Some repositories may contain files for other CI systems, for example `.travis.yml` (for Travis CI) or `.gitlab-ci.yml` (for GitLab CI). These CI systems are not formally supported.

As a brief summary of the purpose of the files,
* **azure-pipelines.yml** stores the build instructions for Azure DevOps (AZDO) build pipelines.
* **deploy** contains bare scripts which are used in the release pipeline, and a folder for terraform.
    * The **scripts** run commands in the AZDO release pipelines.
    * The **terraform** folder contains .tf files which are used to build the infrastructure the project is hosted on, and also a script for initialising the working directory to refer to the remote state.

### azure-pipelines.yml

**azure-pipelines.yml** stores the build instructions for Azure DevOps (AZDO) build pipelines. The [schema](https://docs.microsoft.com/en-us/azure/devops/pipelines/yaml-schema) serves as a reasonable summary. When writing it yourself, additional useful pieces of documentation include the [list of tasks](https://docs.microsoft.com/en-us/azure/devops/pipelines/tasks/) from which the names can be obtained, and the [source code for task implementations](https://github.com/Microsoft/azure-pipelines-tasks), which is useful for debugging and understanding the less comprehensible parts of the task documentation.

The `trigger` is branch-specific -- for example, your master branch can only specify "master" and your develop branch can only specify "develop". This might be confusing, however, so it's recommended to keep the file consistent across branches where possible.

We run `npm install` as part of a script that moves files around the repo to ensure that we don't package deployment or git-relevant files into the final artifact. An alternative is to rearrange the repo up-front so that it already contains the relevant files in a separate folder. This option was chosen to keep the repository looking as simple as possible for those who might be unfamiliar with it.

Note how the `npm install` task does not run `build` separately. This is done by setting the `build` tasks as a `postinstall` script in the `package.json`. This ensures that there is no need to put this as part of the `npm start` script, which is important as:
* on Azure, the zip file deployed to a web app will run `npm start`, which should not include build instructions, as this will fail as `npm install` has been run on a different machine, so the file paths will be incorrect.
* on Heroku, the repository will be deployed directly, and then run `npm install` followed by `npm start`, without an explicit build instruction unless otherwise configured.
Setting the build instructions as a `postinstall` script ensures that deployment to both these platforms will work out-of-the-box.

### Deploy scripts

The **scripts** run commands in the AZDO release pipelines, and are stored with the repository to more easily view the history, to (theoretically) be able to be used in other CI pipelines and to have the possibility of changing the release pipeline on a branch.

Storing commands with the repository is only possible in the case of scripts: Powershell, Bash, CMD or Azure CLI. An alternative to the Azure CLI script used here is an "Azure App Service Deploy" task. This is generally quicker, but we've had issues with reliability, and it means that the release logic needs to be stored separately from the code.

### Terraform

The **terraform** folder contains .tf files which are used to build the infrastructure the project is hosted on, and also a script for initialising the working directory to refer to the remote state.

[Terraform](https://www.terraform.io/) is a way of writing infrastructure as code. Using it to create the infrastructure means that the creation is consistently repeatable, and that all important features are recorded explicitly.

Running the `init.sh` script requires both terraform and the Azure CLI installed, and a successful run requires that you have logged in to the Azure CLI.

Terraform can be installed from the [Downloads page](https://www.terraform.io/downloads.html), picking the correct version for your operating system. If you intend to apply any changes you've made locally (or to apply the existing version over changes that were made remotely), it's preferred that you use the same version currently used in the pipelines, which is [0.11.8](https://releases.hashicorp.com/terraform/0.11.8/). This can be observed by opening the existing remote state file in the "tfbackends" storage account. Using the same version is necessary as terraform will not use state files that were written in a newer version, so a manual update using a newer version will mean that existing `terraform apply` scripts will fail until the state is overridden again.

The Azure CLI can be installed following [the instructions on Microsoft's website](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli). On Windows, I prefer to use WSL to cleanly separate my Azure Powershell and Azure CLI instances. If you note that most developers on your project are using Windows, it may be worth writing an `init.ps1` script that uses Azure Powershell and Powershell instead of Azure CLI and bash.

The format of the remote state blob name is `<service name>.<enviornment name>.terraform.tfstate`. It should be stored in the tfbackends storage account, in the tfstate container.