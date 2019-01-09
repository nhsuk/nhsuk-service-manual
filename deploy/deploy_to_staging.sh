az webapp deployment source config-zip --resource-group nhsuk-service-manual --name nhsuk-service-manual-staging --src $(System.DefaultWorkingDirectory)/_nhsuk.nhsuk-service-manual/drop/*.zip
