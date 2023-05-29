import { useEffect, useState } from 'react';

// This component renders the exam application.
function Exam() {
	// Declare state variables for the exam.
	const [examTitle, setExamTitle] = useState(''); // Exam title
	const [currentTime, setCurrentTime] = useState(new Date()); // Current time
	const [startDate, setStartDate] = useState(new Date()); // Exam start date/time
	const [endTime, setEndTime] = useState(new Date()); // Exam end date/time
	const [countdown, setCountdown] = useState(''); // Time remaining until exam end
	const [examOver, setExamOver] = useState(false); // Flag to indicate if exam is over
	const [formSubmitted, setFormSubmitted] = useState(
		localStorage.getItem('formSubmitted') || false
	); // Flag to indicate if exam form has been submitted or not.

	// This useEffect is responsible for updating the countdown display every second
	// It takes the difference between the current time and the start time of the exam or end time of the exam, depending on which one is later.
	// If the exam is not over, it formats the remaining time into hours, minutes and seconds and sets the countdown state to display it.
	// If the remaining time is less than an hour, it only displays minutes and seconds.

	useEffect(() => {
		// Set up an interval to update the countdown every second
		const interval = setInterval(() => {
			// Update the current time state to the current time
			setCurrentTime(new Date());
			// Calculate the difference between the current time and the start or end time of the exam
			let diffMs = currentTime < startDate ? startDate.getTime() - currentTime.getTime() : endTime.getTime() - currentTime.getTime();
			// If the remaining time is less than or equal to zero, the exam is over
			if (diffMs <= 0) {
				setExamOver(true);
				clearInterval(interval); // Clear the interval to stop updating the countdown
			}
			// Format the remaining time into hours, minutes and seconds
			const hours = Math.floor(diffMs / (1000 * 60 * 60)).toString().padStart(2, '0');
			const minutes = Math.floor((diffMs / (1000 * 60)) % 60).toString().padStart(2, '0');
			const seconds = Math.floor((diffMs / 1000) % 60).toString().padStart(2, '0');
			// Set the countdown state to display the remaining time
			setCountdown(hours > 0 ? `${hours}hr ${minutes}m ${seconds}s` : `${minutes}m ${seconds}s`);
		}, 1000); // Update the countdown every second
		// Clean up the interval on unmount
		return () => clearInterval(interval);
	}, [currentTime, startDate, endTime]); // Re-run the effect when the current time, start time or end time change

	// This useEffect is triggered when the value of `formSubmitted` changes.
	// It stores the value of `formSubmitted` in the browser's local storage
	// so that the value persists even after the user closes the tab or refreshes the page.
	useEffect(() => {
		localStorage.setItem('formSubmitted', formSubmitted);
	}, [formSubmitted]);

	// Listen for keydown events
	useEffect(() => {
		// Define a function to handle the keydown event
		const handleKeyDown = (event) => {
			// If the Escape key is pressed
			if (event.key === 'Escape') {
				// Ask the user if they want to end the exam early
				if (window.confirm('Are you sure you want to end the exam early?')) {
					// If the user confirms, remove exam data from localStorage and set formSubmitted to false
					localStorage.removeItem('examTitle');
					localStorage.removeItem('startDate');
					localStorage.removeItem('endTime');
					setFormSubmitted(false);
				}
			}
		};
		// Add the keydown event listener
		window.addEventListener('keydown', handleKeyDown);
		// Remove the keydown event listener on cleanup
		return () => window.removeEventListener('keydown', handleKeyDown);
	}, []);

	// Function to handle starting a new exam
	function handleNewExam() {
		// Remove exam data from local storage
		localStorage.removeItem('examTitle');
		localStorage.removeItem('startDate');
		localStorage.removeItem('endTime');
		// Set formSubmitted state to false to render the exam setup form
		setFormSubmitted(false);
	}

	const handleSubmit = (event) => {
		event.preventDefault(); // Prevents the default form submit behavior of refreshing the page
		const date = event.target.date.value; // Retrieves the exam date from the form
		const startTime = event.target.startTime.value; // Retrieves the exam start time from the form
		const endTime = event.target.endTime.value; // Retrieves the exam end time from the form
		const [year, month, day] = date.split('-'); // Splits the date string into year, month and day components
		const [startHours, startMinutes] = startTime.split(':'); // Splits the start time string into hour and minute components
		const [endHours, endMinutes] = endTime.split(':'); // Splits the end time string into hour and minute components
		const newStartDate = new Date( // Creates a new date object for the start date and time of the exam
			year,
			month - 1, // Month is zero-indexed, so subtract 1 from the provided month value
			day,
			startHours,
			startMinutes
		);
		const newEndTime = new Date(year, month - 1, day, endHours, endMinutes); // Creates a new date object for the end date and time of the exam
		setStartDate(newStartDate); // Updates the exam start date and time state
		setEndTime(newEndTime); // Updates the exam end date and time state
		setExamOver(false); // Resets the exam over state to false
		setFormSubmitted(true); // Updates the form submitted state to true
		localStorage.setItem('examTitle', examTitle); // Stores the exam title in local storage
		localStorage.setItem('startDate', newStartDate); // Stores the exam start date and time in local storage
		localStorage.setItem('endTime', newEndTime); // Stores the exam end date and time in local storage
		event.target.reset(); // Resets the form input fields
	};

	return (
		<div>
			{!formSubmitted && (
				// Render exam setup form if form is not yet submitted
				<section className='w-full mx-auto my-10 md:w-3/5'>
					<form
						onSubmit={handleSubmit}
						className='container flex flex-col justify-around mx-auto bg-white shadow-2xl rounded-2xl'
					>
						<h1 className='mx-auto my-10 text-5xl font-bold text-center'>
							<legend>Exam Setup</legend>
						</h1>
						{/* Input for exam title */}
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
						{/* Input for exam date */}
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
						{/* Input for exam start time */}
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
						{/* Input for exam end time */}
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
						{/* Button to start exam */}
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
				// Render exam countdown if form is submitted
				<section className='container flex flex-col items-center justify-between w-full mx-auto my-10 md:w-3/5'>
					{/* Display current time */}
					<p className='p-5 mx-4 my-6 text-center border shadow-md text-8xl'>
						{currentTime.toLocaleTimeString()}
					</p>
					<h1 className='my-10 text-6xl text-center'>{examTitle}</h1>
					{/* Conditional styling - countdown to start or end time */}
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
							{/* Display exam over message */}
							<p className='text-6xl text-center'>The exam has ended.</p>
							{/* Button to start new exam */}
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
