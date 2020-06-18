import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';

import teachers from './teachers';
import lesson from './lesson';
import snackbar from './snackbar';
import auth from './auth';
import loadingIndicator from './loadingIndicator';
import schedule from './schedule';
import classActions from './class';
import subjects from './subjects';
import groups from './groups';
import rooms from './rooms';
import roomTypes from './roomTypes';
import teachersWish from './teachersWish';
import busyRooms from './busyRooms';
import semesters from './semesters';
import users from './users';
import freeRooms from './freeRooms';


const rootReducer = combineReducers({
    lesson,
    auth,
    snackbar,
    schedule,
    users,
    loadingIndicator,
    classActions,
    teachers,
    subjects,
    groups,
    rooms,
    roomTypes,
    teachersWish,
    busyRooms,
    semesters,
    freeRooms,

    form: formReducer
});

export default rootReducer;