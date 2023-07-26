import { ReactComponent } from '*.svg';
import { LifeStage } from './right-lifecycle';
import { ReactComponent as Superwoman } from '../assets/super-woman.svg';
import { ReactComponent as Supergirl } from '../assets/super-girl.svg';
import { ReactComponent as Superpregnant } from '../assets/super-pregnant.svg';

export type StageModifier = {
  image: typeof ReactComponent;
  healthModifier: number;
  happinessModifier: number;
};

export const getStageProps = (stage: LifeStage): StageModifier => {
  switch (stage) {
    case LifeStage.girl: {
      return {
        image: () => <Supergirl className="container" />,
        happinessModifier: 5,
        healthModifier: 1,
      };
    }
    case LifeStage.woman: {
      return {
        image: () => <Superwoman className="container" />,
        happinessModifier: 2,
        healthModifier: 3,
      };
    }
    case LifeStage.pregnant: {
      return {
        image: () => <Superpregnant className="container" />,
        happinessModifier: 5,
        healthModifier: 4,
      };
    }
    default: {
      return {
        image: () => <Superwoman className="container" />,
        happinessModifier: 1,
        healthModifier: 1,
      };
    }
  }
};
