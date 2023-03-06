export const Exam = ({ examInformation }) => {
	console.log(examInformation);
	console.log(typeof examInformation.startTime);

	return (
		<div>
			<div>{examInformation.title}</div>
			<div>{examInformation.startTime}</div>
			<div>{examInformation.endTime}</div>
		</div>
	);
};
