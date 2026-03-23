export function enumToArray(enumObj: any): { value: string, label: any }[] {
    return Object.keys(enumObj)
        .filter(key => isNaN(Number(key)))
        .map(key => ({ value: enumObj[key], label: key }));
}