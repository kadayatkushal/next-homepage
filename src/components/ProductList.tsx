"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import Pagination from "./Pagination";

const PRODUCT_PER_PAGE = 8;

interface Product {
  id: number; 
  name: string;
  price: number;
  image: string;
  slug: string;
}

const ProductList = ({ searchParams }: { searchParams?: any }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrev, setHasPrev] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/products/?page=${currentPage}&limit=${PRODUCT_PER_PAGE}`
        );
        // Check if the response is valid before updating state
        if (response.data && Array.isArray(response.data.results)) {
          setProducts(response.data.results);
          setHasNext(response.data.next !== null);
          setHasPrev(response.data.previous !== null);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, [currentPage]);

  return (
    <div className="mt-12 flex gap-x-8 gap-y-16 justify-between flex-wrap">
      {/* Ensure products is always an array before calling map */}
      {products?.map((product) => (
        <Link
          href={`/product/${product.slug}`}
          className="w-full flex flex-col gap-4 sm:w-[45%] lg:w-[22%]"
          key={product.id}
        >
          <div className="relative w-full h-80">
            <Image
              src={product.image || "/product.png"}
              alt={product.name}
              fill
              sizes="25vw"
              className="absolute object-cover rounded-md z-10 hover:opacity-0 transition-opacity ease duration-500"
            />
          </div>
          <div className="flex justify-between">
            <span className="font-medium">{product.name}</span>
            <span className="font-semibold">${product.price}</span>
          </div>
          <button className="rounded-2xl ring-1 ring-lama text-lama w-max py-2 px-4 text-xs hover:bg-lama hover:text-white">
            Add to Cart
          </button>
        </Link>
      ))}

      <Pagination
        currentPage={currentPage}
        hasPrev={hasPrev}
        hasNext={hasNext}
        onPrev={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
        onNext={() => setCurrentPage((prev) => prev + 1)}
      />
    </div>
  );
};

export default ProductList;

// import Image from "next/image";
// import Link from "next/link";

// const ProductList = () => {
//     return (
//         <div className="mt-12 flex gap-x-8 gap-y-16 justify-between flex-wrap">
//             <Link href="/test" className="relative w-full h-80">
//                 <Image
//                     src="https://images.pexels.com/photos/20684681/pexels-photo-20684681/free-photo-of-a-close-up-of-a-flower-on-a-branch.jpeg?auto=compress&cs=tinysrb&w=800&lazy=load"
//                     alt=""
//                     fill
//                     sizes="25vw"
//                 />
//             </Link>
//         </div>
//     );
// };

// export default ProductList;
