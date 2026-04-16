export interface Connection {
    id: number;
    name: string;
    gender: number;
    dateOfBirth: Date;
    familyId: number | null;
    fatherId: number | null;
    motherId: number | null;
    notes: string;
    primaryImageUrl: string;
    home: string;
    status: number;
    deathDate?: Date;
    deathCause?: string;
}