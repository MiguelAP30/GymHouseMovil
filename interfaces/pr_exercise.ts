export interface HistoryPRExercise {
    id?: number;
    date: string;
    exercise_id: number;
    notas: string;
    tipo_sesion: string;
    user_email?: string;
}

export interface SeriesPRExercise {
    id?: number;
    history_pr_exercise_id: number;
    notas_serie: string;
    orden_serie: number;
    reps: number;
    rpe: number;
    tipo_serie: string;
    weight: number;
}

export interface DropsetPRExercise {
    id?: number;
    serie_pr_exercise_id: number;
    orden_dropset: number;
    reps: number;
    weight: number;
}
