import React from 'react';
import { isEmpty } from 'lodash';
import Card from '@material-ui/core/Card';
import './TableItem.scss';
import { addClassDayBoard, removeClassDayBoard } from '../../../helper/schedule';
import { GroupTitle } from './GroupTitle';

const TableItem = (props) => {
    const { classes, schedule, index } = props;

    const findItemInArray = (array, equalTo) => {
        return array.find((classItem) => classItem.class_id === equalTo);
    };

    const getColorByFullness = (array = []) => {
        let color = isEmpty(array) ? 'allow' : 'possible';
        let prevTeacherName = array[0]?.teacher_for_site;
        array.forEach((lesson) => {
            if (lesson.teacher_for_site !== prevTeacherName) {
                color = 'not-allow';
            }
            prevTeacherName = lesson.teacher_for_site;
        });
        return color;
    };

    return classes.map((scheduleClass, classIndex) => {
        const classOdd = findItemInArray(schedule.classes[0].odd, scheduleClass.id);
        const classEven = findItemInArray(schedule.classes[0].even, scheduleClass.id);

        return (
            // eslint-disable-next-line jsx-a11y/mouse-events-have-key-events
            <section
                key={`${index}_${classIndex.toString()}`}
                onMouseOver={() => addClassDayBoard(schedule.day, scheduleClass.class_name)}
                onMouseOut={() => removeClassDayBoard(schedule.day, scheduleClass.class_name)}
                className="class-container"
            >
                <div className="class-info-container">
                    <Card
                        className={`card class-info-data ${getColorByFullness(classOdd?.lessons)}`}
                    >
                        <div className="group-list-container">
                            {!classOdd || isEmpty(classOdd.lessons) ? (
                                <> </>
                            ) : (
                                <GroupTitle lessonArray={classOdd.lessons} />
                            )}
                        </div>
                    </Card>
                </div>

                <div className="class-info-container">
                    <Card
                        className={`card class-info-data ${getColorByFullness(classEven?.lessons)}`}
                    >
                        <div className="group-list-container">
                            {!classEven || isEmpty(classEven.lessons) ? (
                                <> </>
                            ) : (
                                <GroupTitle lessonArray={classEven.lessons} />
                            )}
                        </div>
                    </Card>
                </div>
            </section>
        );
    });
};

export default TableItem;
