export class LinkGenerator {
  constructor(windowLocation) {
    this.urlRoot = `${windowLocation.protocol}//${windowLocation.host}${windowLocation.pathname}`;
  }

  linkTo(params) {
    params = params || {};
    const qsParams = Object.getOwnPropertyNames(params).map(propName => `${propName}=` + encodeURI(params[propName]));
    if (qsParams.length == 0) {
      return this.urlRoot;
    }

    const qsParamsJoined = qsParams.join("&");
    return this.urlRoot + "?" + qsParamsJoined;
  }
}