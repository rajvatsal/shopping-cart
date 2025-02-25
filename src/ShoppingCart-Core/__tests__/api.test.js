import { fetchData } from "../api.js";

describe("API", async () => {
	const data = await fetchData();

	it.each(data)("Items have all the correct values", (item) => {
		expect(item).toEqual({
			id: expect.any(Number),
			title: expect.any(String),
			price: expect.any(Number),
			description: expect.any(String),
			category: expect.any(String),
			image: expect.any(String),
			rating: expect.any(Object),
		});
	});

	it("Gets Products of All Categories", () => {
		let categories = [];
		for (const product of data) {
			categories = categories.includes(product.category)
				? categories
				: [...categories, product.category];
		}

		expect(categories.length).toBe(4);
	});
});
