import Link from "next/link";
import React from "react";


const data = [
    {
      name: "Men",
      dropItem: [
        { name: "SEO Services" },
        { name: "SMO Services" },
        { name: "Branding" },
        { name: "SEO Services" },
        { name: "SMO Services" },
        { name: "Branding" },
        { name: "SEO Services" },
        { name: "SMO Services" },
        { name: "Branding" },
        { name: "SEO Services" },
        { name: "SMO Services" },
        { name: "Branding" },
        { name: "SEO Services" },
        { name: "SMO Services" },
        { name: "Branding" },
        { name: "SEO Services" },
        { name: "SMO Services" },
        { name: "Branding" },
        { name: "SEO Services" },
        { name: "SMO Services" },
        { name: "Branding" },
        { name: "SEO Services" },
        { name: "SMO Services" },
        { name: "Branding" },
        { name: "SEO Services" },
        { name: "SMO Services" },
        { name: "SMO Services" },
        { name: "SEO Services" },
        { name: "SMO Services" },
      ],
    },
    {
      name: "Women",
      dropItem: [
        { name: "SEO Services" },
        { name: "SMO Services" },
        { name: "Branding" },
        { name: "SEO Services" },
        { name: "SMO Services" },
        { name: "Branding" },
      ],
    },
    {
      name: "Kids",
      dropItem: [
        { name: "SEO Services" },
        { name: "SMO Services" },
        { name: "Branding" },
      ],
    },
    {
      name: "Kids",
      dropItem: [
        { name: "SEO Services" },
        { name: "SMO Services" },
        { name: "Branding" },
      ],
    },
    {
      name: "Kids",
      dropItem: [
        { name: "SEO Services" },
        { name: "SMO Services" },
        { name: "Branding" },
      ],
    },
    {
      name: "Others",
      dropItem: [],
    },
  ];

function NavItems() {
  return (
    <ul className="flex items-start gap-x-6">
      {data.map((el, i) => (
        <li key={i} className="group cursor-pointer py-5 relative">
          <Link href="#" className="hover:text-blue-500 font-medium">
            {el.name}
          </Link>

          {el.dropItem.length > 0 && (
            <ul className="absolute left-0 top-full z-[999] hidden flex-col gap-2 bg-white py-2 shadow-lg group-hover:flex min-w-[200px]">
              <div
                className={`grid ${
                  el.dropItem.length > 30
                    ? "grid-cols-4 w-[800px]"
                    : el.dropItem.length > 20
                    ? "grid-cols-3 w-[600px]"
                    : el.dropItem.length > 10
                    ? "grid-cols-2 w-[400px]"
                    : "grid-cols-1 w-[200px]"
                }`}
              >
                {el.dropItem.map((item, j) => (
                  <li
                    key={j}
                    className="px-4 py-2 hover:bg-gray-100 text-sm whitespace-nowrap"
                  >
                    <Link className="max-w-full w-[200px] block" href="/">
                      {item.name}
                    </Link>
                  </li>
                ))}
              </div>
            </ul>
          )}
        </li>
      ))}
    </ul>
  );
}

export default NavItems;
