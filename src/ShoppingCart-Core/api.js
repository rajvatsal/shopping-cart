const fetchData = async () => {
	let res = await fetch("https://fakestoreapi.com/products", {
		mode: "cors",
	});
	res = await res.json();

	fetch("https://fakestoreapi.com/products/categories")
		.then((res) => res.json())
		.then((json) => console.log(json));
	return res;
};

export { fetchData };
