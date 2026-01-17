// client/src/types/index.ts
export interface Konto { id: number; konto: string; naziv: string; analit: string; }
export interface NalogHeader { nalog: string; datum: string; dokum: string; }
export interface NalogItem { 
  id: number; rb: number; konto: string; analit: string; 
  vr_prom: string; iznos: number; opis: string; 
}
export interface Firma { naziv: string; adresa: string; pib: string; }

// Kombinovani tip za proknjižen nalog
export interface KnjizenNalog {
  head: NalogHeader;
  items: NalogItem[];
}
