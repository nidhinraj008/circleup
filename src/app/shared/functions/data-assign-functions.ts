import { Connection } from "../types/connections";

export function assignConnection(data: any): Connection {
    return {
        id: data?.id ? Number(data.id) : 0,
        name: data?.name ?? null,
        gender: data?.gender ? Number(data.gender) : 0,
        dateOfBirth: data?.dateOfBirth ?? null,
        familyId: data?.familyId ? Number(data.familyId) : null,
        fatherId: data?.fatherId ? Number(data.fatherId) : null,
        motherId: data?.motherId ? Number(data.motherId) : null,
        notes: data?.notes ?? null,
        primaryImageUrl: data?.primaryImageUrl ?? null,
        home: data?.home ?? null,
        status: data?.status ?? 0,
        deathDate: data?.deathDate ?? null,
        deathCause: data?.deathCause ?? null,
    }
}