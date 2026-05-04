import axios, {
	type AxiosError,
	type AxiosRequestConfig,
	type AxiosResponse,
} from "axios";

export const AXIOS_INSTANCE = axios.create({
	baseURL:
		process.env.NEXT_PUBLIC_API_URL ??
		process.env.NEXT_PUBLIC_REQS_API_URL ??
		"http://127.0.0.1:8082",
});

export const axiosInstance = <T>(
	config: AxiosRequestConfig,
	options?: AxiosRequestConfig,
): Promise<T> => {
	const source = axios.CancelToken.source();
	const promise = AXIOS_INSTANCE({
		...config,
		...options,
		cancelToken: source.token,
	}).then((response: AxiosResponse<T>) => response.data) as Promise<T> & {
		cancel?: () => void;
	};

	promise.cancel = () => {
		source.cancel("Query was cancelled");
	};

	return promise;
};

export type ErrorType<ErrorData> = AxiosError<ErrorData>;
export type BodyType<BodyData> = BodyData;
