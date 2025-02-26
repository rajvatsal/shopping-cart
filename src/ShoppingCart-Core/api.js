const fetchData = async () => {
	let res = await fetch("https://fakestoreapi.com/products", {
		mode: "cors",
	});
	return await res.json();
};

export { fetchData };
