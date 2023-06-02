import { Link } from 'react-router-dom';
import { ReactComponent as FinishedIcon } from '../../assets/finished.svg';
import { useAppDispatch } from '../../redux/hooks';
import { useEffect } from 'react';
import { initialState, setConsentProp } from '../../redux/slices/consentSlice';

const FinishedPage: React.FC = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setConsentProp(initialState.consent));
  }, [dispatch]);

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
