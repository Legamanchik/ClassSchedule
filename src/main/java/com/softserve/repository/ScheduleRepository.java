package com.softserve.repository;

import com.softserve.entity.Schedule;
import com.softserve.entity.enums.EvenOdd;

import java.time.DayOfWeek;

public interface ScheduleRepository extends BasicRepository<Schedule, Long> {
   Long conflictInSchedule(Long semesterId, DayOfWeek dayOfWeek, EvenOdd evenOdd, Long classId);
}