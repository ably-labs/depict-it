module.exports = function checkConfig(requiredConfiguration) {
    const missingKeys = requiredConfiguration.filter(key => !process.env[key] || (process.env[key].length <= 0));
    const anyMissing = missingKeys.length > 0;

    if (anyMissing) {
        throw `Your Azure Functions configuration is missing the following configuration setting(s):\r\n${missingKeys.join(', ')}\r\n
        If you're in a development environment, make sure you have a configuration file in /api/local.settings.json with these keys configured:
        ${requiredConfiguration.join(', ')}\r\n
        
        If you see this message while deployed to Azure, make sure you've configured your Application Settings - https://docs.microsoft.com/en-us/azure/azure-functions/functions-how-to-use-azure-function-app-settings \r\n
        If you see this message locally, you can learn more about local.settings.json here - https://docs.microsoft.com/en-us/azure/azure-functions/functions-run-local?tabs=windows%2Ccsharp%2Cbash#local-settings-file`;
    }
}