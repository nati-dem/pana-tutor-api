import {HttpResponse} from "../../../pana-tutor-lib/model/api-response.interface";

export const handleApiError = (error: any): HttpResponse => {
    console.log('API Response Error: ', error.message);
    const errorResponse: HttpResponse = {} as HttpResponse;
    errorResponse.data = error.response.data;
    errorResponse.status = error.response.status;
    errorResponse.message = error.message;
    return errorResponse;
}
