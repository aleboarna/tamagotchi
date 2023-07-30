import { ReactComponent } from '*.svg';
import { LifeStage } from './right-lifecycle';
import { ReactComponent as Superwoman } from '../assets/super-woman.svg';
import { ReactComponent as Supergirl } from '../assets/super-girl.svg';

export type StageModifier = {
  image: typeof ReactComponent;
  healthModifier: number;
  happinessModifier: number;
};

export const getStageProps = (stage: LifeStage): StageModifier => {
  switch (stage) {
    case LifeStage.girl: {
      return {
        image: () => (
          <Supergirl className={'object-contain  w-4/5 h-1/2 sm:mx-5'} />
        ),
        happinessModifier: 5,
        healthModifier: 1,
      };
    }
    case LifeStage.woman: {
      return {
        image: () => (
          <Superwoman className={'object-contain  w-4/5 h-1/2 sm:mx-5'} />
        ),
        happinessModifier: 2,
        healthModifier: 3,
      };
    }
    default: {
      return {
        image: () => (
          <Superwoman className={'object-contain  w-4/5 h-1/2 sm:mx-5'} />
        ),
        happinessModifier: 1,
        healthModifier: 1,
      };
    }
  }
};
