const firstName: string = 'Ihor';
const birthday: string | Date = new Date('1986-09-12');
const phoneNumber: string | number = 380501234567;

let middleName: string | null = null;
let extraInfo: string | undefined = undefined;

function printUserInfo(
	name?: string | null,
	birth?: string | Date | null,
	phone?: string | number | null,
	note?: string | null
): void {
	const nameOut = name ?? '—';
	const birthOut = birth
		? birth instanceof Date
			? birth.toLocaleDateString()
			: birth
		: '—';
	const phoneOut = phone != null ? String(phone) : '—';
	const noteOut = note ?? '—';

	console.log(
		`User info:
  Name: ${nameOut}
  Birthday: ${birthOut}
  Phone: ${phoneOut}
  Note: ${noteOut}`
	);
}

printUserInfo(firstName, birthday, phoneNumber);
printUserInfo(firstName, birthday, phoneNumber, 'VIP user');
printUserInfo(null, undefined, undefined, extraInfo);

