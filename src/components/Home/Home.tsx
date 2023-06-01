import { Outlet } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <div className="w-2/3 sm:w-2/5 m-auto mt-16">
      <h2 className="text-center pb-4 font-bold">Consent Form</h2>
      <Outlet />
    </div>
  );
};

export default Home;
