export function validVariable(variable: any): boolean {

    if (variable == undefined || variable == null) {//Non-strict check (==) to allow type coercion. so '3' and 3 would be seen as the same. it checks value only.
      console.error('Variable is invalid. Value: ', variable);
      return false;
    } else {
      return true;
    }
  }