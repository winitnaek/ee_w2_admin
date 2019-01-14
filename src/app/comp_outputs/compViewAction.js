import * as types from '../../base/constants/ActionTypes';
import { OUTPUT_MESSAGES } from '../../base/constants/AppConstants';
import { generateAppErrorEvent } from '../../base/utils/AppErrorEvent';
import compdataApi from './compdataAPI';

export function getAuditOutputSuccess(outputDoc) {
    return {
        type: types.GET_COMPANY_FILE_SUCCESS,
        outputDoc
    };
}
export function getAuditMessagesSuccess(messages) {
    return {
        type: types.GET_MESSAGES_SUCCESS,
        messages
    };
}
export function getAuditOutputError(outputDoc) {
    return {
        type: types.GET_COMPANY_FILE_ERROR,
        outputDoc
    };
}

export function getAuditOutput(dataset, compId, reqNo, fileType) {
    return function (dispatch, getState) {
        return compdataApi.getCompanyAuditData(dataset, reqNo, compId, fileType).then(output => {
            if (output) {
                if (OUTPUT_MESSAGES != fileType) {
                    dispatch(getAuditOutputSuccess(output));
                } else {
                    dispatch(getAuditMessagesSuccess(output));
                }
            } else {
                throw output;
            }
        }).catch(error => {
            generateAppErrorEvent(error.type, error.status, error.message, error);
        });
    };
}
