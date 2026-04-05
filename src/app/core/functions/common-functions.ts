import { StatusEnum } from '../enum/status.enum';

/* enum to array formatter*/
export function enumToArray(enumObj: any): { value: number, label: string }[] {
    return Object.keys(enumObj)
        .filter(key => isNaN(Number(key)))
        .map(key => ({ value: enumObj[key], label: key }));
}


/* age calculating function*/
export function calculateAge(status: StatusEnum, dateOfBirth?: string | Date, deathDate?: string | Date): number | '_' {
    if (!dateOfBirth || (status === StatusEnum.Deceased && !deathDate)) 
        return '_';
    const birthYear = new Date(dateOfBirth).getFullYear();
    const endYear = (status === StatusEnum.Alive) ? new Date().getFullYear()
            : (status === StatusEnum.Deceased && deathDate) ? new Date(deathDate).getFullYear()
            : null;
    if (!endYear) 
        return '_';
    const age = endYear - birthYear;
    return age < 0 ? 0 : age;
}