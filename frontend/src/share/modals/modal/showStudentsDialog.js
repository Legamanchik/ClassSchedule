import React, { useEffect } from 'react';

import PropTypes from 'prop-types';

import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';

import '../dialog.scss';
import './showDataDialog.scss'

import i18n from '../../../helper/i18n';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import RenderTeacherTable from '../../../helper/renderTeacherTable';
import RenderStudentTable from '../../../helper/renderStudentTable';
import { getAllStudentsByGroupId } from '../../../services/studentService';
import { reduxForm } from 'redux-form';
import { GROUP_FORM } from '../../../constants/reduxForms';
import CircularProgress from '@material-ui/core/CircularProgress';
import { ShowDataDialog } from './showDataDialog';

export const ShowStudentsDialog = props => {
    const { onClose,  cardId, open,onDeleteStudent,students,onSubmit} = props;
    const { t } = useTranslation('formElements');
    const handleClose = () => {
        onClose(cardId);
    };
    useEffect(()=> {
            getAllStudentsByGroupId(props.group.id);


    },[open])
    return (
        <Dialog
            disableBackdropClick={true}
            onClose={handleClose}
            aria-labelledby="confirm-dialog-title"
            open={open}
        >
            <DialogTitle id="confirm-dialog-title">
                <>
                        <>
                            {students.length === 0 ?
                                <>
                                    <h2 className="title-align">{`${t('group_label')} - `}<span>{`${props.group.title}`}</span>
                                    </h2>
                                    {t('no_exist_students_in_group')}
                                </>

                                :
                                <span className="table-student-data">
                                <h3 className="title-align"><span>{students.length !== 1 ? `${t('students_label')} ` : `${t('student_label')} `}</span>{`${t('group_students')} `}<span>{`${props.group.title}`}</span></h3>
                                <RenderStudentTable group={props.group} onDeleteStudent={onDeleteStudent}
                                                    students={students} onSubmit={onSubmit} />
                            </span>
                            }
                        </>
                </>
            </DialogTitle>
            <div className="buttons-container">
                <Button
                    className="dialog-button"
                    variant="contained"
                    onClick={() => onClose('')}
                    color="primary"
                >
                    {i18n.t('common:close_title')}
                </Button>
            </div>
        </Dialog>
    );
};

ShowStudentsDialog.propTypes = {
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired
};
const mapStateToProps = state => ({
    group:{id:29}
});

export default connect(mapStateToProps, {})(ShowStudentsDialog);

