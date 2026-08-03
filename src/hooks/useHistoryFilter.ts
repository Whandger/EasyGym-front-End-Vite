import { useState, useCallback } from 'react';
import type { TrainingRecord } from '../types';

export function useHistoryFilter(records: TrainingRecord[]) {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [filteredRecords, setFilteredRecords] = useState<TrainingRecord[]>(records);

  const parseDate = (dateStr: string): Date | null => {
    const parts = dateStr.split('/');
    if (parts.length === 3) {
      const [day, month, year] = parts.map(Number);
      if (day && month && year) {
        return new Date(year, month - 1, day);
      }
    }
    return null;
  };

  const applyFilter = useCallback(() => {
    if (!startDate && !endDate) {
      setFilteredRecords(records);
      return;
    }

    const filtered = records.filter(record => {
      const recordDate = parseDate(record.data);
      if (!recordDate) return false;

      const start = startDate ? parseDate(startDate) : null;
      const end = endDate ? parseDate(endDate) : null;

      if (start && recordDate < start) return false;
      if (end) {
        const endOfDay = new Date(end);
        endOfDay.setHours(23, 59, 59, 999);
        if (recordDate > endOfDay) return false;
      }
      return true;
    });

    setFilteredRecords(filtered);
  }, [records, startDate, endDate]);

  const clearFilter = useCallback(() => {
    setStartDate('');
    setEndDate('');
    setFilteredRecords(records);
  }, [records]);

  return {
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    filteredRecords,
    applyFilter,
    clearFilter,
  };
}