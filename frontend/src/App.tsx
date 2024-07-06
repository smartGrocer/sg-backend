import "./App.css";
import CategoryList from "./components/CategoryList";
import ProductList from "./components/ProductList";
import SearchBar from "./components/SearchBar";

function App() {
	return (
		<>
			<SearchBar />
			<CategoryList />
			<h2 className="mb-2 text-center uppercase">{"{CategoryName}"}</h2>
			<ProductList />
		</>
	);
}

export default App;
