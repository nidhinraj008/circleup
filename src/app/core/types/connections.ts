export interface Connection {
    id: number;
    name: string;
    gender: number;
    dateOfBirth: Date;
    familyId: number;
    fatherId: number;
    motherId: number;
    fatherName?: string;
    motherName?: string;
    notes: string;
    primaryImageUrl: string;
    home: string;
    status: number;
    deathDate?: Date;
    deathCause?: string;
}