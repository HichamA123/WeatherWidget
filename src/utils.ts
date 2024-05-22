export function validVariable(variable : any): boolean {
  if (variable == undefined || variable == null) {
    //Non-strict check (==) to allow type coercion. so '3' and 3 would be seen as the same. it checks value only.
    console.error("Variable is invalid. Value: ", variable);
    return false;
  } else {
    return true;
  }
}

export const TIMEOUT_MINUTES: number = 3;

export function timeoutIsDone(lastCalled : number, minutes : number = TIMEOUT_MINUTES): boolean {
  const now = Date.now();
  if (lastCalled == null || now - lastCalled >= minutes * 60 * 1000) { // if timedifference is bigger than the minimum past minutes
    return true;
  }
  console.log(`${minutes} minutes have not passed.`);
  return false;
}
