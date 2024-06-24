// import reactLogo from "./assets/react.svg";
// import viteLogo from "/vite.svg";

import "./App.css";
import CategoryList from "./components/CategoryList";
import ProductList from "./components/ProductList";
import SearchBar from "./components/SearchBar";

function App() {
	return (
		<>
			<SearchBar />
			<CategoryList />
			<h2 className="mb-2 ">Products</h2>
			<ProductList />
		</>
	);
}

export default App;
