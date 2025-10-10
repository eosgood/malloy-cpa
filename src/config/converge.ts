// Type for Converge environment
type ConvergeEnv = 'prod' | 'demo';

/**
 * Returns the current Converge environment ('prod' or 'demo') based on process.env.CONVERGE_ENV.
 * Throws if the value is invalid or missing.
 */
export const getConvergeEnv = (): ConvergeEnv => {
    const env = process.env.NEXT_PUBLIC_CONVERGE_ENV;
    if (env === 'prod' || env === 'demo') {
        return env;
    }
    throw new Error(`Invalid or missing CONVERGE_ENV: "${env}". Must be 'prod' or 'demo'.`);
};

/**
 * Returns the Converge API base URL based on the CONVERGE_ENV environment variable.
 * - prod: https://api.convergepay.com/
 * - demo: https://demo.convergepay.com/
 */
export const getConvergeApiBaseUrl = (): string => {
    switch (getConvergeEnv()) {
        case 'prod':
            return 'https://api.convergepay.com/';
        case 'demo':
            return 'https://demo.convergepay.com/';
    }
}
