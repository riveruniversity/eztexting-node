export interface Attendee {
	first: string;
	last: string;
	phone: string;
	barcode: string;
	fam?: boolean;
	file?: number;
}

export interface AttendeeWithFile extends Attendee {
	file: number;
}