export function getType(name: string, methodName: string) {
  return `${name}/${methodName}`;
}

export function getMethodName(type: string, name: string) {
  return type.replace(`${name}/`, '');
}
