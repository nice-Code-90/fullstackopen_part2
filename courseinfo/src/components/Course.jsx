import Header from "./Header";
import Content from "./Content";

const Total = ({ sum }) => <p>Number of exercises {sum}</p>;



const Course = ({ course }) => {
  return (
    <>
      <Header title={course.name} />
      <Content parts={course.parts} />
    </>
  );
};

export default Course;
