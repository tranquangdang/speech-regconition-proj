import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from 'react';
import { Link } from 'react-router-dom';
import { ReactComponent as MicIcon } from '../../assets/mic.svg';
import { ReactComponent as ArrowForwardIcon } from '../../assets/arrow-forward-outline.svg';
import { ReactComponent as ReloadSharpIcon } from '../../assets/reload-sharp.svg';
import { ReactComponent as PlaySharpIcon } from '../../assets/play-sharp.svg';
import { ReactComponent as PauseSharpIcon } from '../../assets/pause-sharp.svg';
import { useAppSelector } from '../../redux/hooks';
import {
  setConsentList,
  setConsentProp,
  setTranscript,
} from '../../redux/slices/consentSlice';
import {
  ENGLISH,
  FRENCH,
  NO,
  OUI,
  POLICY,
  POLICY_QUESTION,
  YES,
  agreementType,
} from '../../const';
import { base64ToBlob, blobToBase64 } from '../../utils/utils';
import { useDispatch } from 'react-redux';

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
  const dispatch = useDispatch();
  const { consent, transcript } = useAppSelector((state) => state.consentStore);
  const [recognizing, setRecognizing] = useState<string>('');
  const [pause, setPause] = useState<boolean>(false);
  const [isNotSupported, setNotSupported] = useState<boolean>(false);
  const [readingPolicy, setReadingPolicy] = useState<boolean>(true);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const validAgreement = useMemo(
    () => getAgreeFromTranscript(transcript, consent.language),
    [transcript, consent.language]
  );

  useEffect(() => {
    if ('speechSynthesis' in window) {
      const speechSynthesis = window.speechSynthesis;

      speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(POLICY + POLICY_QUESTION);
      utterance.pitch = 1;
      utterance.rate = 0.8;
      utterance.lang = 'en-GB';

      utterance.onend = () => {
        setReadingPolicy(false);
      };
      speechSynthesis.speak(utterance);

      return () => {
        speechSynthesis.cancel();
      };
    } else {
      setReadingPolicy(false);
      alert('Text-to-speech is not supported in this browser.');
    }
  }, []);

  useEffect(() => {
    let recognition: SpeechRecognition | null = null;

    if (
      !recognitionRef.current &&
      ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)
    ) {
      recognition = new (window.SpeechRecognition ||
        window.webkitSpeechRecognition)();

      if (consent.language === FRENCH) {
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

              mediaRecorderRef.current.addEventListener('stop', async () => {
                const combinedChunks = new Blob(chunks, { type: 'audio/webm' });
                const record = await blobToBase64(combinedChunks);
                if (record && typeof record === 'string') {
                  dispatch(
                    setConsentProp({
                      ...consent,
                      record,
                    })
                  );
                }

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
          dispatch(setTranscript(result.toLowerCase()));
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
  }, [consent, consent.language, dispatch]);

  const startRecording = useCallback(() => {
    if (
      recognitionRef.current &&
      ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)
    ) {
      if (!recognizing) {
        dispatch(setConsentProp({ ...consent, record: '' }));
        dispatch(setTranscript(''));
        recognitionRef.current.start();
      }
    } else {
      setNotSupported(true);
    }
  }, [consent, dispatch, recognizing]);

  const playMedia = useCallback(async () => {
    if (consent.record && !pause) {
      setPause(true);
      const recordBlob = await base64ToBlob(consent.record);
      const mediaUrl = URL.createObjectURL(recordBlob);
      const audioPlayer = new Audio();
      audioPlayer.src = mediaUrl;
      audioPlayer.addEventListener('ended', () => {
        setPause(false);
      });
      audioPlayer.play();
    }
  }, [consent.record, pause]);

  const handleSave = useCallback(async () => {
    if (validAgreement) {
      const result = agreementType[validAgreement];

      const newConsent = {
        ...consent,
        agree: result,
      };

      dispatch(setConsentList(newConsent));
    }
  }, [consent, dispatch, validAgreement]);

  if (isNotSupported) {
    return (
      <p className="text-grey-dark font-normal text-justify mb-5">
        Speech recognition not supported in this browser.
      </p>
    );
  }

  return (
    <>
      <p className="text-grey-dark font-normal text-justify mb-5">{POLICY}</p>
      <p className="text-grey-dark font-normal text-justify mb-10">
        {POLICY_QUESTION}
      </p>
      {!readingPolicy &&
        (!transcript || !consent.record ? (
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
              <p className="ml-5 font-normal">
                You responded {transcript ?? 'unknown'}
              </p>
            </div>
            <div className="flex justify-end">
              <button
                className="flex justify-center items-center bg-grey-light text-grey-dark py-2 px-5 mr-5"
                onClick={() => {
                  dispatch(setConsentProp({ ...consent, record: '' }));
                  dispatch(setTranscript(''));
                }}
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
        ))}
    </>
  );
};

export default AgreementPage;
