export interface Connection {
    id: number;
    name: string;
    gender: number;
    dateOfBirth: Date;
    familyId: number;
    fatherId: number;
    motherId: number;
    notes: string;
    primaryImageUrl: string;
    home: string;
    status: number;
    deathDate?: Date;
    deathCause?: string;
}