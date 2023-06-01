import { useState } from 'react';
import { ReactComponent as PlaySharpIcon } from '../../assets/play-sharp.svg';
import { ReactComponent as PauseSharpIcon } from '../../assets/pause-sharp.svg';
import { ReactComponent as CheckIcon } from '../../assets/checkmark-sharp.svg';
import { ReactComponent as CloseIcon } from '../../assets/close-outline.svg';
import { IConsent } from '../../redux/slices/consentSlice';
import { CONSENTS_KEY } from '../../const';
import { base64ToBlob, capitalizeFirstLetter } from '../../utils/utils';

const ConsentsPage: React.FC = () => {
  const [pauseId, setPauseId] = useState<string>('');
  const [consentList] = useState<IConsent[]>(() => {
    let result: IConsent[] = [];
    try {
      const rawConsentList = localStorage.getItem(CONSENTS_KEY);
      if (rawConsentList) {
        result = JSON.parse(rawConsentList) as IConsent[];
      }
    } catch (error) {
      return [];
    }
    return result;
  });

  const playMedia = async (consent: IConsent) => {
    if (consent.record && !pauseId) {
      setPauseId(consent.id);
      const blob = await base64ToBlob(consent.record);
      const mediaUrl = URL.createObjectURL(blob);
      const audioPlayer = new Audio();
      audioPlayer.src = mediaUrl;
      audioPlayer.addEventListener('ended', () => {
        setPauseId('');
      });
      audioPlayer.play();
    }
  };

  return (
    <div>
      <div className="w-3/5 sm:w-2/3 m-auto mt-16">
        <h2 className="text-center pb-4 font-bold">All consents</h2>
        {consentList.length ? (
          <table className="w-full table-auto">
            <thead>
              <tr>
                <th className="text-left py-2 px-3 w-3/5">Details</th>
                <th className="text-right py-2 px-3 w-2/5">Consent</th>
                <th className="text-right py-2 px-3 w-1/4">Given</th>
              </tr>
            </thead>
            <tbody>
              {consentList.map((consent, index) => (
                <tr
                  key={index}
                  className={`${index % 2 === 0 ? 'bg-[#f5f5f5]' : ''}`}
                >
                  <td className="text-left py-2 px-3">
                    <div>
                      <h4 className="text-black">{consent.name}</h4>
                      <span className="text-grey-dark font-normal">
                        {`Language: ${capitalizeFirstLetter(consent.language)}`}
                      </span>
                    </div>
                  </td>
                  <td className="text-right py-2 px-3">
                    <div className="flex justify-end pr-5">
                      {consent.agree ? (
                        <CheckIcon className="text-grey-dark w-6" />
                      ) : (
                        <CloseIcon className="fill-grey-dark w-6" />
                      )}
                    </div>
                  </td>
                  <td className="text-right py-2 px-3">
                    {pauseId === consent.id ? (
                      <button
                        className="bg-grey-medium rounded-full p-4"
                        onClick={() => playMedia(consent)}
                      >
                        <PlaySharpIcon className="fill-grey-dark" />
                      </button>
                    ) : (
                      <button
                        className={`bg-grey-medium rounded-full p-4 ${
                          pauseId && pauseId !== consent.id
                            ? 'cursor-not-allowed'
                            : 'cursor-pointer'
                        }`}
                        onClick={() => playMedia(consent)}
                      >
                        <PauseSharpIcon className="fill-grey-dark" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : null}
      </div>
    </div>
  );
};

export default ConsentsPage;
