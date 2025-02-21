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
import type { HealthDataPoint } from './HealthDataPoint';
import {
    HealthDataPointFromJSON,
    HealthDataPointFromJSONTyped,
    HealthDataPointToJSON,
    HealthDataPointToJSONTyped,
} from './HealthDataPoint';

/**
 * Associates a list of health data points with the relevant geographical area (represented by it's unique code).
 * @export
 * @interface HealthDataForArea
 */
export interface HealthDataForArea {
    /**
     * The unique area code that the health data are for
     * @type {string}
     * @memberof HealthDataForArea
     */
    areaCode: string;
    /**
     * The name of the area that the health data are for
     * @type {string}
     * @memberof HealthDataForArea
     */
    areaName: string;
    /**
     * The health data points for the area and indicator
     * @type {Array<HealthDataPoint>}
     * @memberof HealthDataForArea
     */
    healthData: Array<HealthDataPoint>;
}

/**
 * Check if a given object implements the HealthDataForArea interface.
 */
export function instanceOfHealthDataForArea(value: object): value is HealthDataForArea {
    if (!('areaCode' in value) || value['areaCode'] === undefined) return false;
    if (!('areaName' in value) || value['areaName'] === undefined) return false;
    if (!('healthData' in value) || value['healthData'] === undefined) return false;
    return true;
}

export function HealthDataForAreaFromJSON(json: any): HealthDataForArea {
    return HealthDataForAreaFromJSONTyped(json, false);
}

export function HealthDataForAreaFromJSONTyped(json: any, ignoreDiscriminator: boolean): HealthDataForArea {
    if (json == null) {
        return json;
    }
    return {
        
        'areaCode': json['areaCode'],
        'areaName': json['areaName'],
        'healthData': ((json['healthData'] as Array<any>).map(HealthDataPointFromJSON)),
    };
}

export function HealthDataForAreaToJSON(json: any): HealthDataForArea {
    return HealthDataForAreaToJSONTyped(json, false);
}

export function HealthDataForAreaToJSONTyped(value?: HealthDataForArea | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'areaCode': value['areaCode'],
        'areaName': value['areaName'],
        'healthData': ((value['healthData'] as Array<any>).map(HealthDataPointToJSON)),
    };
}

