import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import Button from '@material-ui/core/Button';
import { styled } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import renderTextField from '../../share/renderedFields/input';
import renderSelectField from '../../share/renderedFields/select';

import { ROOM_FORM } from '../../constants/reduxForms';

import { required, uniqueRoomName } from '../../validation/validateFields';
import Card from '../../share/Card/Card';

import './AddRoomForm.scss';
import { getClearOrCancelTitle, setDisableButton } from '../../helper/disableComponent';
import {
    EDIT_TITLE,
    CREATE_TITLE,
    SAVE_BUTTON_LABEL,
    ROOM_Y_LABEL,
    NUMBER_LABEL,
    ROOM_LABEL,
    TYPE_LABEL,
} from '../../constants/translationLabels';

let AddRoom = (props) => {
    const { t } = useTranslation('formElements');
    const { handleSubmit, pristine, submitting, onReset, oneRoom } = props;

    useEffect(() => {
        if (props.oneRoom) {
            if (props.oneRoom.id) {
                props.initialize({
                    name: props.oneRoom.name,
                    type: props.oneRoom.type.id,
                    id: props.oneRoom.id,
                });
            } else {
                props.initialize();
            }
        }
    }, [props.oneRoom]);

    return (
        <Card class="form-card room-form">
            <form className="createGroupForm w-100" onSubmit={handleSubmit}>
                <h2 className="form-title">
                    {props.oneRoom.id ? t(EDIT_TITLE) : t(CREATE_TITLE)} {t(ROOM_Y_LABEL)}
                </h2>
                <Field
                    type="text"
                    name="name"
                    component={renderTextField}
                    placeholder={t(NUMBER_LABEL)}
                    className="form-field"
                    label={t(ROOM_LABEL)}
                    validate={[required, uniqueRoomName]}
                />
                <Field
                    className="form-field"
                    component={renderSelectField}
                    name="type"
                    label={t(TYPE_LABEL)}
                    validate={[required]}
                >
                    <option value=""></option>
                    {props.roomTypes.map((roomType) => (
                        <option key={roomType.id} value={roomType.id}>
                            {roomType.description}
                        </option>
                    ))}
                </Field>
                <div className="form-buttons-container">
                    <Button
                        className="buttons-style"
                        variant="contained"
                        color="primary"
                        disabled={pristine || submitting}
                        type="submit"
                    >
                        {t(SAVE_BUTTON_LABEL)}
                    </Button>
                    <Button
                        className="buttons-style"
                        variant="contained"
                        disabled={setDisableButton(pristine, submitting, oneRoom.id)}
                        onClick={onReset}
                    >
                        {getClearOrCancelTitle(oneRoom.id, t)}
                    </Button>
                </div>
            </form>
        </Card>
    );
};

const mapStateToProps = (state) => ({
    oneRoom: state.rooms.oneRoom,
    roomTypes: state.roomTypes.roomTypes,
});

AddRoom = reduxForm({
    form: ROOM_FORM,
})(AddRoom);

export default connect(mapStateToProps)(AddRoom);
