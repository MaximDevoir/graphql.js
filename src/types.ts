import { Agent } from "http";
import { request as Request } from "@octokit/request";

export type Query = string;

export interface graphql {
  /**
   * Sends a request based on endpoint options
   *
   * @param {object} endpoint Must set `method` and `url`. Plus URL, query or body parameters, as well as `headers`, `mediaType.{format|previews}`, `request`, or `baseUrl`.
   */
  (options: Parameters): Promise<GraphQlQueryResponseData>;

  /**
   * Sends a request based on endpoint options
   *
   * @param {string} route Request method + URL. Example: `'GET /orgs/:org'`
   * @param {object} [parameters] URL, query or body parameters, as well as `headers`, `mediaType.{format|previews}`, `request`, or `baseUrl`.
   */
  (query: Query, parameters?: Parameters): Promise<GraphQlQueryResponseData>;

  /**
   * Returns a new `endpoint` with updated route and parameters
   */
  defaults: (newDefaults: Parameters) => graphql;

  /**
   * Octokit endpoint API, see {@link https://github.com/octokit/endpoint.js|@octokit/endpoint}
   */
  endpoint: typeof Request.endpoint;
}

// export type withCustomRequest = (request: typeof Request) => graphql;

export type GraphQlQueryResponseData = {
  [key: string]: any;
} | null;

export type GraphQlQueryResponse = {
  data: GraphQlQueryResponseData;
  errors?: [
    {
      message: string;
      path: [string];
      extensions: { [key: string]: any };
      locations: [
        {
          line: number;
          column: number;
        }
      ];
    }
  ];
};

// TODO: deduplicate
/**
 * Endpoint parameters
 */
export type Parameters = {
  /**
   * Base URL to be used when a relative URL is passed, such as `/orgs/:org`.
   * If `baseUrl` is `https://enterprise.acme-inc.com/api/v3`, then the request
   * will be sent to `https://enterprise.acme-inc.com/api/v3/orgs/:org`.
   */
  baseUrl?: string;

  /**
   * HTTP headers. Use lowercase keys.
   */
  headers?: RequestHeaders;

  /**
   * Media type options, see {@link https://developer.github.com/v3/media/|GitHub Developer Guide}
   */
  mediaType?: {
    /**
     * `json` by default. Can be `raw`, `text`, `html`, `full`, `diff`, `patch`, `sha`, `base64`. Depending on endpoint
     */
    format?: string;

    /**
     * Custom media type names of {@link https://developer.github.com/v3/media/|API Previews} without the `-preview` suffix.
     * Example for single preview: `['squirrel-girl']`.
     * Example for multiple previews: `['squirrel-girl', 'mister-fantastic']`.
     */
    previews?: string[];
  };

  /**
   * Pass custom meta information for the request. The `request` object will be returned as is.
   */
  request?: OctokitRequestOptions;

  /**
   * Any additional parameter will be passed as follows
   * 1. URL parameter if `':parameter'` or `{parameter}` is part of `url`
   * 2. Query parameter if `method` is `'GET'` or `'HEAD'`
   * 3. Request body if `parameter` is `'data'`
   * 4. JSON in the request body in the form of `body[parameter]` unless `parameter` key is `'data'`
   */
  [parameter: string]: any;
};

export type RequestHeaders = {
  /**
   * Avoid setting `accept`, use `mediaFormat.{format|previews}` instead.
   */
  accept?: string;
  /**
   * Use `authorization` to send authenticated request, remember `token ` / `bearer ` prefixes. Example: `token 1234567890abcdef1234567890abcdef12345678`
   */
  authorization?: string;
  /**
   * `user-agent` is set do a default and can be overwritten as needed.
   */
  "user-agent"?: string;

  [header: string]: string | number | undefined;
};

export type OctokitRequestOptions = {
  /**
   * Node only. Useful for custom proxy, certificate, or dns lookup.
   */
  agent?: Agent;
  /**
   * Custom replacement for built-in fetch method. Useful for testing or request hooks.
   */
  fetch?: Fetch;
  /**
   * Use an `AbortController` instance to cancel a request. In node you can only cancel streamed requests.
   */
  signal?: Signal;
  /**
   * Node only. Request/response timeout in ms, it resets on redirect. 0 to disable (OS limit applies). `options.request.signal` is recommended instead.
   */
  timeout?: number;

  [option: string]: any;
};

/**
 * Request method
 */
export type Method = "DELETE" | "GET" | "HEAD" | "PATCH" | "POST" | "PUT";

/**
 * Relative or absolute URL. Examples: `'/orgs/:org'`, `https://example.com/foo/bar`
 */
export type Url = string;

export type Endpoint = Parameters & {
  method: Method;
  url: Url;
};

export type OctokitResponse<T> = {
  headers: ResponseHeaders;
  /**
   * http response code
   */
  status: number;
  /**
   * URL of response after all redirects
   */
  url: string;
  /**
   *  This is the data you would see in https://developer.Octokit.com/v3/
   */
  data: T;
};

export type ResponseHeaders = {
  [header: string]: string;
};

export type Fetch = any;
export type Signal = any;
