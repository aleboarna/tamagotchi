import { LevelBar } from './level-bar';
import { useEffect, useRef, useState } from 'react';
import RetryModal, { ModalReason } from './retry-modal';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getLifeStage } from './right-lifecycle';
import { getStageProps } from './stage-modifier';
import { ReactComponent as People } from '../assets/people.svg';
import { GlobalSwitch } from './global-switch';
import { EntryCreateRequestPayload } from '@tamagotchi/types';
import axios, { AxiosResponse } from 'axios';
import { useMutation } from 'react-query';
import { ENVIRONMENT } from '../environments/environment';

export function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const { name: userName }: { name: string } = location.state || {};

  useEffect(() => {
    if (!userName) navigate('/login');
  }, [userName]);

  const saveMutation = useMutation(
    (props: {
      userName: string;
      retryCount: number;
      recordLifeCycles: number;
    }) =>
      axios.post<
        EntryCreateRequestPayload,
        AxiosResponse<EntryCreateRequestPayload>
      >(`${ENVIRONMENT.API_URL}/api/v1/add`, props)
  );

  const getMutation = useMutation((props: { userName: string }) =>
    axios.get<EntryCreateRequestPayload>(
      `${ENVIRONMENT.API_URL}/api/v1/user/${props.userName}`
    )
  );

  const [isVisible, setIsVisible] = useState(true);

  const [toggleGlobal, setToggleGlobal] = useState(false);
  const [firstTimeGlobal, setFirstTimeGlobal] = useState(true);

  const [healthLevel, setHealthLevel] = useState(
    Number(localStorage.getItem(`${userName}-health`)) || 100
  );
  const [happinessLevel, setHappinessLevel] = useState(
    Number(localStorage.getItem(`${userName}-happiness`)) || 100
  );
  const [isModalOpen, setIsModalOpen] = useState(
    happinessLevel === 0 || healthLevel === 0
  );

  const [age, setAge] = useState(
    Number(localStorage.getItem(`${userName}-age`)) || 3
  );

  //get from  dynamodb or localstorage, if not in localstorage then 1
  const [retryCount, setRetryCount] = useState(1);
  const [maxLifeCycles, setMaxLifeCycles] = useState(1);
  const [recordLifeCycles, setRecordLifeCycles] = useState(1);

  const modifiers = getStageProps(getLifeStage(age));

  const increaseHealth = () => {
    setHealthLevel(healthLevel + 5);
  };
  const increaseHappiness = () => {
    setHappinessLevel(happinessLevel + 5);
  };
  const happinessRef = useRef(happinessLevel);
  const healthRef = useRef(happinessLevel);
  const ageRef = useRef(age);

  useEffect(() => {
    healthRef.current = healthLevel;
  }, [healthLevel]);
  useEffect(() => {
    happinessRef.current = happinessLevel;
  }, [happinessLevel]);
  useEffect(() => {
    ageRef.current = age;
  }, [age]);

  useEffect(() => {
    const healthTimer = window.setInterval(() => {
      if (healthRef.current === 0) {
        clearInterval(healthTimer);
        clearInterval(happinessTimer);
        clearInterval(ageTimer);
        setIsModalOpen(true);
      } else {
        setHealthLevel((prevState) => prevState - 1);
        localStorage.setItem(`${userName}-health`, `${healthRef.current - 1}`);
      }
    }, 500 * modifiers.healthModifier);
    const happinessTimer = window.setInterval(() => {
      if (happinessRef.current === 0) {
        clearInterval(healthTimer);
        clearInterval(happinessTimer);
        clearInterval(ageTimer);
        setIsModalOpen(true);
      } else {
        setHappinessLevel((prevState) => prevState - 1);
        localStorage.setItem(
          `${userName}-happiness`,
          `${happinessRef.current - 1}`
        );
      }
    }, 500 * modifiers.happinessModifier);
    const ageTimer = window.setInterval(() => {
      setAge((prevState) => prevState + 1);
      localStorage.setItem(`${userName}-age`, `${ageRef.current + 1}`);
    }, 10000);

    return () => {
      window.clearInterval(healthTimer);
      window.clearInterval(happinessTimer);
      window.clearInterval(ageTimer);
    };
  }, [retryCount]);

  useEffect(() => {
    const timer = setInterval(() => {
      setIsVisible((prevIsVisible) => !prevIsVisible);
    }, 1800);

    // Clean up the timer when the component is unmounted
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (toggleGlobal && firstTimeGlobal) {
      getMutation.mutate(
        { userName },
        {
          onSuccess: (response) => {
            if (response.data.recordLifeCycles > recordLifeCycles) {
              setRecordLifeCycles(response.data.recordLifeCycles);
            }
            setRetryCount(
              (prevState) => prevState + Number(response.data.retryCount)
            );
            setFirstTimeGlobal(false);
          },
          onError: (error) => {
            console.error(error);
            setFirstTimeGlobal(false);
          },
        }
      );
    }
  }, [toggleGlobal]);
  useEffect(() => {
    if (toggleGlobal && !firstTimeGlobal) {
      saveMutation.mutate({ userName, retryCount, recordLifeCycles });
    }
  }, [toggleGlobal, firstTimeGlobal]);
  const onRetryModal = () => {
    commonReset();
    setMaxLifeCycles(1);
  };

  const commonReset = () => {
    setHappinessLevel(100);
    setHealthLevel(100);
    setAge(3);
    localStorage.setItem(`${userName}-happiness`, '100');
    localStorage.setItem(`${userName}-health`, '100');
    localStorage.setItem(`${userName}-age`, '3');
    setIsModalOpen(false);
    setRetryCount((prevState) => prevState + 1);
  };

  const onNewCycle = () => {
    commonReset();
    if (maxLifeCycles + 1 > recordLifeCycles) {
      setRecordLifeCycles((prevState) => prevState + 1);
    }
    setMaxLifeCycles((prevState) => prevState + 1);
  };

  const setGlobalToggle = () => {
    setToggleGlobal((prevState) => !prevState);
  };

  return (
    <div className={'flex flex-col items-center justify-between min-h-screen'}>
      <div
        className={'w-full flex flex-row justify-between h-10 mt-1 pl-1 pr-1'}
      >
        <GlobalSwitch
          toggleGlobal={toggleGlobal}
          setToggleGlobal={setGlobalToggle}
        />
        <h1 className={' text-xl pt-4 pb-10'}>EmpowHER</h1>
        <Link
          className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
          to={'/login'}
        >
          Change player
        </Link>
      </div>
      <RetryModal
        onRetryModal={onRetryModal}
        isOpen={isModalOpen}
        onNewCycle={onNewCycle}
        onCloseModal={() => setIsModalOpen(false)}
        modalReason={ModalReason.failed}
      />
      <div className={'flex justify-evenly w-2/5 pb-7'}>
        <LevelBar level={healthLevel} name={'Health'} />
        <LevelBar level={happinessLevel} name={'Happiness'} />
        <LevelBar level={age} name={'Age'} />
      </div>
      <div className={'flex flex-row justify-evenly'}>
        <Leaderboard
          retryCount={retryCount}
          recordLifeCycles={recordLifeCycles}
        />
        <div className={'w-1/2 pb-10'}>
          <modifiers.image />
        </div>
        <div>story</div>
      </div>

      {healthLevel === 0 || happinessLevel === 0 ? (
        <div>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
            onClick={onRetryModal}
          >
            Try again
          </button>
        </div>
      ) : (
        <div className={'flex flex-row justify-around w-1/4'}>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
            onClick={healthLevel < 96 ? increaseHealth : undefined}
          >
            Support
          </button>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
            onClick={happinessLevel < 96 ? increaseHappiness : undefined}
          >
            Empower
          </button>
        </div>
      )}
      <div className={'relative bottom-0 flex flex-row w-full '}>
        <div className={`  absolute w-full flex justify-evenly`}>
          <p
            className={`text-xl font-bold italic  ease-in-out duration-100 delay-300  ${
              isVisible ? 'opacity-100' : 'opacity-0'
            }`}
          >
            Stop making a mess
          </p>
          <p
            className={`text-xl font-bold italic  ease-in-out duration-100 delay-200  ${
              !isVisible ? 'opacity-100' : 'opacity-0'
            }`}
          >
            Why aren't you listening
          </p>
          <p
            className={`text-xl font-bold italic ease-in-out duration-100 delay-100 ${
              isVisible ? 'opacity-100' : 'opacity-0'
            }`}
          >
            You're a cry baby
          </p>
          <p
            className={`text-xl font-bold italic ease-in-out duration-100 ${
              !isVisible ? 'opacity-100' : 'opacity-0'
            }`}
          >
            You talk too much
          </p>
          <p
            className={`text-xl font-bold italic ease-in-out duration-100 delay-200  ${
              isVisible ? 'opacity-100' : 'opacity-0'
            }`}
          >
            Why can't you be more like your sister
          </p>
        </div>
        <People></People>
        <People></People>
        <People></People>
        <People></People>
        <People></People>
        <People></People>
        <People></People>
      </div>
    </div>
  );
}

export default App;

const Leaderboard = (props: {
  retryCount: number;
  recordLifeCycles: number;
}) => {
  return (
    <div>
      leaderboard total tries {props.retryCount} lifecycles{' '}
      {props.recordLifeCycles}
    </div>
  );
};
