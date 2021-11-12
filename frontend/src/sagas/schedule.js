import { call, put, takeEvery, takeLatest } from 'redux-saga/effects';
import {
    setLoading,
    setScheduleLoading,
    setSemesterLoading,
    showAllGroupsSuccess,
    showAllTeachersSuccess,
} from '../actions';
import * as actionTypes from '../actions/actionsType';
import { setMainScheduleLoading } from '../actions/loadingIndicator';
import { getAllTeachersByDepartmentId } from '../actions/teachers';
import {
    CLEAR_SCHEDULE_URL,
    CURRENT_SEMESTER_URL,
    DEFAULT_SEMESTER_URL,
    DEPARTMENT_URL,
    FOR_TEACHER_SCHEDULE_URL,
    FULL_SCHEDULE_URL,
    GROUPS_URL,
    GROUP_SCHEDULE_URL,
    PUBLIC_SEMESTERS_URL,
    PUBLIC_TEACHER_URL,
    ROOMS_AVAILABILITY,
    SCHEDULE_CHECK_AVAILABILITY_URL,
    SCHEDULE_ITEMS_URL,
    SCHEDULE_ITEM_ROOM_CHANGE,
    SCHEDULE_SEMESTER_ITEMS_URL,
    SEMESTERS_URL,
    SEND_PDF_TO_EMAIL,
    TEACHER_SCHEDULE_URL,
    TEACHER_URL,
} from '../constants/axios';
import {
    setOpenSuccessSnackbar,
    setOpenErrorSnackbar,
    setOpenInfoSnackbar,
} from '../actions/snackbar';
import {
    COMMON_SCHEDULE_TITLE,
    NO_CURRENT_SEMESTER_ERROR,
} from '../constants/translationLabels/common';
import {
    FORM_CHOSEN_SEMESTER_LABEL,
    FORM_SCHEDULE_LABEL,
} from '../constants/translationLabels/formElements';
import {
    BACK_END_SUCCESS_OPERATION,
    CHOSEN_SEMESTER_HAS_NOT_GROUPS,
    CLEARED_LABEL,
    SERVICE_MESSAGE_GROUP_LABEL,
    SERVICE_MESSAGE_SENT_LABEL,
    UPDATED_LABEL,
} from '../constants/translationLabels/serviceMessages';
import { sortGroup } from '../helper/sortGroup';
import { createErrorMessage, createMessage } from '../utils/sagaUtils';
import {
    checkAvailabilityScheduleSuccess,
    deleteScheduleItemSuccess,
    getAllPublicSemestersSuccess,
    getCurrentSemesterSuccess,
    getDefaultSemesterSuccess,
    getFullScheduleSuccess,
    getGroupScheduleSuccess,
    getScheduleItemsSuccess,
    getTeacherRangeScheduleSuccess,
    getTeacherScheduleSuccess,
} from '../actions/schedule';
import i18n from '../i18n';
import { axiosCall } from '../services/axios';

export function* getScheduleItemsBySemester({ semesterId }) {
    const requestUrl = `${SCHEDULE_SEMESTER_ITEMS_URL}?semesterId=${semesterId}`;
    try {
        const { data } = yield call(axiosCall, requestUrl);
        yield put(getScheduleItemsSuccess(data));
    } catch (error) {
        yield put(setOpenErrorSnackbar(createErrorMessage(error)));
    } finally {
        yield put(setScheduleLoading(false));
    }
}

export function* getScheduleItems() {
    try {
        const { data } = yield call(axiosCall, CURRENT_SEMESTER_URL);
        yield put(getCurrentSemesterSuccess(data));
        const { id } = data;
        yield call(getScheduleItemsBySemester, { semesterId: id });
    } catch (error) {
        yield put(setOpenErrorSnackbar(i18n.t(NO_CURRENT_SEMESTER_ERROR)));
        yield put(setLoading(false));
    }
}

export function* addItemsToSchedule({ item }) {
    try {
        yield call(axiosCall, SCHEDULE_ITEMS_URL, 'POST', item);
        yield call(getScheduleItems);
    } catch (error) {
        yield put(setOpenErrorSnackbar(createErrorMessage(error)));
    }
}

export function* checkAvailabilityChangeRoomSchedule({ item }) {
    const { periodId, dayOfWeek, evenOdd, semesterId } = item;
    const requestUrl = `${ROOMS_AVAILABILITY}?classId=${periodId}&dayOfWeek=${dayOfWeek}&evenOdd=${evenOdd}&semesterId=${semesterId}`;
    try {
        const { data } = yield call(axiosCall, requestUrl);
        yield put(
            checkAvailabilityScheduleSuccess({
                classSuitsToTeacher: true,
                teacherAvailable: true,
                rooms: data,
            }),
        );
    } catch (error) {
        yield put(setOpenErrorSnackbar(createErrorMessage(error)));
    } finally {
        yield put(setLoading(false));
    }
}

