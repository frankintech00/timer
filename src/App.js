import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Exam } from './pages/Exam';
import { Setup } from './pages/Setup';

export const App = () => {
	const [examInformation, setExamInformation] = useState({});

	return (
		<Router>
			<Routes>
				<Route
					path='/'
					element={<Setup setExamInformation={setExamInformation} />}
				/>
				<Route
					path='/exam'
					element={<Exam examInformation={examInformation} />}
				/>
			</Routes>
		</Router>
	);
};
