import React, { useState } from 'react';
import { useNavigate } from 'react-router';

export const Setup = ({ setExamInformation }) => {
	const [examTitle, setExamTitle] = useState('');
	const [date, setDate] = useState(new Date());
	const [startTime, setStartTime] = useState('');
	const [endTime, setEndTime] = useState('');
	const navigate = useNavigate();

	// handleSubmit function to handle form submission
	const handleSubmit = async (e) => {
		e.preventDefault();
		setExamInformation({
			title: examTitle,
			date: date,
			startTime: startTime,
			endTime: endTime,
		});

		navigate('/exam');
	};

	return (
		<section className='w-full mx-auto my-10 md:w-3/5'>
			<form
				onSubmit={handleSubmit}
				className='container flex flex-col justify-around mx-auto bg-white shadow-xl rounded-2xl'
			>
				<h1 className='mx-auto my-10 text-5xl font-bold text-center'>
					<legend>Exam Setup</legend>
				</h1>
				<div className='flex flex-row items-center justify-around my-2'>
					<label className='w-1/5 mx-2 text-xl font-bold ' htmlFor='exam'>
						Exam Title:
					</label>
					<input
						id='exam'
						className='w-4/5 max-w-2xl mr-2 input input-ghost'
						type='text'
						placeholder='Enter exam title'
						value={examTitle}
						onChange={(e) => setExamTitle(e.target.value)}
					/>
				</div>
				<div className='flex flex-row items-center justify-around my-2'>
					<label className='w-1/5 mx-2 text-xl font-bold' htmlFor='date'>
						Exam Date:
					</label>
					<input
						type='date'
						id='date'
						className='w-4/5 max-w-2xl mr-2 input input-ghost'
						selected={date}
						onChange={(date) => setDate(date)}
					/>
				</div>

				<div className='flex flex-row items-center justify-around my-2'>
					<label className='w-1/5 mx-2 text-xl font-bold' htmlFor='start'>
						Start Time:
					</label>
					<input
						id='start'
						className='w-4/5 max-w-2xl mr-2 input input-ghost '
						type='time'
						placeholder='Exam Start Time'
						value={startTime}
						onChange={(e) => setStartTime(e.target.value)}
					/>
				</div>
				<div className='flex flex-row items-center justify-around my-2'>
					<label className='w-1/5 mx-2 text-xl font-bold' htmlFor='end'>
						End Time:
					</label>
					<input
						className='w-4/5 max-w-2xl mr-2 input input-ghost '
						type='time'
						id='end'
						placeholder='Exam End Time'
						value={endTime}
						onChange={(e) => setEndTime(e.target.value)}
					/>
				</div>

				<button
					type='submit'
					className='mx-auto my-10 btn btn-primary md:btn-wide'
				>
					Start Exam
				</button>
			</form>
		</section>
	);
};
