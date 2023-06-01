import { useNavigate } from 'react-router-dom';
import { ReactComponent as ArrowForwardIcon } from '../../assets/arrow-forward-outline.svg';
import { SUPPORTED_LANGUAGE_OPTIONS } from '../../const';
import { FormEvent, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { setConsentProp } from '../../redux/slices/consentSlice';
import { generateID } from '../../utils/utils';
import DropdownList, { IOption } from '../../utils/DropdownList';

interface IError {
  name: string;
  language: string;
}

const RegisterForm: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { consentStore } = useAppSelector((state) => state);
  const [language, setLanguage] = useState<IOption | null>(null);
  const [error, setError] = useState<IError>({
    name: '',
    language: '',
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = data.get('name')?.toString();

    const validate = () => {
      let field: IError = {
        name: '',
        language: '',
      };
      field.name = name ? '' : 'Field is required';
      field.language = language ? '' : 'Field is required';

      setError({ ...field });
      return Object.values(field).every((error) => error === '');
    };

    if (!validate()) {
      return;
    }

    if (name && language) {
      dispatch(
        setConsentProp({
          ...consentStore.consent,
          id: generateID(),
          name,
          language: language.value,
        })
      );
      navigate('/agreement-page');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex flex-col mb-3">
        <label className="font-medium m-2" htmlFor="username">
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          placeholder="Enter your name"
          className={`border-2 py-1 px-3 focus:border-grey-dark focus:outline-none ${
            error.name ? 'border-[crimson]' : 'border-grey-medium '
          }`}
          onFocus={() => setError({ ...error, name: '' })}
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
          className={`${
            error.language ? 'border-[crimson]' : 'border-grey-medium '
          }`}
          options={SUPPORTED_LANGUAGE_OPTIONS}
          onSelect={(option: IOption) => {
            setError({ ...error, language: '' });
            setLanguage(option);
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
        type="submit"
        className="flex justify-center items-center bg-grey-light text-grey-dark py-2 px-5 float-right"
      >
        Next
        <ArrowForwardIcon className="ml-5" />
      </button>
    </form>
  );
};

export default RegisterForm;
