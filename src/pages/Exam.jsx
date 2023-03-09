import { useEffect, useState } from 'react';

function Exam() {
	const [examTitle, setExamTitle] = useState('');
	const [currentTime, setCurrentTime] = useState(new Date());
	const [startDate, setStartDate] = useState(new Date());
	const [endTime, setEndTime] = useState(new Date());
	const [countdown, setCountdown] = useState('');
	const [examOver, setExamOver] = useState(false);
	const [formSubmitted, setFormSubmitted] = useState(
		localStorage.getItem('formSubmitted') || false
	);

	useEffect(() => {
		const interval = setInterval(() => {
			setCurrentTime(new Date());
			let diffMs;
			if (currentTime < startDate) {
				diffMs = startDate.getTime() - currentTime.getTime();
			} else {
				diffMs = endTime.getTime() - currentTime.getTime();
				if (diffMs <= 0) {
					setExamOver(true);
					clearInterval(interval);
				}
			}
			const hours = Math.floor(diffMs / (1000 * 60 * 60))
				.toString()
				.padStart(2, '0');
			const minutes = Math.floor((diffMs / (1000 * 60)) % 60)
				.toString()
				.padStart(2, '0');
			const seconds = Math.floor((diffMs / 1000) % 60)
				.toString()
				.padStart(2, '0');

			if (hours > 0) {
				setCountdown(`${hours}hr ${minutes}m ${seconds}s`);
			} else {
				setCountdown(`${minutes}m ${seconds}s`);
			}
		}, 1000);
		return () => clearInterval(interval);
	}, [currentTime, startDate, endTime]);

	useEffect(() => {
		localStorage.setItem('formSubmitted', formSubmitted);
	}, [formSubmitted]);

	useEffect(() => {
		const handleKeyDown = (event) => {
			if (event.key === 'Escape') {
				if (
					window.confirm(
						'Are you sure you want to end the exam early? This will clear all exam data.'
					)
				) {
					localStorage.removeItem('examTitle');
					localStorage.removeItem('startDate');
					localStorage.removeItem('endTime');
					setFormSubmitted(false);
				}
			}
		};
		window.addEventListener('keydown', handleKeyDown);
		return () => window.removeEventListener('keydown', handleKeyDown);
	}, []);

	function handleNewExam() {
		localStorage.removeItem('examTitle');
		localStorage.removeItem('startDate');
		localStorage.removeItem('endTime');
		setFormSubmitted(false);
	}

	const handleSubmit = (event) => {
		event.preventDefault();
		const date = event.target.date.value;
		const startTime = event.target.startTime.value;
		const endTime = event.target.endTime.value;
		const [year, month, day] = date.split('-');
		const [startHours, startMinutes] = startTime.split(':');
		const [endHours, endMinutes] = endTime.split(':');
		const newStartDate = new Date(
			year,
			month - 1,
			day,
			startHours,
			startMinutes
		);
		const newEndTime = new Date(year, month - 1, day, endHours, endMinutes);
		setStartDate(newStartDate);
		setEndTime(newEndTime);
		setExamOver(false);
		setFormSubmitted(true);
		localStorage.setItem('examTitle', examTitle);
		localStorage.setItem('startDate', newStartDate);
		localStorage.setItem('endTime', newEndTime);
		event.target.reset();
	};

	return (
		<div>
			{!formSubmitted && (
				<section className='w-full mx-auto my-10 md:w-3/5'>
					<form
						onSubmit={handleSubmit}
						className='container flex flex-col justify-around mx-auto bg-white shadow-2xl rounded-2xl'
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
								placeholder='Exam Date'
								type='date'
								name='date'
								className='w-4/5 max-w-2xl mr-2 input input-ghost'
								required
							/>
						</div>

						<div className='flex flex-row items-center justify-around my-2'>
							<label className='w-1/5 mx-2 text-xl font-bold' htmlFor='start'>
								Start Time:
							</label>
							<input
								name='startTime'
								className='w-4/5 max-w-2xl mr-2 input input-ghost '
								type='time'
								placeholder='Exam Start Time'
								required
							/>
						</div>
						<div className='flex flex-row items-center justify-around my-2'>
							<label className='w-1/5 mx-2 text-xl font-bold' htmlFor='end'>
								End Time:
							</label>
							<input
								className='w-4/5 max-w-2xl mr-2 input input-ghost '
								type='time'
								name='endTime'
								placeholder='Exam End Time'
								required
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
			)}
			{formSubmitted && (
				<section className='container flex flex-col items-center justify-between w-full mx-auto my-10 md:w-3/5'>
					<p className='p-5 my-6 text-center border shadow-md text-8xl'>
						{currentTime.toLocaleTimeString()}
					</p>
					<h1 className='my-10 text-6xl text-center'>{examTitle}</h1>

					{countdown && !examOver && (
						<div className='p-5 text-6xl text-center '>
							{currentTime < startDate
								? 'Time until exam starts:'
								: 'Time remaining:'}

							<p className='p-5 my-6 border shadow-md'>{countdown}</p>
						</div>
					)}
					{examOver && (
						<div className='flex flex-col'>
							<p className='text-6xl text-center'>The exam has ended.</p>
							<button
								onClick={handleNewExam}
								className='mx-auto my-10 text-center btn btn-primary md:btn-wide'
							>
								New Exam
							</button>
						</div>
					)}
				</section>
			)}
		</div>
	);
}

export default Exam;
