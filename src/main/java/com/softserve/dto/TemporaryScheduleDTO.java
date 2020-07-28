package com.softserve.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.softserve.entity.*;
import com.softserve.entity.enums.LessonType;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;

@Setter
@Getter
@NoArgsConstructor
public class TemporaryScheduleDTO {
    private Long id;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd-MM-yyyy")
    private LocalDate date;

    private String teacherForSite;
    private String subjectForSite;
    private Teacher teacher;
    private LessonType lessonType;
    private Subject subject;
    private List<Group> groups;
    private Room room;
    private Semester semester;
    @JsonProperty("class")
    private PeriodDTO period;
    private boolean grouped;
    private boolean vacation;
}
