import Link from "next/link";

const PRODUCTS = [
  { id: 1, name: "Why Money Matters" },
  { id: 2, name: "How to become a good web developer" },
  { id: 3, name: "Front End Development" },
];

export default function BlogPage() {
  return (
    <div>
      {PRODUCTS.map((prod) => (
        <p>
          <Link href={`/blog/${prod.id}`} key={prod.id}>
            {prod.name}
          </Link>
        </p>
      ))}
    </div>
  );
}
