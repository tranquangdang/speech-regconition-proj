import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from 'react';
import { Link, Navigate } from 'react-router-dom';
import { ReactComponent as MicIcon } from '../../assets/mic.svg';
import { ReactComponent as ArrowForwardIcon } from '../../assets/arrow-forward-outline.svg';
import { ReactComponent as ReloadSharpIcon } from '../../assets/reload-sharp.svg';
import { ReactComponent as PlaySharpIcon } from '../../assets/play-sharp.svg';
import { ReactComponent as PauseSharpIcon } from '../../assets/pause-sharp.svg';
import { useAppSelector } from '../../redux/hooks';
import { IConsent } from '../../redux/slices/consentSlice';
import {
  CONSENTS_KEY,
  ENGLISH,
  FRENCH,
  NO,
  OUI,
  YES,
  agreementType,
} from '../../const';
import { blobToBase64 } from '../../utils/utils';

const getAgreeFromTranscript = (
  str: string,
  language: string
): string | null => {
  if (language === ENGLISH && [YES, NO].includes(str)) {
    return str;
  } else if (language === FRENCH && [OUI, NO].includes(str)) {
    return str;
  } else {
    return null;
  }
};

const AgreementPage: React.FC = () => {
  const { consentStore } = useAppSelector((state) => state);
  const [recording, setRecording] = useState<boolean>(false);
  const [recognizing, setRecognizing] = useState<string>('');
  const [mediaBlob, setMediaBlob] = useState<Blob | null>(null);
  const [pause, setPause] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>('');
  const [isNotSupported, setNotSupported] = useState<boolean>(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const validAgreement = useMemo(
    () => getAgreeFromTranscript(transcript, consentStore.consent.language),
    [transcript, consentStore.consent.language]
  );

  useEffect(() => {
    let recognition: SpeechRecognition | null = null;

    if (
      !recognitionRef.current &&
      ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)
    ) {
      recognition = new (window.SpeechRecognition ||
        window.webkitSpeechRecognition)();

      if (consentStore.consent.language === FRENCH) {
        recognition.lang = 'fr-FR';
      }
      recognition.continuous = false;
      recognition.interimResults = false;

      const handleRecordSound = () => {
        try {
          navigator.mediaDevices
            .getUserMedia({ audio: true })
            .then((stream) => {
              const options = { mimeType: 'audio/webm' };
              mediaRecorderRef.current = new MediaRecorder(stream, options);
              const chunks: Blob[] = [];

              mediaRecorderRef.current.addEventListener(
                'dataavailable',
                (event) => {
                  chunks.push(event.data);
                }
              );

              mediaRecorderRef.current.addEventListener('stop', () => {
                const combinedChunks = new Blob(chunks, { type: 'audio/webm' });
                setMediaBlob(combinedChunks);
                stream.getTracks().forEach((track) => track.stop());
              });

              mediaRecorderRef.current.start();
            })
            .catch((error) => {
              setNotSupported(true);
              console.error('Error accessing microphone:', error);
            });
        } catch (error) {
          setNotSupported(true);
        }
      };

      recognition.onstart = () => {
        //Limit time to record to 10s
        setTimeout(() => {
          recognitionRef.current?.stop();
        }, 10000);
        handleRecordSound();
        setRecognizing('Recording...');
      };

      recognition.onsoundend = () => {
        setRecognizing('Recognizing...');
      };

      recognition.onresult = (event) => {
        const lastResultIndex = event.results.length - 1;
        const { transcript: result, confidence } =
          event.results[lastResultIndex][0];
        const isFinal = event.results[lastResultIndex].isFinal;

        if (isFinal && confidence > 0.5) {
          setTranscript(result.toLowerCase());
          setRecording(true);
          recognition?.stop();
          mediaRecorderRef.current?.stop();
        }
      };

      recognition.onend = () => {
        mediaRecorderRef.current?.stop();
        setRecognizing('');
      };

      recognition.onerror = () => {
        mediaRecorderRef.current?.stop();
        setRecognizing('');
        alert('Recognize failure :(, Please try again!');
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current = null;
      }
    };
  }, [consentStore.consent.language]);

  const startRecording = useCallback(() => {
    if (
      recognitionRef.current &&
      ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)
    ) {
      if (!recognizing) {
        recognitionRef.current.start();
        setRecording(false);
      }
    } else {
      setNotSupported(true);
    }
  }, [recognizing]);

  const playMedia = useCallback(() => {
    if (mediaBlob && !pause) {
      setPause(true);
      const mediaUrl = URL.createObjectURL(mediaBlob);
      const audioPlayer = new Audio();
      audioPlayer.src = mediaUrl;
      audioPlayer.addEventListener('ended', () => {
        setPause(false);
      });
      audioPlayer.play();
    }
  }, [mediaBlob, pause]);

  const handleSave = useCallback(async () => {
    if (validAgreement) {
      const result = agreementType[validAgreement];
      if (mediaBlob) {
        const newConsent = {
          ...consentStore.consent,
          agree: result,
          record: await blobToBase64(mediaBlob),
        };

        try {
          const rawConsentList = localStorage.getItem(CONSENTS_KEY);
          let consentList: IConsent[] = [];
          if (rawConsentList) {
            consentList = JSON.parse(rawConsentList) as IConsent[];
          }
          const newConsentList = [...consentList, newConsent];
          localStorage.setItem(CONSENTS_KEY, JSON.stringify(newConsentList));
        } catch (error) {
          localStorage.setItem(CONSENTS_KEY, JSON.stringify([newConsent]));
        }
      }
    }
  }, [consentStore.consent, mediaBlob, validAgreement]);

  if (!consentStore.consent.id) {
    return <Navigate to="/" />;
  }

  if (isNotSupported) {
    return (
      <p className="text-grey-dark font-normal text-justify mb-5">
        Speech recognition not supported in this browser.
      </p>
    );
  }

  return (
    <>
      <p className="text-grey-dark font-normal text-justify mb-5">
        You understand that by using the site or site services, you agree to be
        bound by this agreement. If you do not accept this agreement in its
        entirety, you must not access or use the site or the site services.
      </p>
      <p className="text-grey-dark font-normal text-justify mb-10">
        Do you agree to this agreement? Please respond by saying "Yes" or "No".
      </p>
      {!recording ? (
        <div className="text-center">
          <button
            className={`bg-grey-light rounded-full p-4 ${
              recognizing ? 'cursor-not-allowed animate-ping' : ''
            }`}
            onClick={startRecording}
          >
            <MicIcon className="fill-grey-dark text-grey-dark" />
          </button>
          {recognizing}
        </div>
      ) : (
        <div>
          <div className="flex justify-center items-center mb-16">
            {pause ? (
              <button
                className="bg-grey-light rounded-full p-4"
                onClick={playMedia}
              >
                <PauseSharpIcon className="fill-grey-dark" />
              </button>
            ) : (
              <button
                className="bg-grey-light rounded-full p-4"
                onClick={playMedia}
              >
                <PlaySharpIcon className="fill-grey-dark" />
              </button>
            )}
            <p className="ml-5 font-normal">You responded {transcript}</p>
          </div>
          <div className="flex justify-end">
            <button
              className="flex justify-center items-center bg-grey-light text-grey-dark py-2 px-5 mr-5"
              onClick={() => setRecording(false)}
            >
              Retry
              <ReloadSharpIcon className="ml-5 fill-grey-dark" />
            </button>
            <Link
              to={validAgreement ? '/finished-page' : ''}
              onClick={handleSave}
            >
              <button
                disabled={Boolean(!validAgreement)}
                className={`flex justify-center items-center bg-grey-light text-grey-dark py-2 px-5 ${
                  validAgreement
                    ? 'cursor-pointer'
                    : '!active:opacity-25 opacity-25 cursor-not-allowed'
                }`}
              >
                Save
                <ArrowForwardIcon className="ml-5" />
              </button>
            </Link>
          </div>
        </div>
      )}
    </>
  );
};

export default AgreementPage;
