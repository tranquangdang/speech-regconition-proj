import { NavLink, useLocation } from 'react-router-dom';

const MenuBar: React.FC = () => {
  const location = useLocation();

  // Check if the current location matches the agreement-page route
  const isAgreementPage = ['/agreement-page', '/finished-page'].includes(
    location.pathname
  );
  return (
    <div className="flex w-full justify-end p-6">
      <NavLink to={'/'} end>
        {({ isActive }) => (
          <h5
            className={`font-normal mr-6 ${
              isActive || isAgreementPage ? 'text-black' : 'text-grey-medium'
            }`}
          >
            Home
          </h5>
        )}
      </NavLink>
      <NavLink to={'/consents-page'}>
        {({ isActive }) => (
          <h5
            className={`font-normal mr-6 ${
              isActive ? 'text-black' : 'text-grey-medium'
            }`}
          >
            Consents
          </h5>
        )}
      </NavLink>
    </div>
  );
};

export default MenuBar;
