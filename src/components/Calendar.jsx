import React, { useState } from 'react';
import '../styles/App.scss';
import './Calendar.scss';

const Calendar = () => {
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const monthsOfYear = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec"
    ];

    const currentDate = new Date();
    const [currentMonth, setCurrentMonth] = useState(currentDate.getMonth());
    const [currentYear, setCurrentYear] = useState(currentDate.getFullYear());
    const [selectedDate, setSelectedDate] = useState(currentDate);
    const [showEventPopup, setShowEventPopup] = useState(false);
    const [events, setEvents] = useState([]);
    const [eventTime, setEventTime] = useState({ hours: '00', minutes: "00" });
    const [eventText, setEventText] = useState('');
    const [editingEvent, setEditingEvent] = useState(null);
    const [showHoursDropdown, setShowHoursDropdown] = useState(false);
    const [showMinutesDropdown, setShowMinutesDropdown] = useState(false);



    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

    const hoursOptions = Array.from({ length: 16 }, (_, i) => (i + 8).toString().padStart(2, '0'));
    const minutesOptions = ['00', '15', '30', '45'];


    const prevMonth = () => {
        setCurrentMonth((prevMonth) => (prevMonth === 0 ? 11 : prevMonth - 1))
        setCurrentYear((prevYear) => (currentMonth === 0 ? prevYear - 1 : prevYear))
    }

    const nextMonth = () => {
        setCurrentMonth((prevMonth) => (prevMonth === 11 ? 0 : prevMonth + 1))
        setCurrentYear((prevYear) => (currentMonth === 11 ? prevYear + 1 : prevYear))
    }

    const handleDayClick = (day) => {
        const clickedDate = new Date(currentYear, currentMonth, day)
        const today = new Date()

        if (clickedDate >= today || isSameDay(clickedDate, today)) {
            setSelectedDate(clickedDate)
            setShowEventPopup(true)
            setTEventTime({ hours: '00', minutes: '00' })
            setEventText("")
            setEditingEvent(null)
        }
    }

    const isSameDay = (date1, date2) => {
        return (
            date1.getFullYear() === date2.getFullYear() &&
            date1.getMonth() === date2.getMonth() &&
            date1.getDate() === date2.getDate()
        )
    }


    const handleEventSubmit = () => {
        const newEvent = {
            id: editingEvent ? editingEvent.id : Date.now(),
            date: selectedDate,
            time: `${eventTime.hours.padStart(2, '0')}:${eventTime.minutes.padStart(2, '0')}`,
            text: eventText,
        }

        let updatedEvents = [...events];
        if (editingEvent) {
            updatedEvents = updatedEvents.map((event) =>
                event.id === editingEvent.id ? newEvent : event
            )
        } else {
            updatedEvents.push(newEvent)
        }

        updatedEvents.sort((a, b) => a.date - b.date)

        setEvents(updatedEvents);
        setTEventTime({ hours: '08', minutes: "00" });
        setEventText('');
        setShowEventPopup(false);
        setEditingEvent(null)
    }

    const handleEditEvent = (event) => {
        setSelectedDate(new Date(event.date))
        setTEventTime({
            hours: event.time.split(":")[0],
            minutes: event.time.split(":")[1],
        })
        setEventText(event.text)
        setEditingEvent(event)
        setShowEventPopup(true)
    }

    const handleDeleteEvent = (eventId) => {
        const updatedEvents = events.filter((event) => event.id !== eventId)

        setEvents(updatedEvents)
    }

    const handleTimeChange = (e) => {
        const { name, value } = e.target;
        setTEventTime((prevTime) => ({ ...prevTime, [name]: value.padStart(2, '0') }))
    }



    return (
        <div className="calendar-app">
            <div className='calendar'>
                <h1 className="heading">Calendar</h1>
                <div className="navigate-date">
                    <h2 className="month">{monthsOfYear[currentMonth]},</h2>
                    <h2 className="year">{currentYear}</h2>
                    <div className="buttons">
                        <i onClick={prevMonth} className="bx bx-chevron-left"></i>
                        <i onClick={nextMonth} className="bx bx-chevron-right"></i>
                    </div>
                </div>
                <div className="weekdays">
                    {daysOfWeek.map((day) => (
                        <span key={day}>{day}</span>
                    ))}
                </div>
                <div className="days">
                    {[...Array(firstDayOfMonth).keys()].map((_, index) => (
                        <span key={`empty-${index}`} />
                    ))}
                    {[...Array(daysInMonth).keys()].map((day) => (
                        <span key={day + 1}
                            className={
                                day + 1 === currentDate.getDate() &&
                                    currentMonth === currentDate.getMonth() &&
                                    currentYear === currentDate.getFullYear()
                                    ? 'current-day'
                                    : ''
                            }
                            onClick={() => handleDayClick(day + 1)}
                        >
                            {day + 1}
                        </span>
                    ))}
                </div>
            </div>
            <div className="events">
                {showEventPopup && (
                    <div className="event-popup">
                        <div className="time-input">
                            <div className="event-popup-time">Time</div>
                            <div className="custom-dropdown">
                                <div
                                    className="dropdown-selected"
                                    onClick={() => setShowHoursDropdown(!showHoursDropdown)}
                                >
                                    {eventTime.hours}
                                    <i className={`bx bx-chevron-${showHoursDropdown ? 'up' : 'down'}`}></i>
                                </div>
                                {showHoursDropdown && (
                                    <ul className="dropdown-options">
                                        {hoursOptions.map((hour) => (
                                            <li
                                                key={hour}
                                                onClick={() => {
                                                    setEventTime((prev) => ({ ...prev, hours: hour }));
                                                    setShowHoursDropdown(false);
                                                }}
                                            >
                                                {hour}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                            <div className="custom-dropdown">
                                <div
                                    className="dropdown-selected"
                                    onClick={() => setShowMinutesDropdown(!showMinutesDropdown)}
                                >
                                    {eventTime.minutes}
                                    <i className={`bx bx-chevron-${showMinutesDropdown ? 'up' : 'down'}`}></i>
                                </div>
                                {showMinutesDropdown && (
                                    <ul className="dropdown-options">
                                        {minutesOptions.map((minute) => (
                                            <li
                                                key={minute}
                                                onClick={() => {
                                                    setEventTime((prev) => ({ ...prev, minutes: minute }));
                                                    setShowMinutesDropdown(false);
                                                }}
                                            >
                                                {minute}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>
                        <textarea
                            placeholder='Enter Event Text (Maximum 60 Characters)'
                            value={eventText}
                            onChange={(e) => {
                                if (e.target.value.length <= 60) {
                                    setEventText(e.target.value)
                                }
                            }}
                        ></textarea>
                        <button
                            className='event-popup-btn'
                            onClick={handleEventSubmit}>
                            {editingEvent ? "Update Event" : "Add Event"}
                        </button>
                        <button
                            className="close-event-popup"
                            onClick={() => setShowEventPopup(false)}>
                            <i className="bx bx-x"></i>
                        </button>
                    </div>
                )}

                {events.map((event, index) => (
                    <div className="event" key={index}>
                        <div className="event-date-wrapper">
                            <div className="event-date">
                                {`${monthsOfYear[event.date.getMonth()]
                                    } ${event.date.getDate()}, ${event.date.getFullYear()}`}
                            </div>
                            <div className="event-time">{event.time}</div>
                        </div>
                        <div className="event-text">{event.text}</div>
                        <div className="event-buttons">
                            <i className="bx bxs-edit-alt" onClick={() => handleEditEvent(event)}></i>
                            <i className="bx bxs-message-alt-x" onClick={() => handleDeleteEvent(event.id)}></i>
                        </div>
                    </div>
                ))}

            </div>
        </div>
    )
}

export default Calendar
