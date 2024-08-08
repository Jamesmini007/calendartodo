import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './App.css';
import moment from 'moment';

function App() {
    const [date, setDate] = useState(new Date());
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [events, setEvents] = useState([]);
    const [value, onChange] = useState(new Date());
    const [time, setTime] = useState('00:00'); // 시간을 관리하는 상태 변수

    useEffect(() => {
        const storedEvents = JSON.parse(localStorage.getItem('events'));
        if (storedEvents) {
            setEvents(storedEvents);
        }
    }, []);

    const openModal = () => {
        setDate(value);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleSaveEvent = (event) => {
        event.preventDefault();
        const newEvent = { date: moment(value).format('YYYY-MM-DD') + ' ' + time, title: event.target.title.value };
        const updatedEvents = [...events, newEvent];
        setEvents(updatedEvents);
        localStorage.setItem('events', JSON.stringify(updatedEvents));
        closeModal();
    };

    const handleDeleteEvent = (index) => {
        const updatedEvents = [...events];
        updatedEvents.splice(index, 1);
        setEvents(updatedEvents);
        localStorage.setItem('events', JSON.stringify(updatedEvents));
    };

    return (
        <div className="App">
            <h1>My Calendar</h1>
            <div>
                <div className="text-gray-500 mt-4">
                    {moment(value).format("YYYY년 MM월 DD일")}
                </div>
            </div>

            <Calendar
                onChange={onChange}
                value={value}
                tileContent={({ date, view }) =>
                    view === 'month' &&
                    events.filter((event) => moment(event.date).format('YYYY-MM-DD') === moment(date).format('YYYY-MM-DD'))
                        .map((event, index) => (
                            <p key={index}>{event.title}</p>
                        ))
                }
                className="custom-calendar"
            />

            <button onClick={openModal}>일정 추가</button>

            {isModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={closeModal}>&times;</span>
                        <h2>일정 추가</h2>
                        <form onSubmit={handleSaveEvent}>
                            <label>
                                새로운 일정:
                                <input type="text" name="title" required />
                            </label>
                            <br />
                            <label>
                                날짜:
                                <input type="text" name="date" value={moment(value).format('YYYY-MM-DD')} readOnly />
                            </label>
                            <br />
                            <label>
                                시간:
                                <input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
                            </label>
                            <br />
                            <button type="submit">저장</button>
                        </form>
                    </div>
                </div>
            )}

            <div>
                <h2>할일 목록</h2>
                <ul>
                    {events.map((event, index) => (
                        <li key={index}>
                            {event.title} ({moment(event.date).format('YYYY-MM-DD HH:mm')})
                            <button onClick={() => handleDeleteEvent(index)}>삭제</button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default App;
