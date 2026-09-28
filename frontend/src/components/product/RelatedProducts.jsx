import { useEffect, useState } from "react";
import { getRelatedProducts } from "../../services/productService";
import ProductCard from "../home/ProductCard";

function RelatedProducts({ currentProduct }) {
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    if (!currentProduct?.category) return;

    const fetchRelated = async () => {
      try {
        const products = await getRelatedProducts(
          currentProduct.category,
          currentProduct.id,
          5
        );

        setRelatedProducts(products);
      } catch (err) {
        console.error("Related products fetch error:", err);
        setRelatedProducts([]);
      }
    };

    fetchRelated();
  }, [currentProduct]);

  if (relatedProducts.length === 0) return null;

  return (
    <section className="mt-24 max-w-7xl mx-auto px-6">
      <h2 className="text-4xl font-bold mb-10">
        Related Products
      </h2>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
        {relatedProducts.map((product) => (
          <ProductCard
            key={product._id}
            product={{ ...product, id: product._id }}
          />
        ))}
      </div>
    </section>
  );
}

export default RelatedProducts;
