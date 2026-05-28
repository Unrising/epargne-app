import economie from "./economie";

export interface epargne {
    id: string;
    nom: string;
    montant: number;
    courant: number;
    notes: string;
    couleurs: string;
    liens: string;
    economie: economie[];
}
