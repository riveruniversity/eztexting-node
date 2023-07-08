export interface Contact {
	first: string;
	last: string;
	phone: string;
	barcode: string;
	fam?: boolean;
	file?: string;
}

export interface ContactWithFile extends Contact {
	file: string;
}