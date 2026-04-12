import { StatusEnum } from '../../shared/enum/status.enum';
import moment from 'moment';

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

/* calculate age year month days */
export function calculateFullAge(status: StatusEnum, dateOfBirth?: string | Date, deathDate?: string | Date) {
    if (!dateOfBirth || (status === StatusEnum.Deceased && !deathDate) || status === StatusEnum.Unknown) {
        return { ageYears: '', ageMonths: '', ageDays: '' };
    }

    const start = moment(dateOfBirth);
    const end = (status === StatusEnum.Alive) ? moment() : moment(deathDate);
    
    const years = end.diff(start, 'years');
    start.add(years, 'years');
    const months = end.diff(start, 'months');
    start.add(months, 'months');
    const days = end.diff(start, 'days');
    
    // const format = (value: number, label: string) => value + ` ${label}${value > 1 ? 's' : ''}`;
    // return {
    //     ageYears: format(years, 'year'),
    //     ageMonths: format(months, 'month'),
    //     ageDays: format(days, 'day')
    // };
    
    return { ageYears: years, ageMonths: months, ageDays: days };
}
