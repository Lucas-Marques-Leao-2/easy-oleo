import axios from "axios";

export function apiErrorMessage(error: unknown): string {
	if (axios.isAxiosError(error)) {
		const data = error.response?.data as
			| { message?: string | string[] }
			| undefined;
		if (data?.message !== undefined) {
			const m = data.message;
			return Array.isArray(m) ? m.join(". ") : String(m);
		}
		return error.message || "Erro na requisição.";
	}
	if (error instanceof Error) return error.message;
	return "Não foi possível concluir a operação.";
}
