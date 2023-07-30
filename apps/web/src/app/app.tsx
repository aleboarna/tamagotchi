import { LevelBar } from './level-bar';
import { useEffect, useRef, useState } from 'react';
import RetryModal, { ModalReason } from './retry-modal';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getLifeStage } from './right-lifecycle';
import { getStageProps } from './stage-modifier';
import { ReactComponent as People } from '../assets/people.svg';
import { GlobalSwitch } from './global-switch';
import {
  EntriesGetResponsePayload,
  EntryCreateRequestPayload,
  EntryGetResponsePayload,
} from '@tamagotchi/types';
import axios, { AxiosResponse } from 'axios';
import { useMutation } from 'react-query';
import { ENVIRONMENT } from '../environments/environment';
import { Leaderboard } from './leaderboard';
// 1. check if when failed you can still save if record
// 2. make function out of crowd
// 3. statefully close dialog when support
// 4. change text for different life stage
// 5. create story
// 6.
export function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const { name: userName }: { name: string } = location.state || {};

  useEffect(() => {
    if (!userName) navigate('/login');
  }, [userName]);

  //for global state
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
  //for global state to get users data
  const getMutation = useMutation((props: { userName: string }) =>
    axios.get<EntryCreateRequestPayload>(
      `${ENVIRONMENT.API_URL}/api/v1/user/${props.userName}`
    )
  );
  //for global state to get user leaderboard, first 10 users, should add TTL
  const getLeaderboardMutation = useMutation(() =>
    axios.get<EntriesGetResponsePayload>(
      `${ENVIRONMENT.API_URL}/api/v1/leaderboard`
    )
  );
  //used by crowd text
  const [isVisible, setIsVisible] = useState(true);

  //used for the global switch
  const [toggleGlobal, setToggleGlobal] = useState(false);
  //used to only make a get request first time you go global
  const [firstTimeGlobal, setFirstTimeGlobal] = useState(true);
  //used to log health level, only local storage
  const [healthLevel, setHealthLevel] = useState(
    Number(localStorage.getItem(`${userName}-health`)) || 100
  );
  //used to log happiness level, only local storage
  const [happinessLevel, setHappinessLevel] = useState(
    Number(localStorage.getItem(`${userName}-happiness`)) || 100
  );
  //used to know when to trigger dialog
  const [isModalOpen, setIsModalOpen] = useState(
    happinessLevel === 0 || healthLevel === 0
  );
  //used to log age, only local storage
  const [age, setAge] = useState(
    Number(localStorage.getItem(`${userName}-age`)) || 3
  );

  //used to log total number of tries, can be both local and global
  const [retryCount, setRetryCount] = useState(
    Number(localStorage.getItem(`${userName}-retryCount`)) || 1
  );
  //used to track current maximum lifecycles achieved
  const [maxLifeCycles, setMaxLifeCycles] = useState(1);
  //used to track only the record lifecycles achieved
  const [recordLifeCycles, setRecordLifeCycles] = useState(
    Number(localStorage.getItem(`${userName}-recordLifeCycles`)) || 1
  );
  //used to hold global leaderboard state
  const [globalLeaderboard, setGlobalLeaderboard] = useState<
    EntryGetResponsePayload[]
  >([]);
  //used to hold local leaderboard state
  const [localLeaderboard, setLocalLeaderboard] = useState<
    EntryGetResponsePayload[]
  >([]);

  //used to get modifiers for passing of time, depending on life stage
  const modifiers = getStageProps(getLifeStage(age));

  //increase health on support
  const increaseHealth = () => {
    setHealthLevel(healthLevel + 5);
  };
  //increase happiness on empower
  const increaseHappiness = () => {
    setHappinessLevel(happinessLevel + 5);
  };
  //used ref because of state issues otherwise
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
        //stops all timers if any reaches 0 and triggers opening of modal
        clearInterval(healthTimer);
        clearInterval(happinessTimer);
        clearInterval(ageTimer);
        setIsModalOpen(true);
      } else {
        //decreases health level and stores new value in local storage
        setHealthLevel((prevState) => prevState - 1);
        localStorage.setItem(`${userName}-health`, `${healthRef.current - 1}`);
      }
    }, 500 * modifiers.healthModifier);
    const happinessTimer = window.setInterval(() => {
      if (happinessRef.current === 0) {
        //stops timers if any reaches 0 and triggers opening of modal
        clearInterval(healthTimer);
        clearInterval(happinessTimer);
        clearInterval(ageTimer);
        setIsModalOpen(true);
      } else {
        //decreases happiness level and stores new value in local storage
        setHappinessLevel((prevState) => prevState - 1);
        localStorage.setItem(
          `${userName}-happiness`,
          `${happinessRef.current - 1}`
        );
      }
    }, 500 * modifiers.happinessModifier);
    const ageTimer = window.setInterval(() => {
      //increases age and stores new value in local storage
      setAge((prevState) => prevState + 1);
      localStorage.setItem(`${userName}-age`, `${ageRef.current + 1}`);
    }, 10000);

    return () => {
      //clean up function to delete timers
      window.clearInterval(healthTimer);
      window.clearInterval(happinessTimer);
      window.clearInterval(ageTimer);
    };
  }, [retryCount]);
  //timer used for crowd text purposes
  useEffect(() => {
    const timer = setInterval(() => {
      setIsVisible((prevIsVisible) => !prevIsVisible);
    }, 1800);
    // Clean up the timer when the component is unmounted
    return () => clearInterval(timer);
  }, []);
  //get leaderboard from local storage
  const getLocalLeaderboard = (): EntryGetResponsePayload[] => {
    const entries: EntryGetResponsePayload[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.endsWith('-happiness')) {
        const userName = key.split('-')[0];
        const retryCount =
          Number(localStorage.getItem(`${userName}-retryCount`)) || 1;
        const recordLifeCycles =
          Number(localStorage.getItem(`${userName}-recordLifeCycles`)) || 1;
        entries.push({ userName, retryCount, recordLifeCycles });
      }
    }
    return entries
      .sort((a, b) => {
        if (a.recordLifeCycles > b.recordLifeCycles) {
          return -1;
        } else if (a.recordLifeCycles < b.recordLifeCycles) {
          return 1;
        } else {
          if (a.retryCount > b.retryCount) {
            return -1;
          } else if (a.retryCount < b.retryCount) {
            return 1;
          } else {
            return 0;
          }
        }
      })
      .slice(0, 9);
  };
  useEffect(() => {
    setLocalLeaderboard(getLocalLeaderboard());
  }, [retryCount]);

  //only gets data from dynamodb the first time user goes global
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
      getLeaderboardMutation.mutate(undefined, {
        onSuccess: (response) => {
          const allEntries = response.data.entries;
          if (!allEntries.find((entry) => entry.userName === userName)) {
            allEntries.push({ userName, retryCount, recordLifeCycles });
          }
          return setGlobalLeaderboard(allEntries);
        },
        onError: (error) => {
          console.error(error);
        },
      });
    }
  }, [toggleGlobal]);
  //only stores data in dynamodb after fetching it once
  useEffect(() => {
    if (toggleGlobal && !firstTimeGlobal) {
      saveMutation.mutate({ userName, retryCount, recordLifeCycles });
    }
  }, [toggleGlobal, firstTimeGlobal]);
  //used when the user fails
  const onRetryModal = () => {
    commonReset();
    setMaxLifeCycles(1);
  };
  //clean up state when user fails or wins
  const commonReset = () => {
    setHappinessLevel(100);
    setHealthLevel(100);
    setAge(3);
    localStorage.setItem(`${userName}-happiness`, '100');
    localStorage.setItem(`${userName}-health`, '100');
    localStorage.setItem(`${userName}-age`, '3');
    setIsModalOpen(false);
    setRetryCount((prevState) => prevState + 1);
    localStorage.setItem(`${userName}-retryCount`, `${retryCount}`);
  };
  //sets up state when user wins
  const onNewCycle = () => {
    commonReset();
    if (maxLifeCycles + 1 > recordLifeCycles) {
      setRecordLifeCycles((prevState) => prevState + 1);
      localStorage.setItem(
        `${userName}-recordLifeCycles`,
        `${recordLifeCycles}`
      );
    }
    setMaxLifeCycles((prevState) => prevState + 1);
  };
  //used to set the toggle
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
          entries={toggleGlobal ? globalLeaderboard : localLeaderboard}
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
