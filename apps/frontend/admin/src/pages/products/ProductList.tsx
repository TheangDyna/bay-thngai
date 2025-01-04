import { useProductsQuery } from "@/api/product.api";

const ProductListPage: React.FC = () => {
  const productsQuery = useProductsQuery();

  if (productsQuery.isLoading) return <p>Loading...</p>;
  if (productsQuery.isError) return <p>Error loading products</p>;

  console.log(productsQuery.data);

  return (
    <div>
      List - Product page!
      {/* <DataTable data={tasks} columns={columns} /> */}
    </div>
  );
};

export default ProductListPage;
