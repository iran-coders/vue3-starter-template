import AuthenticationService from '@/services/authentication.service';

import router from '@/router/index';
import HttpStatusCode from '@/enums/HttpStatusCode';

/**
 * Handle authentication error
 *
 * @param {AxiosResponse} response
 * @returns {AxiosResponse}
 */
export default function (response) {
    if (response.status === HttpStatusCode.UNAUTHORIZED) {
        AuthenticationService.logout();
        router.push({ name: 'Login' });
    }

    return response;
}
