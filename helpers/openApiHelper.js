const inflection = require("inflection");

const helpers = {
  getAllEndpointParams(endpoint) {
    const baseParams = endpoint.parameters.map(param => {
      return {
        name: param.name,
        ...(param.schema || param)
      };
    });
    const bodyParams = helpers.getBodyParams(endpoint);
    if (!bodyParams) {
      return baseParams;
    }

    return baseParams.concat(bodyParams);
  },
  getBodyParams(endpoint) {
    if (!endpoint.requestBody) {
      return null;
    }

    if (!endpoint.requestBody.content) {
      return null;
    }

    if (!endpoint.requestBody.content["application/json"]) {
      return null;
    }

    if (!endpoint.requestBody.content["application/json"].schema) {
      return null;
    }

    const bodySchema = endpoint.requestBody.content["application/json"].schema;
    return Object.keys(bodySchema.properties).map(paramKey => {
      return {
        name: paramKey,
        ...bodySchema.properties[paramKey],
        required: bodySchema && bodySchema.required.includes(paramKey)
      };
    });
  },
  resolveNamingData(preset) {
    const { endpoint, config } = preset;
    const domainName =
      config.domainName || inflection.classify(config.path.split("/")[1]);

    const className = helpers.resolveClassName(preset);

    return {
      path: config.path,
      pathWithVar: config.path.replace(/\{/g, "${"),
      method: config.method,
      httpMethod: config.method.toUpperCase(),
      domainName,
      domainNameVariable: inflection.camelize(domainName, true),
      className,
      functionName: config.functionName || inflection.camelize(className, true),
      summary:
        endpoint.summary ||
        inflection.humanize(inflection.underscore(className))
    };
  },
  resolveClassName(preset) {
    const { endpoint, config, configName } = preset;
    return config.className || config.functionName
      ? inflection.classify(config.functionName)
      : null || endpoint.operationId
      ? inflection.classify(endpoint.operationId.replace(/\W/g, "_"))
      : null || endpoint.summary
      ? inflection.classify(endpoint.summary.replace(/\W/g, "_"))
      : null || inflection.classify(configName);
  }
};
module.exports = helpers;
