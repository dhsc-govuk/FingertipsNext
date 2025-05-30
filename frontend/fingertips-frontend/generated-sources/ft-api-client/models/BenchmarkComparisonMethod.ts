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


/**
 * the benchmark comparison method used
 * @export
 */
export const BenchmarkComparisonMethod = {
    Unknown: 'Unknown',
    Quintiles: 'Quintiles',
    CIOverlappingReferenceValue95: 'CIOverlappingReferenceValue95',
    CIOverlappingReferenceValue99_8: 'CIOverlappingReferenceValue99_8'
} as const;
export type BenchmarkComparisonMethod = typeof BenchmarkComparisonMethod[keyof typeof BenchmarkComparisonMethod];


export function instanceOfBenchmarkComparisonMethod(value: any): boolean {
    for (const key in BenchmarkComparisonMethod) {
        if (Object.prototype.hasOwnProperty.call(BenchmarkComparisonMethod, key)) {
            if (BenchmarkComparisonMethod[key as keyof typeof BenchmarkComparisonMethod] === value) {
                return true;
            }
        }
    }
    return false;
}

export function BenchmarkComparisonMethodFromJSON(json: any): BenchmarkComparisonMethod {
    return BenchmarkComparisonMethodFromJSONTyped(json, false);
}

export function BenchmarkComparisonMethodFromJSONTyped(json: any, ignoreDiscriminator: boolean): BenchmarkComparisonMethod {
    return json as BenchmarkComparisonMethod;
}

export function BenchmarkComparisonMethodToJSON(value?: BenchmarkComparisonMethod | null): any {
    return value as any;
}

export function BenchmarkComparisonMethodToJSONTyped(value: any, ignoreDiscriminator: boolean): BenchmarkComparisonMethod {
    return value as BenchmarkComparisonMethod;
}

