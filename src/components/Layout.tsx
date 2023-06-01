import { Outlet } from 'react-router-dom';
import MenuBar from './MenuBar';

const Layout: React.FC = () => {
  return (
    <div className="pb-16">
      <MenuBar />
      <Outlet />
    </div>
  );
};

export default Layout;
