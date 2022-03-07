export default function fetchInject(
	inputs: RequestInfo[],
	promise?: Promise<any>
): Promise<{ text: string; blob: object }[] | Promise<Record<string | number | symbol, unknown>[]>>;
