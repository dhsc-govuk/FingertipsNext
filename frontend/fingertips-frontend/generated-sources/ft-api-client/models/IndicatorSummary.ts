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
 * A summary of a public health indicator
 * @export
 * @interface IndicatorSummary
 */
export interface IndicatorSummary {
    /**
     * The unique identifier of the indicator
     * @type {number}
     * @memberof IndicatorSummary
     */
    indicatorId: number;
    /**
     * The title of the indicator
     * @type {string}
     * @memberof IndicatorSummary
     */
    title: string;
}

/**
 * Check if a given object implements the IndicatorSummary interface.
 */
export function instanceOfIndicatorSummary(value: object): value is IndicatorSummary {
    if (!('indicatorId' in value) || value['indicatorId'] === undefined) return false;
    if (!('title' in value) || value['title'] === undefined) return false;
    return true;
}

export function IndicatorSummaryFromJSON(json: any): IndicatorSummary {
    return IndicatorSummaryFromJSONTyped(json, false);
}

export function IndicatorSummaryFromJSONTyped(json: any, ignoreDiscriminator: boolean): IndicatorSummary {
    if (json == null) {
        return json;
    }
    return {
        
        'indicatorId': json['indicator_id'],
        'title': json['title'],
    };
}

export function IndicatorSummaryToJSON(json: any): IndicatorSummary {
    return IndicatorSummaryToJSONTyped(json, false);
}

export function IndicatorSummaryToJSONTyped(value?: IndicatorSummary | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'indicator_id': value['indicatorId'],
        'title': value['title'],
    };
}
