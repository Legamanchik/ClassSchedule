import React, { useEffect, useState } from 'react';

import AddTeacherForm from '../../components/AddTeacherForm/AddTeacherForm';
import Card from '../../share/Card/Card';
import WishModal from '../WishModal/WishModal';

import ConfirmDialog from '../../share/modals/dialog';
import { cardType } from '../../constants/cardType';

import { FaEdit } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';
import Button from '@material-ui/core/Button';
import { showTeacherWish } from '../../services/teacherWishService';

import './TeachersList.scss';

import { connect } from 'react-redux';

import {
    getDisabledTeachersService,
    handleTeacherService,
    removeTeacherCardService,
    selectTeacherCardService,
    setDisabledTeachersService,
    setEnabledTeachersService,
    showAllTeachersService
} from '../../services/teacherService';

import { useTranslation } from 'react-i18next';
import { search } from '../../helper/search';
import SearchPanel from '../../share/SearchPanel/SearchPanel';
import NotFound from '../../share/NotFound/NotFound';
import { GiSightDisabled, IoMdEye } from 'react-icons/all';
import { disabledCard } from '../../constants/disabledCard';
import { getPublicClassScheduleListService } from '../../services/classService';

const TeacherList = props => {
    const { t } = useTranslation('common');

    const [open, setOpen] = useState(false);
    const [teacherCardId, setTeacherId] = useState();
    const [term, setTerm] = useState('');
    const [disabled, setDisabled] = useState(false);
    const [hideDialog, setHideDialog] = useState(null);

    useEffect(() => showAllTeachersService(), []);
    useEffect(() => getDisabledTeachersService(), []);
    useEffect(() => getPublicClassScheduleListService(), []);

    const teachers = props.teachers;
    const disabledTeachers = props.disabledTeachers;
    const teacherLength = disabled ? disabledTeachers.length : teachers.length;

    const teacherSubmit = values => {
        handleTeacherService(values);
    };

    const selectTeacherCard = teacherCardId => {
        selectTeacherCardService(teacherCardId);
    };

    const removeTeacherCard = id => {
        removeTeacherCardService(id);
    };

    const handleClickOpen = teacherCardId => {
        setTeacherId(teacherCardId);
        setOpen(true);
    };

    const handleClose = teacherCardId => {
        setOpen(false);
        if (!teacherCardId) {
            return;
        }
        if (hideDialog) {
            if (disabled) {
                const teacher = disabledTeachers.find(
                    teacher => teacher.id === teacherCardId
                );
                setEnabledTeachersService(teacher);
            } else {
                const teacher = teachers.find(
                    teacher => teacher.id === teacherCardId
                );
                setDisabledTeachersService(teacher);
            }
        } else {
            removeTeacherCard(teacherCardId);
        }
        setHideDialog(null);
    };

    const [openWish, setOpenWish] = useState(false);
    const [teacher, setTeacher] = useState(0);

    const handleClickOpenWish = teacher => {
        setTeacher(teacher);
        showTeacherWish(teacher.id);
        setOpenWish(true);
    };

    const handleCloseWish = value => {
        setOpenWish(false);
    };

    const visibleItems = disabled
        ? search(disabledTeachers, term, ['name', 'surname', 'patronymic'])
        : search(teachers, term, ['name', 'surname', 'patronymic']);

    const SearchChange = term => {
        setTerm(term);
    };

    const showDisabledHandle = () => {
        setDisabled(!disabled);
    };

    const handleToUpperCase = str => {
        return str.charAt(0).toUpperCase() + str.slice(1);
    };

    return (
        <div className="cards-container">
            <ConfirmDialog
                cardId={teacherCardId}
                whatDelete={cardType.TEACHER}
                open={open}
                isHide={hideDialog}
                onClose={handleClose}
            />

            <WishModal
                openWish={openWish}
                onCloseWish={handleCloseWish}
                teacher={teacher}
                teacherWishes={props.teacherWishes}
                classScheduler={props.classScheduler}
            />

            <aside className="form-with-search-panel">
                <SearchPanel
                    SearchChange={SearchChange}
                    showDisabled={showDisabledHandle}
                />
                {disabled ? (
                    ''
                ) : (
                    <AddTeacherForm
                        teachers={teachers}
                        onSubmit={teacherSubmit}
                        onSetSelectedCard={selectTeacherCard}
                    />
                )}
            </aside>

            <section className="container-flex-wrap">
                {visibleItems.length === 0 && (
                    <NotFound name={t('formElements:teacher_a_label')} />
                )}
                {teacherLength > 0 ? (
                    visibleItems.map((teacher, index) => (
                        <Card
                            key={index}
                            {...teacher}
                            class="teacher-card done-card"
                        >
                            <div className="cards-btns">
                                {!disabled ? (
                                    <>
                                        <GiSightDisabled
                                            className="svg-btn copy-btn"
                                            title={t('common:set_disabled')}
                                            onClick={() => {
                                                setHideDialog(
                                                    disabledCard.HIDE
                                                );
                                                handleClickOpen(teacher.id);
                                            }}
                                        />
                                        <FaEdit
                                            className="svg-btn edit-btn"
                                            title={t('common:edit_hover_title')}
                                            onClick={() =>
                                                selectTeacherCard(teacher.id)
                                            }
                                        />
                                    </>
                                ) : (
                                    <IoMdEye
                                        className="svg-btn copy-btn"
                                        title={t('common:set_enabled')}
                                        onClick={() => {
                                            setHideDialog(disabledCard.SHOW);
                                            handleClickOpen(teacher.id);
                                        }}
                                    />
                                )}
                                <MdDelete
                                    className="svg-btn delete-btn"
                                    title={t('common:delete_hover_title')}
                                    onClick={() => handleClickOpen(teacher.id)}
                                />
                            </div>

                            <p className="teacher-subtitle">
                                {t('teacher_card_fullName')}
                            </p>
                            <h2 className="teacher-card-name">
                                {handleToUpperCase(teacher.surname)}{' '}
                                {handleToUpperCase(teacher.name)}{' '}
                                {handleToUpperCase(teacher.patronymic)}
                            </h2>
                            <p className="teacher-subtitle">
                                {t('teacher_card_position')}
                            </p>
                            <p className="teacher-card-title">
                                {teacher.position}
                            </p>
                            <div className="teacher-wish-block">
                                <Button
                                    className="wish-button"
                                    variant="contained"
                                    color="primary"
                                    onClick={() => {
                                        handleClickOpenWish(teacher);
                                    }}
                                >
                                    {t('teacher_card_wish')}
                                </Button>
                            </div>
                        </Card>
                    ))
                ) : (
                    <h2>{t('teacher_card_no_cards')}</h2>
                )}
            </section>
        </div>
    );
};
const mapStateToProps = state => ({
    teachers: state.teachers.teachers,
    disabledTeachers: state.teachers.disabledTeachers,
    classScheduler: state.classActions.classScheduler,
    teacherWishes: state.teachersWish.wishes
});

export default connect(mapStateToProps, {})(TeacherList);