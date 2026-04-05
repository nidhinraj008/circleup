export interface Connection {
    id: number;
    name: string;
    gender: number;
    dateOfBirth: Date;
    father: string;
    mother: string;
    notes: string;
    primaryImage: string;
    home: string;
    status: number;
    deathDate?: Date;
    deathCause?: string;
}