import dayjs from "dayjs";
import "dayjs/locale/pt-br";

dayjs.locale("pt-br");

export function parseIsoDateToLocalDate(isoDate: string): Date | null {
	const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoDate.trim());
	if (!m) return null;
	const y = Number(m[1]);
	const mo = Number(m[2]);
	const d = Number(m[3]);
	return new Date(y, mo - 1, d);
}

export function formatIsoDatePtBr(isoDate: string): string {
	const d = parseIsoDateToLocalDate(isoDate);
	return d ? dayjs(d).format("DD/MM/YYYY") : isoDate;
}

export function todayIsoDateLocal(): string {
	return dayjs().format("YYYY-MM-DD");
}
