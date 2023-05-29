import { render, screen } from '@testing-library/react';
import Exam from './Exam';

describe('Exam component', () => {
  test('renders exam title', () => {
    const examTitle = 'Math Exam';
    render(<Exam examTitle={examTitle} />);
    const titleElement = screen.getByText(examTitle);
    expect(titleElement).toBeInTheDocument();
  });

  test('renders countdown', () => {
    const startDate = new Date('2022-01-01T09:00:00');
    const endTime = new Date('2022-01-01T12:00:00');
    render(<Exam startDate={startDate} endTime={endTime} />);
    const countdownElement = screen.getByText(/remaining/i);
    expect(countdownElement).toBeInTheDocument();
  });

  test('handles new exam', () => {
    const handleNewExam = jest.fn();
    render(<Exam handleNewExam={handleNewExam} />);
    const newExamButton = screen.getByRole('button', { name: /new exam/i });
    userEvent.click(newExamButton);
    expect(handleNewExam).toHaveBeenCalled();
  });
});