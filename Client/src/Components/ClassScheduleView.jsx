import React, { useState, useEffect } from 'react';
import { getCompleteTT } from '../Slices/Timetable';

const Card = ({ children, className = '' }) => <div className={`bg-white p-6 rounded-xl shadow-sm ${className}`}>{children}</div>;

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

const ClassScheduleView = ({ data }) => {
    const [filteredSchedule, setFilteredSchedule] = useState([]);
    const [timeSlots, setTimeSlots] = useState([]);
    const normalize = str => str?.trim().toLowerCase();

    useEffect(() => {
        const fetchSchedule = async () => {
            try {
                const res = await getCompleteTT();
                const rawData = res.data;

                const [department, classLabel] = data;
                const targetYear = `${classLabel.split(" ")[0]} ${department} ${classLabel.split(" ")[1]} `;
                console.log(targetYear); 

                const filtered = rawData.filter(item =>
                    normalize(item.year)?.includes(normalize(classLabel)) &&
                    normalize(item.year)?.includes(normalize(department))
                );

                setFilteredSchedule(filtered);

                const slotSet = new Set();
                filtered.forEach(item => {
                    const time = normalize(item.timeSlot?.label);
                    if (time) slotSet.add(time);
                });

                const sortedSlots = Array.from(slotSet).sort();
                setTimeSlots(sortedSlots);
            } catch (err) {
                console.error(err);
            }
        };

        fetchSchedule();
    }, [data]);

    return (
        <Card className="w-full">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr>
                            <th className="p-3 text-sm font-semibold text-gray-500 bg-gray-50 border border-gray-200 rounded-tl-lg">Time</th>
                            {days.map(day => (
                                <th key={day} className="p-3 text-sm font-semibold text-gray-500 bg-gray-50 border border-gray-200">{day}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {timeSlots.map(time => (
                            <tr key={time}>
                                <td className="p-3 font-mono text-xs text-gray-600 bg-gray-50 border border-gray-200">{time}</td>
                                {days.map(day => (
                                    <td key={`${day}-${time}`} className="p-0 border border-gray-200 align-top">
                                        {/* Render lecture info here if available */}
                                        <div className="p-3 h-full" />
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Card>
    );
};

export default ClassScheduleView;
