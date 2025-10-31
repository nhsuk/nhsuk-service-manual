# Guide: Scan secrets

- [Guide: Scan secrets](#guide-scan-secrets)
  - [Overview](#overview)
  - [Key files](#key-files)
  - [Configuration checklist](#configuration-checklist)
  - [Testing](#testing)
  - [Removing sensitive data](#removing-sensitive-data)

## Overview

Scanning a repository for hard-coded secrets is a crucial security practice. "Hard-coded secrets" pertain to sensitive data such as passwords, API keys and encryption keys that are embedded directly into the code. This practice is strongly discouraged as it may lead to security incidents.

[Gitleaks](https://github.com/gitleaks/gitleaks) is a powerful open-source tool designed to identify hard-coded secrets and other sensitive information in Git repositories. It works by scanning the commit history and the working directory for sensitive data that should not be there.

## Key files

- [`scan-secrets.sh`](../../scripts/githooks/scan-secrets.sh): A shell script that scans the codebase for hard-coded secrets
- [`gitleaks.toml`](../../scripts/config/gitleaks.toml): A configuration file for the secret scanner
- [`.gitleaksignore`](../../.gitleaksignore): A list of fingerprints to ignore by the secret scanner
- [`scan-secrets/action.yaml`](../../.github/actions/scan-secrets/action.yaml): GitHub action to run the scripts as part of the CI/CD pipeline
- [`pre-commit.yaml`](../../scripts/config/pre-commit.yaml): Run the secret scanner as a pre-commit git hook

## Configuration checklist

- [Add custom secret patterns](../../scripts/config/gitleaks.toml) to the configuration file to align with your project's specific requirements
- [Create a secret scan baseline](https://github.com/gitleaks/gitleaks/blob/master/README.md#gitleaksignore) for your repository by adding false-positive fingerprints to the ignore list
- Ensure that the GitHub action, which incorporates Gitleaks, forms part of your GitHub CI/CD workflow. It is designed to run a full scan as a part of the pipeline, providing additional protection against hard-coded secrets that might have been included prior to the rule additions or by bypassing the scanner
- Further details on this topic can be found in the [decision record](https://github.com/nhs-england-tools/repository-template/blob/main/docs/adr/ADR-002_Scan_repository_for_hardcoded_secrets.md) as well as in the [NHSE Software Engineering Quality Framework](https://github.com/NHSDigital/software-engineering-quality-framework/tree/main/tools/nhsd-git-secrets) where a usage of an alternative tool is shown

## Testing

You can execute and test the secret scanning across all commits locally on a developer's workstation using the following command

```shell
ALL_FILES=true ./scripts/githooks/scan-secrets.sh
```

## Removing sensitive data

Here are some tools that can help in removing sensitive data, such as passwords or API keys, from the Git history

- [`rtyley/bfg-repo-cleaner`](https://github.com/rtyley/bfg-repo-cleaner)
- [`newren/git-filter-repo`](https://github.com/newren/git-filter-repo)

For additional guidance, please refer also to the official [GitHub documentation](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository).
