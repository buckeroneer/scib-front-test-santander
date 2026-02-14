export interface Candidate {
    id: number;
    name: string;
    surname: string;
    seniority: SeniorityType;
    years: number;
    availability: boolean;
}

export type SeniorityType = 'junior' | 'senior';