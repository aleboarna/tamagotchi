export enum LifeStage {
  girl,
  woman,
  pregnant,
}
export const getLifeStage = (age: number) => {
  if (age < 18) {
    return LifeStage.girl;
  } else if (age < 40) {
    return LifeStage.woman;
  } else if (age === 40) {
    return LifeStage.pregnant;
  } else return LifeStage.woman;
};
//need to return right woman type, different images && time passes differently for health & happiness
