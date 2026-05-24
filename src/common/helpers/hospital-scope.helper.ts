export interface HospitalScopedUser {
    roleName: string;
    hospitalId: number | null;
}

export function getHospitalScope(user: HospitalScopedUser): { hospitalId?: number } {
    if (user.roleName === 'SUPER_AUDITOR') {
        return {};
    }
    return { hospitalId: user.hospitalId ?? undefined };
}
