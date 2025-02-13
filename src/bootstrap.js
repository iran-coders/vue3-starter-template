import ApiService from '@/repositories/api.repository';

import TokenService from '@/services/token.service';
import ThemeService from '@/services/theme.service';
import LanguageService from '@/services/language.service';

import AuthenticateUser from '@/repositories/middleware/AuthenticateUser';

import MimeType from '@/enums/MimeType';
import HttpHeader from '@/enums/HttpHeader';

ApiService.setHeader(HttpHeader.CONTENT_TYPE, MimeType.APPLICATION_JSON);
ApiService.addResponseMiddleware(AuthenticateUser);

if (TokenService.isExist()) {
    ApiService.setHeader(HttpHeader.AUTHORIZATION, `Bearer ${TokenService.get()}`);
}

ThemeService.updateDOM();

if (LanguageService.isRtl()) {
    import('@/assets/scss/app-rtl.scss');
} else {
    import('@/assets/scss/app.scss');
}