export function* checkScheduleItemAvailability({ item }) {
    const { periodId, dayOfWeek, evenOdd, lessonId, semesterId } = item;
    const requestUrl = `${SCHEDULE_CHECK_AVAILABILITY_URL}?classId=${periodId}&dayOfWeek=${dayOfWeek}&evenOdd=${evenOdd}&lessonId=${lessonId}&semesterId=${semesterId}`;
    try {
        const { data } = yield call(axiosCall, requestUrl);
        yield put(checkAvailabilityScheduleSuccess(data));
    } catch (error) {
        yield put(setOpenErrorSnackbar(createErrorMessage(error)));
    } finally {
        yield put(setLoading(false));
    }
}

export function* clearSchedule({ semesterId }) {
    try {
        const requestUrl = `${CLEAR_SCHEDULE_URL}?semesterId=${semesterId}`;
        yield call(axiosCall, requestUrl, 'DELETE');
        const message = createMessage(
            BACK_END_SUCCESS_OPERATION,
            COMMON_SCHEDULE_TITLE,
            CLEARED_LABEL,
        );
        yield put(setOpenSuccessSnackbar(message));
        yield call(getScheduleItems);
    } catch (error) {
        yield put(setOpenErrorSnackbar(createErrorMessage(error)));
        yield put(setLoading(false));
    }
}

export function* deleteScheduleItem({ itemId }) {
    try {
        const requestUrl = `${SCHEDULE_ITEMS_URL}/${itemId}`;
        yield call(axiosCall, requestUrl, 'DELETE');
        yield put(deleteScheduleItemSuccess(itemId));
        yield call(getScheduleItems);
    } catch (error) {
        yield put(setOpenErrorSnackbar(createErrorMessage(error)));
        yield put(setLoading(false));
    }
}

export function* editRoomItemToSchedule({ item }) {
    try {
        const { roomId, itemId } = item;
        const requestUrl = `${SCHEDULE_ITEM_ROOM_CHANGE}?roomId=${roomId}&scheduleId=${itemId}`;
        yield call(axiosCall, requestUrl, 'PUT');
        const message = createMessage(
            BACK_END_SUCCESS_OPERATION,
            COMMON_SCHEDULE_TITLE,
            UPDATED_LABEL,
        );
        yield put(setOpenSuccessSnackbar(message));
        yield call(getScheduleItems);
    } catch (error) {
        yield put(setOpenErrorSnackbar(createErrorMessage(error)));
    }
}
// Check if it is necessary here
export function* getAllPublicGroups({ id }) {
    try {
        if (id !== null && id !== undefined) {
            const requestUrl = `/${SEMESTERS_URL}/${id}/${GROUPS_URL}`;
            const { data } = yield call(axiosCall, requestUrl);
            const sortedGroups = data.sort((a, b) => sortGroup(a, b));
            yield put(showAllGroupsSuccess(sortedGroups));
            if (data.length === 0) {
                const message = createMessage(
                    CHOSEN_SEMESTER_HAS_NOT_GROUPS,
                    FORM_CHOSEN_SEMESTER_LABEL,
                    SERVICE_MESSAGE_GROUP_LABEL,
                );
                yield put(setOpenInfoSnackbar(message));
            }
        }
    } catch (error) {
        yield put(setOpenErrorSnackbar(createErrorMessage(error)));
    }
}

export function* getAllPublicSemesters() {
    try {
        const { data } = yield call(axiosCall, PUBLIC_SEMESTERS_URL);
        yield put(getAllPublicSemestersSuccess(data));
    } catch (error) {
        yield put(setOpenErrorSnackbar(createErrorMessage(error)));
    }
}

// Check if it is necessary here
export function* getAllPublicTeachers() {
    try {
        const response = yield call(axiosCall, PUBLIC_TEACHER_URL);
        yield put(showAllTeachersSuccess(response.data));
    } catch (error) {
        yield put(setOpenErrorSnackbar(createErrorMessage(error)));
    }
}

// Check if it is necessary here
export function* getAllPublicTeachersByDepartment({ departmentId }) {
    const requestUrl = `${DEPARTMENT_URL}/${departmentId}/${TEACHER_URL}`;
    try {
        const { data } = yield call(axiosCall, requestUrl);
        yield put(getAllTeachersByDepartmentId(data));
    } catch (error) {
        yield put(setOpenErrorSnackbar(createErrorMessage(error)));
    }
}

export function* getCurrentSemester() {
    try {
        const { data } = yield call(axiosCall, CURRENT_SEMESTER_URL);
        yield put(getCurrentSemesterSuccess(data));
    } catch (error) {
        yield put(setOpenErrorSnackbar(createErrorMessage(error)));
    } finally {
        yield put(setSemesterLoading(false));
    }
}

export function* getDefaultSemester() {
    try {
        const { data } = yield call(axiosCall, DEFAULT_SEMESTER_URL);
        yield put(getDefaultSemesterSuccess(data));
    } catch (error) {
        yield put(setOpenErrorSnackbar(createErrorMessage(error)));
    } finally {
        yield put(setSemesterLoading(false));
    }
}

export function* getFullSchedule({ semesterId }) {
    const requestUrl = FULL_SCHEDULE_URL + semesterId;
    try {
        yield put(setMainScheduleLoading(true));
        const { data } = yield call(axiosCall, requestUrl);
        yield put(getFullScheduleSuccess(data));
    } catch (error) {
        yield put(setOpenErrorSnackbar(createErrorMessage(error)));
    } finally {
        yield put(setMainScheduleLoading(false));
    }
}

