export const ENGLISH = 'english';
export const FRENCH = 'french';
export const YES = 'yes';
export const NO = 'no';
export const OUI = 'oui';
export const CONSENTS_KEY = 'consents';

export const agreementType: { [key: string]: boolean } = {
  [YES]: true,
  [OUI]: true,
  [NO]: false,
};

export const SUPPORTED_LANGUAGE_OPTIONS = [
  { label: 'English', value: ENGLISH },
  { label: 'French', value: FRENCH },
];
