import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { HttpRequestInterceptor } from "./http-request.interceptor";
import { AuthTokenInterceptor } from "./auth-token.interceptor";

export const httpInterceptorProviders = [
//   { provide: HTTP_INTERCEsPTORS, useClass: HttpRequestInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: AuthTokenInterceptor, multi: true },
];