"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.put = exports.translateTextResponse = exports.translateTextRequest = exports.publishToSNSResponse = exports.publishToSNSRequest = void 0;
const utils_1 = require("@aws-appsync/utils");
function publishToSNSRequest(topicArn, values) {
    const arn = utils_1.util.urlEncode(topicArn);
    const message = utils_1.util.urlEncode(JSON.stringify(values));
    const parts = [
        'Action=Publish',
        'Version=2010-03-31',
        `TopicArn=${arn}`,
        `Message=${message}`,
    ];
    const body = parts.join('&');
    return {
        method: 'POST',
        resourcePath: '/',
        params: {
            body,
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
            },
        },
    };
}
exports.publishToSNSRequest = publishToSNSRequest;
function publishToSNSResponse(result) {
    if (result.statusCode !== 200) {
        console.log('ahhhh error', result);
        utils_1.util.appendError(result.body, `${result.statusCode}`);
    }
    const body = utils_1.util.xml.toMap(result.body);
    console.log('respone body -->', body);
    return body.PublishResponse.PublishResult;
}
exports.publishToSNSResponse = publishToSNSResponse;
function translateTextRequest(text, source, target) {
    return {
        method: 'POST',
        resourcePath: '/',
        params: {
            headers: {
                'content-type': 'application/x-amz-json-1.1',
                'x-amz-target': 'AWSShineFrontendService_20170701.TranslateText',
            },
            body: JSON.stringify({
                Text: text,
                SourceLanguageCode: source,
                TargetLanguageCode: target,
            }),
        },
    };
}
exports.translateTextRequest = translateTextRequest;
function translateTextResponse(result) {
    console.log('Translate result:', result);
    if (result.statusCode !== 200) {
        console.log('ahhhh error', result);
        utils_1.util.appendError(result.body, `${result.statusCode}`);
    }
    const body = JSON.parse(result.body);
    return body.TranslatedText;
}
exports.translateTextResponse = translateTextResponse;
function put(params) {
    const { key, values, condition } = params;
    return {
        operation: 'PutItem',
        key: utils_1.util.dynamodb.toMapValues(key),
        attributeValues: utils_1.util.dynamodb.toMapValues(values),
        condition: getCondition(condition),
    };
}
exports.put = put;
function getCondition(inCondObj) {
    if (!inCondObj)
        return null;
    const condition = JSON.parse(utils_1.util.transform.toDynamoDBConditionExpression(inCondObj));
    if (condition &&
        condition.expressionValues &&
        !Object.keys(condition.expressionValues).length) {
        delete condition.expressionValues;
    }
    return condition;
}
