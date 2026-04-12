import { Connection } from "./connections";

export interface ConnectionDto extends Connection {
    familyName?: string;
    fatherName?: string;
    motherName?: string;
}