import { depense } from "./depense";

export default interface depenseCategory {
    id: string;
    nom: string;
    montant: number;
    courant: number;
    notes: string;
    couleurs: string;
    liens: string;
    depenses: depense[];
}