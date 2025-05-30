/* tslint:disable */
/* eslint-disable */
/**
 * Fingertips API
 * An API to query public health indicator data.
 *
 * The version of the OpenAPI document: 1.0.0
 * Contact: ProfileFeedback@dhsc.gov.uk
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { mapValues } from '../runtime';
/**
 * The server could not understand the request due to invalid syntax. The client should modify the request and try again.
 * @export
 * @interface BadRequest
 */
export interface BadRequest {
    /**
     * 
     * @type {string}
     * @memberof BadRequest
     */
    message: string;
}

/**
 * Check if a given object implements the BadRequest interface.
 */
export function instanceOfBadRequest(value: object): value is BadRequest {
    if (!('message' in value) || value['message'] === undefined) return false;
    return true;
}

export function BadRequestFromJSON(json: any): BadRequest {
    return BadRequestFromJSONTyped(json, false);
}

export function BadRequestFromJSONTyped(json: any, ignoreDiscriminator: boolean): BadRequest {
    if (json == null) {
        return json;
    }
    return {
        
        'message': json['message'],
    };
}

export function BadRequestToJSON(json: any): BadRequest {
    return BadRequestToJSONTyped(json, false);
}

export function BadRequestToJSONTyped(value?: BadRequest | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'message': value['message'],
    };
}

