export enum LifeStage {
  girl,
  woman,
}
export const getLifeStage = (age: number) => {
  if (age < 18) {
    return LifeStage.girl;
  } else if (age < 40) {
    return LifeStage.woman;
  } else return LifeStage.woman;
};
