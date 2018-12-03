import * as types from '../../base/constants/ActionTypes'
import eew2AdminAPI from './eew2AdminAPI';
import {generateAppErrorEvent} from '../../base/utils/AppErrorEvent';
export function loadPeriodicData(eew2data) {
    return function (dispatch, getState) {
        const state = getState();
        dispatch(loadInitData(eew2data));
        dispatch(isOutputGenerationSuccess(false));
    }
}
export function loadInitData(eew2data) {
    return {type:types.LOAD_EEW2_DATA,eew2data};
}
export function loadEEW2Records(eew2data) {
    return function (dispatch, getState) {
        const state = getState();
        return eew2AdminAPI.geteew2records(eew2data.eew2recordInput).then(eew2ecords => {
            if(eew2ecords.status && eew2ecords.message){
                let arr = [];
                arr.push([]);
                dispatch(loadEEW2RecordsFailed(arr));
                throw eew2ecords;
            }else{
                if(eew2ecords){
                    eew2data.eew2ecords = eew2ecords;
                   dispatch(loadEEW2RecordsSuccess(eew2data));
                }
            }
        }).catch(error => {
            generateAppErrorEvent(error.type,error.status,error.message,error);
        });
    };
}
export function loadEEW2RecordsSuccess(eew2data) {
    return { type: types.GET_EEW2RECORDS_SUCCESS, eew2data };
}
export function loadEEW2RecordsFailed(eew2data) {
    return { type: types.GET_EEW2RECORDS_ERROR, eew2data };
}
export function getEEW2Pdf(dataset, reqNo, fein, empId) {
    return function (dispatch, getState) {
        const state = getState();
        return eew2AdminAPI.getEEW2Pdf(dataset, reqNo, fein, empId).then(eew2pdf => {
            if(eew2pdf){
                if(eew2pdf && eew2pdf.docData){
                    dispatch(getEEW2PdfSuccess(eew2pdf));
                }else if(eew2pdf && eew2pdf.message){
                    dispatch(getEEW2PdfError(eew2pdf));
                }
            }else{
                throw eew2pdf;
            }
        }).catch(error => {
            generateAppErrorEvent(error.type,error.status,error.message,error);
        });
    };
}
export function getEEW2PdfSuccess(eew2pdf) {
    return { type: types.GET_EEW2PDF_SUCCESS, eew2pdf };
}
export function getEEW2PdfError(eew2pdf) {
    return { type: types.GET_EEW2PDF_ERROR, eew2pdf };
}
export function generateOutputs(eew2recordInput) {
    return function (dispatch, getState) {
        const state = getState();
        return eew2AdminAPI.generateOutputs(eew2recordInput).then(eew2ecords => {
            if(eew2ecords.status && eew2ecords.message){
                let arr = [];
                arr.push([]);
                dispatch(generateOutputsFailed(arr));
                throw eew2ecords;
            }else{
                if(eew2ecords){
                   dispatch(generateOutputsSuccess(eew2ecords));
                }
            }
        }).catch(error => {
            generateAppErrorEvent(error.type,error.status,error.message,error);
        });
    };
}
export function generateOutputsSuccess(eew2ecords) {
    return { type: types.POST_GENERATE_OUTPUTS_SUCCESS, eew2ecords };
}
export function generateOutputsFailed(eew2ecords) {
    return { type: types.POST_GENERATE_OUTPUTS_ERROR, eew2ecords };
}
export function publishUnpublishEEW2Records(eew2recordInput) {
    return function (dispatch, getState) {
        const state = getState();
        return eew2AdminAPI.publishUnpublishEEW2Records(eew2recordInput).then(eew2ecords => {
            if(eew2ecords.status && eew2ecords.message){
                let arr = [];
                arr.push([]);
                dispatch(publishUnpublishEEW2Failed(arr));
                throw eew2ecords;
            }else{
                if(eew2ecords){
                   dispatch(publishUnpublishEEW2Success(eew2ecords));
                }
            }
        }).catch(error => {
            generateAppErrorEvent(error.type,error.status,error.message,error);
        });
    };
}
export function publishUnpublishEEW2Success(eew2ecords) {
    return { type: types.POST_PUBUNPUB_OUTPUTS_SUCCESS, eew2ecords };
}
export function publishUnpublishEEW2Failed(eew2ecords) {
    return { type: types.POST_PUBUNPUB_OUTPUTS_ERROR, eew2ecords };
}
export function isOutputGenerationInprogress(dataset) {
    return function (dispatch, getState) {
        const state = getState();
        return eew2AdminAPI.isOutputGenerationInprogress(dataset).then(outputgeninprogress => {
            if(outputgeninprogress.status && outputgeninprogress.message){
                let arr = [];
                arr.push([]);
                dispatch(isOutputGenerationSuccessFailed(arr));
                throw outputgeninprogress;
            }else{
                if(outputgeninprogress){
                   dispatch(isOutputGenerationSuccess(outputgeninprogress));
                }
            }
        }).catch(error => {
            generateAppErrorEvent(error.type,error.status,error.message,error);
        });
    };
}
export function isOutputGenerationSuccess(outputgeninprogress) {
    return { type: types.POST_OUTPUTGEN_INPROGRESS_SUCCESS, outputgeninprogress };
}
export function isOutputGenerationSuccessFailed(outputgeninprogress) {
    return { type: types.POST_OUTPUTGEN_INPROGRESS_ERROR, outputgeninprogress };
}