export const ENGLISH = 'english';
export const FRENCH = 'french';
export const YES = 'yes';
export const NO = 'no';
export const OUI = 'oui';
export const POLICY = `You understand that by using the site or site services, you agree to be
bound by this agreement. If you do not accept this agreement in its
entirety, you must not access or use the site or the site services.`;
export const POLICY_QUESTION =
  'Do you agree to this agreement? Please respond by saying "Yes" or "No".';

export const agreementType: { [key: string]: boolean } = {
  [YES]: true,
  [OUI]: true,
  [NO]: false,
};

export const SUPPORTED_LANGUAGE_OPTIONS = [
  { label: 'English', value: ENGLISH },
  { label: 'French', value: FRENCH },
];
