const fetchData = async () => {
	let res = await fetch(
		"https://fakestoreapi.com/products/category/electronics",
		{
			mode: "cors",
		},
	);
	res = await res.json();
	return res;
};

export { fetchData };