export function* getGroupSchedule({ groupId, semesterId }) {
    const requestUrl = `${GROUP_SCHEDULE_URL + semesterId}&groupId=${groupId}`;
    try {
        yield put(setMainScheduleLoading(true));
        const { data } = yield call(axiosCall, requestUrl);
        yield put(getGroupScheduleSuccess(data));
    } catch (error) {
        yield put(setOpenErrorSnackbar(createErrorMessage(error)));
    } finally {
        yield put(setMainScheduleLoading(false));
    }
}

export function* getTeacherRangeSchedule({ values }) {
    try {
        const { startDay, endDay } = values;
        const fromUrlPart = startDay.replace(/\//g, '-');
        const toUrlPart = endDay.replace(/\//g, '-');
        const requestUrl = `${FOR_TEACHER_SCHEDULE_URL}?from=${fromUrlPart}&to=${toUrlPart}`;
        const { data } = yield call(axiosCall, requestUrl);
        yield put(getTeacherRangeScheduleSuccess(data));
    } catch (error) {
        yield put(setOpenErrorSnackbar(createErrorMessage(error)));
    } finally {
        yield put(setLoading(false));
    }
}

export function* getTeacherSchedule({ teacherId, semesterId }) {
    const requestUrl = `${TEACHER_SCHEDULE_URL + semesterId}&teacherId=${teacherId}`;
    try {
        yield put(setMainScheduleLoading(true));
        const { data } = yield call(axiosCall, requestUrl);
        yield put(getTeacherScheduleSuccess(data));
    } catch (error) {
        yield put(setOpenErrorSnackbar(createErrorMessage(error)));
    } finally {
        yield put(setMainScheduleLoading(false));
    }
}

export function* sendTeacherSchedule({ data }) {
    try {
        const teachersId = data.teachersId.map((teacherId) => `teachersId=${teacherId}`).join('&');
        const { semesterId, language } = data;
        const requestUrl = `${SEND_PDF_TO_EMAIL}/semester/${semesterId}?language=${language}&${teachersId}`;
        yield call(axiosCall, requestUrl);
        const message = createMessage(
            BACK_END_SUCCESS_OPERATION,
            FORM_SCHEDULE_LABEL,
            SERVICE_MESSAGE_SENT_LABEL,
        );
        yield put(setOpenSuccessSnackbar(message));
    } catch (error) {
        yield put(setOpenErrorSnackbar(createErrorMessage(error)));
    } finally {
        yield put(setLoading(false));
    }
}

export default function* watchSchedule() {
    yield takeLatest(actionTypes.GET_CURRENT_SEMESTER_START, getCurrentSemester);
    yield takeLatest(actionTypes.GET_DEFAULT_SEMESTER_START, getDefaultSemester);
    yield takeLatest(actionTypes.CHECK_AVAILABILITY_SCHEDULE_START, checkScheduleItemAvailability);
    yield takeLatest(actionTypes.GET_SCHEDULE_ITEMS_START, getScheduleItemsBySemester);
    yield takeLatest(
        actionTypes.CHECK_AVAILABILITY_CHANGE_ROOM_SCHEDULE_START,
        checkAvailabilityChangeRoomSchedule,
    );
    yield takeLatest(
        actionTypes.GET_ALL_PUBLIC_TEACHERS_BY_DEPARTMENT_START,
        getAllPublicTeachersByDepartment,
    );
    yield takeLatest(actionTypes.GET_ALL_PUBLIC_TEACHERS_START, getAllPublicTeachers);
    yield takeLatest(actionTypes.GET_ALL_PUBLIC_GROUPS_START, getAllPublicGroups);
    yield takeLatest(actionTypes.GET_ALL_PUBLIC_SEMESTERS_START, getAllPublicSemesters);
    yield takeLatest(actionTypes.SEND_TEACHER_SCHEDULE_START, sendTeacherSchedule);
    yield takeLatest(actionTypes.GET_TEACHER_RANGE_SCHEDULE_START, getTeacherRangeSchedule);
    yield takeLatest(actionTypes.GET_ALL_SCHEDULE_ITEMS_START, getScheduleItems);
    yield takeEvery(actionTypes.ADD_ITEM_TO_SCHEDULE_START, addItemsToSchedule);
    yield takeEvery(actionTypes.EDIT_ITEM_TO_SCHEDULE_START, editRoomItemToSchedule);
    yield takeEvery(actionTypes.DELETE_SCHEDULE_ITEM_START, deleteScheduleItem);
    yield takeEvery(actionTypes.CLEAR_SCHEDULE_START, clearSchedule);
    yield takeLatest(actionTypes.GET_GROUP_SCHEDULE_START, getGroupSchedule);
    yield takeLatest(actionTypes.GET_TEACHER_SCHEDULE_START, getTeacherSchedule);
    yield takeLatest(actionTypes.GET_FULL_SCHEDULE_START, getFullSchedule);
}
