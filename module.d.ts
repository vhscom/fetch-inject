export default function fetchInject(
	inputs: RequestInfo[],
	promise?: Promise,
	fetch?: { fetch: (info: RequestInfo, init?: RequestInit) => Promise }
): Promise<{ text: string; blob: object }[] | Promise<Record<string | number | symbol, unknown>[]>>;
