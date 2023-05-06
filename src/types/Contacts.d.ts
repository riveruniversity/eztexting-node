export interface Contact {
	first: string;
	last: string;
	phone: string;
	barcode: string;
	fam?: boolean;
	file?: number;
}

export interface ContactWithFile extends Contact {
	file: number;
}