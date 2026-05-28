import { depenseCommun } from "./depenseCommun";

export default interface depenseCommunCategory {
    id: string;
    nom: string;
    montant: number;
    courant: number;
    notes: string;
    couleurs: string;
    liens: string;
    depenses: depenseCommun[];
}