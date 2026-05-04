import { defineConfig } from "orval";

export default defineConfig({
	easyOleoApi: {
		input: {
			target: "./openapi/openapi.json",
		},
		output: {
			client: "react-query",
			httpClient: "axios",
			mode: "tags-split",
			override: {
				mutator: {
					name: "axiosInstance",
					path: "./openapi/axios.ts",
				},
			},
			schemas: "./openapi/client/models",
			target: "./openapi/client",
		},
	},
});
