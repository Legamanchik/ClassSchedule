import React, { useState, useEffect } from 'react';
import Table from '@material-ui/core/Table';
import TableContainer from '@material-ui/core/TableContainer';
import './StudentTable.scss';

import { TableFooterComponent } from '../Table/TableFooter';
import { StudentsTableBody } from './StudentsTableBody';
import { StudentsTableHead } from './StudentsTableHead';

export const StudentsTable = (props) => {
    const {
        students,
        setCheckBoxStudents,
        updateStudentSuccess,
        checkAllStudentsSuccess,
        setIsDisabledBtnMoveStudent,
        ...rest
    } = props;

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [checkedAll, setCheckedAll] = useState(false);

    const currentStudentsOnList = students.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage,
    );

    const checkedAllOnPageClick = () => {
        checkAllStudentsSuccess(currentStudentsOnList, checkedAll);
    };

    const isCheckedAll = () => {
        setCheckedAll(currentStudentsOnList.every((item) => item.checked));
    };

    const checkStudent = (event) => {
        const { value, checked } = event.target;
        const checkedStudent = students.filter((student) => student.id === Number(value));
        updateStudentSuccess({ ...checkedStudent[0], checked });
        isCheckedAll();
    };

    const checkIsDisabledBtn = () => {
        if (students.find((item) => item.checked === true)) {
            setIsDisabledBtnMoveStudent(false);
        } else {
            setIsDisabledBtnMoveStudent(true);
        }
    };

    useEffect(() => {
        isCheckedAll();
        checkIsDisabledBtn();
    }, [currentStudentsOnList]);

    return (
        <div className="table">
            <TableContainer>
                <Table aria-label="custom pagination table">
                    <StudentsTableHead
                        checkedAll={checkedAll}
                        checkedAllOnPageClick={checkedAllOnPageClick}
                    />
                    <StudentsTableBody
                        page={page}
                        students={students}
                        rowsPerPage={rowsPerPage}
                        checkStudent={checkStudent}
                        setCheckedAll={setCheckedAll}
                        currentStudentsOnList={currentStudentsOnList}
                        {...rest}
                    />
                </Table>
                <div className="table-footer">
                    <TableFooterComponent
                        page={page}
                        items={students}
                        setPage={setPage}
                        rowsPerPage={rowsPerPage}
                        setRowsPerPage={setRowsPerPage}
                    />
                </div>
            </TableContainer>
        </div>
    );
};
