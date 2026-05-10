export interface Relation {
    id: number;
    maleId: string;
    femaleId: string;
    status: number;
    firstSeenDate: Date | null;
    marriageDate: Date | null;
    separationDate: Date | null;
}