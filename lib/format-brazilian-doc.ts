import { formatCNPJ, formatCPF } from "@cosmixclub/docsafe-br";

export { formatCNPJ, formatCPF };

export function formatCpfOrCnpjDocument(raw: string): string {
	const digits = raw.replace(/\D/g, "");
	if (digits.length === 11) return formatCPF(raw);
	if (digits.length === 14) return formatCNPJ(raw);
	return raw;
}
