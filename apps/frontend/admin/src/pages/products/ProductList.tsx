import { useProductsQuery } from "@/api/product.api";
import { columns } from "@/components/columns";
import { DataTable } from "@/components/DataTable";

const ProductListPage: React.FC = () => {
  const productsQuery = useProductsQuery();

  if (productsQuery.isLoading) return <p>Loading...</p>;
  if (productsQuery.isError) return <p>Error loading products</p>;

  console.log(productsQuery.data.data);

  return (
    <div>
      <DataTable data={productsQuery.data.data} columns={columns} />
    </div>
  );
};

export default ProductListPage;
