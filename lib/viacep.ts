export type ViaCepResponse = {
	cep: string;
	logradouro: string;
	complemento: string;
	bairro: string;
	localidade: string;
	uf: string;
	ibge: string;
	gia: string;
	ddd: string;
	siafi: string;
	erro?: boolean;
};

export async function fetchAddressByCep(cep: string): Promise<ViaCepResponse | null> {
	try {
		const clean = cep.replace(/\D/g, "");
		if (clean.length !== 8) return null;

		const response = await fetch(`https://viacep.com.br/ws/${clean}/json/`);
		if (!response.ok) return null;

		const data = (await response.json()) as ViaCepResponse & { erro?: boolean };
		if (data.erro) return null;

		return data;
	} catch {
		return null;
	}
}
