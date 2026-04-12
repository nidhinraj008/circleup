import { Connection } from "../types/connections";

export function assignConnection(data: any): Connection {
    return {
        id: data?.id ? Number(data.id) : 0,
        name: data?.name ?? null,
        gender: data?.gender ? Number(data.gender) : 0,
        dateOfBirth: data?.dateOfBirth ?? null,
        familyId: data?.familyId ? Number(data.familyId) : 0,
        fatherId: data?.fatherId ? Number(data.fatherId) : 0,
        motherId: data?.motherId ? Number(data.motherId) : 0,
        notes: data?.notes ?? null,
        primaryImageUrl: data?.primaryImageUrl ?? null,
        home: data?.home ?? null,
        status: data?.status ?? 0,
        deathDate: data?.deathDate ?? null,
        deathCause: data?.deathCause ?? null,
    }
}