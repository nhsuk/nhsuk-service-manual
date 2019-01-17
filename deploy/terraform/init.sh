if [ -z "$1" ]; then
  echo 'Usage: ./init.sh [environment]. Please specify the environment (production or staging).'
  exit 1
else
  ENVIRONMENT=$1
fi

terraform init -backend-config="key=nhs-service-manual.$ENVIRONMENT.terraform.tfstate" -backend-config="access_key=$(az storage account keys list -g tfbackends -n tfbackends --subscription www.nhs.uk | jq -r '.[0].value')" -reconfigure
