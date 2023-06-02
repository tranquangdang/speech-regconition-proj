import { useNavigate } from 'react-router-dom';
import { ReactComponent as ArrowForwardIcon } from '../../assets/arrow-forward-outline.svg';
import { SUPPORTED_LANGUAGE_OPTIONS } from '../../const';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { setConsentProp } from '../../redux/slices/consentSlice';
import { capitalizeFirstLetter, generateID } from '../../utils/utils';
import DropdownList, { IOption } from '../../utils/DropdownList';

interface IError {
  name: string;
  language: string;
}

const RegisterForm: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const consent = useAppSelector((state) => state.consentStore.consent);
  const [error, setError] = useState<IError>({
    name: '',
    language: '',
  });

  useEffect(() => {
    if (!consent.id) {
      dispatch(setConsentProp({ ...consent, id: generateID() }));
    }
  }, [consent, dispatch]);

  const handleSubmit = (event: React.MouseEvent) => {
    event.preventDefault();

    const validate = () => {
      let field: IError = {
        name: '',
        language: '',
      };
      field.name = consent.name ? '' : 'Field is required';
      field.language = consent.language ? '' : 'Field is required';

      setError({ ...field });
      return Object.values(field).every((error) => error === '');
    };

    if (!validate()) {
      return;
    }

    navigate('/agreement-page');
  };

  return (
    <div>
      <div className="flex flex-col mb-3">
        <label className="font-medium m-2" htmlFor="username">
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          placeholder="Enter your name"
          defaultValue={consent.name ?? ''}
          className={`border-2 py-1 px-3 focus:border-grey-dark focus:outline-none ${
            error.name ? 'border-[crimson]' : 'border-grey-medium '
          }`}
          onFocus={() => setError({ ...error, name: '' })}
          onChange={(e) =>
            dispatch(setConsentProp({ ...consent, name: e.target.value }))
          }
        />
        {error.name && (
          <label
            className="font-medium text-[crimson] ml-2 mt-1"
            htmlFor="language"
          >
            {error.name}
          </label>
        )}
      </div>
      <div className="flex flex-col mb-7">
        <label className="font-medium m-2" htmlFor="language">
          Language
        </label>
        <DropdownList
          defaultValue={
            consent.language
              ? {
                  label: capitalizeFirstLetter(consent.language),
                  value: consent.language,
                }
              : null
          }
          className={`${
            error.language ? 'border-[crimson]' : 'border-grey-medium '
          }`}
          options={SUPPORTED_LANGUAGE_OPTIONS}
          onSelect={(option: IOption) => {
            setError({ ...error, language: '' });
            dispatch(setConsentProp({ ...consent, language: option.value }));
          }}
        />
        {error.language && (
          <label
            className="font-medium text-[crimson] ml-2 mt-1"
            htmlFor="language"
          >
            {error.language}
          </label>
        )}
      </div>
      <button
        onClick={handleSubmit}
        className="flex justify-center items-center bg-grey-light text-grey-dark py-2 px-5 float-right"
      >
        Next
        <ArrowForwardIcon className="ml-5" />
      </button>
    </div>
  );
};

export default RegisterForm;
