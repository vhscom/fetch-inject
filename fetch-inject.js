/*! Fetch Inject | Copyright (C) VHS <vhsdev@tutanota.com> | @license Zlib */
const injector = (function(i,n,j,e,c,t,s){t=n.createElement(j),s=n.getElementsByTagName(j)[0];t.appendChild(n.createTextNode(e.text));t.onload=c(e);s?s.parentNode.insertBefore(t,s):n.head.appendChild(t)}); // prettier-ignore

export default async function (inputs, promise, { fetch } = globalThis) {
	const resources = [];
	const deferreds = promise ? [].concat(promise) : [];
	const thenables = [];

	inputs.forEach((input) =>
		deferreds.push(
			fetch(input)
				.then((res) => [res.clone().text(), res.blob()])
				.then(async (promises) => {
					const [text, blob] = await Promise.all(promises);
					resources.push({ text, blob });
				})
		)
	);

	await Promise.all(deferreds);
	resources.forEach((resource) => {
		thenables.push({
			then: (resolve) => {
				const inject = (type) => injector(globalThis, document, type, resource, resolve);
				resource.blob.type.includes('text/css') ? inject('style') : inject('script');
			}
		});
	});

	return await Promise.all(thenables);
}
