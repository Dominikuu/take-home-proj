export enum HttpMethods {
    GET = 'GET',
    POST = 'POST',
    PUT = 'PUT',
    DELETE = 'DELETE',
    PATCH = 'PATCH',
}

export interface RequestParams {
    [key: string]: string;
}

export enum ResponseParser {
    ArrayBuffer = 'arraybuffer',
    Blob = 'blob',
    Json = 'json',
    Text = 'text',
}

export interface ApiReference {
    /**
     * URL to Backend
     */
    readonly url: string;
    /**
     * Request HTTP-Method
     */
    readonly method: HttpMethods;
    /**
     * Aggregatable JSON key in body
     */
    readonly bodyAggrKeys?: Array<string | null>;
    /**
     * Response type
     */
    readonly responseType?:
        | ResponseParser.ArrayBuffer
        | ResponseParser.Blob
        | ResponseParser.Json
        | ResponseParser.Text;
}

export interface ApiRequest<T> {
    /**
     * Page Path
     */
    page?: string;
    /**
     * Request Identity, will be used to build resposne structure
     */
    readonly identity: string;
    /**
     * API reference
     */
    readonly apiRef: ApiReference;
    /**
     * Query Parameters filled to request-url
     */
    params?: RequestParams;
    /**
     * Request Body
     */
    body?: T;
    /**
     * Renew Session Expiry or not.
     * Default is "true", set to "false" to omit session-renewal.
     */
    renewSession?: boolean;

    /**
     * Preserved request won't be cancelled by route change event.
     * Default is "false", API call can be cancelled by route event.
     */
    preserved?: boolean;

    /**
     * Skip redirect action if no privilege
     * Default is "false", only set this flag for requests inside libs.
     */
    skipPrivilegeRedirect?: boolean;

    /**
     * API Error handling custom funciton
     * If provided, error will be catch instead of throw it
     */
    catchError?: (error: any, request: ApiRequest<T>) => void;
}

export interface ApiResponse<R> {
    /**
     * Page Path
     */
    readonly page: string;
    /**
     * Response Identity, matched to Request Identity.
     */
    readonly identity: string;
    /**
     * Response HTTP-Status
     */
    readonly status: number;
    /**
     * Response Message (null = success)
     */
    readonly message: string | null;
    /**
     * Response Body
     */
    readonly body: R;
}
