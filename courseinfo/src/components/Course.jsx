import Header from "./Header";
import Content from "./Content";

const Course = ({ course }) => {
  const total = course.parts.reduce(
    (points, parts) => points + parts.exercises,
    0
  );
  return (
    <>
      <Header title={course.name} />
      <Content parts={course.parts} />
      <h3>total of {total} exercises</h3>
    </>
  );
};

export default Course;
