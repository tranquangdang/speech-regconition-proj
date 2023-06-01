import { Link, Navigate } from 'react-router-dom';
import { ReactComponent as FinishedIcon } from '../../assets/finished.svg';
import { useAppSelector } from '../../redux/hooks';

const FinishedPage: React.FC = () => {
  const { consentStore } = useAppSelector((state) => state);

  if (!consentStore.consent.id) {
    return <Navigate to="/" />;
  }

  return (
    <div className="text-center w-3/4 m-auto">
      <button className="bg-grey-light rounded-full p-4 mt-16">
        <FinishedIcon className="fill-grey-dark" />
      </button>
      <p className="font-normal">
        Thank you, your consent has been successfully saved!
      </p>
      <Link to={'/consents-page'}>
        <p className="underline font-bold text-grey-dark mt-10">
          View all consents
        </p>
      </Link>
    </div>
  );
};

export default FinishedPage;
