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
 * 
 * @export
 * @interface FilterIndicators400Response
 */
export interface FilterIndicators400Response {
    /**
     * 
     * @type {string}
     * @memberof FilterIndicators400Response
     */
    message: string;
}

/**
 * Check if a given object implements the FilterIndicators400Response interface.
 */
export function instanceOfFilterIndicators400Response(value: object): value is FilterIndicators400Response {
    if (!('message' in value) || value['message'] === undefined) return false;
    return true;
}

export function FilterIndicators400ResponseFromJSON(json: any): FilterIndicators400Response {
    return FilterIndicators400ResponseFromJSONTyped(json, false);
}

export function FilterIndicators400ResponseFromJSONTyped(json: any, ignoreDiscriminator: boolean): FilterIndicators400Response {
    if (json == null) {
        return json;
    }
    return {
        
        'message': json['message'],
    };
}

export function FilterIndicators400ResponseToJSON(json: any): FilterIndicators400Response {
    return FilterIndicators400ResponseToJSONTyped(json, false);
}

export function FilterIndicators400ResponseToJSONTyped(value?: FilterIndicators400Response | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'message': value['message'],
    };
}

