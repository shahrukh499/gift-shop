"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { API_CONFIG, getApiUrl } from "./utils/apiConfig";
import AddCartsButton from "./components/products/AddCartsButton";
import Link from "next/link";
import { Splide, SplideSlide } from '@splidejs/react-splide';
import CategoryTab from "./components/home/CategoryTab";

export default function Home() {
  const [products, setProducts] = useState([])
  const [productSize, setProductSize] = useState('M')
  useEffect(() => {
    const allProducts = async () => {
      try {
        const apiUri = getApiUrl(API_CONFIG.ENDPOINTS.ALLPRODUCTS);
        const requestOptions = API_CONFIG.createRequestOptions(
          API_CONFIG.HTTP_METHODS.GET
        );
        const response = await fetch(apiUri, requestOptions);
        const data = await response.json();
        setProducts(data)
      } catch (e) {
        console.log("somthing error")
      }
    }
    allProducts();
  }, [])


  return (
    <section>
      <Splide
        options={{
          rewind: true,
          gap: '1rem',
        }}
        aria-label="My Favorite Images"
      >
        <SplideSlide>
          <Image className="block m-auto" src='/assets/img/1900X600.webp' alt="Image 1" width={1900} height={600} />
        </SplideSlide>
        <SplideSlide>
          <Image className="block m-auto" src='/assets/img/1900X600.webp' alt="Image 1" width={1900} height={600} />
        </SplideSlide>
        <SplideSlide>
          <Image className="block m-auto" src='/assets/img/1900X600.webp' alt="Image 1" width={1900} height={600} />
        </SplideSlide>
      </Splide>
      <section className="py-6 lg:py-12">
        <div className="container mx-auto px-3">
          <div className="flex flex-wrap justify-center gap-y-4 gap-x-4">
            <div className="w-full md:w-[30%]">
              <div className="flex gap-2 items-center lg:justify-center">
                <Image src='/assets/img/handcart.png' alt="Image 1" width={100} height={100} />
                <div className="mb-2">
                  <p className="text-2xl font-bold">Fast Delivery</p>
                  <p>Fast delivery on all orders</p>
                </div>
              </div>
            </div>
            <div className="w-full md:w-[30%]">
              <div className="flex gap-2 items-center lg:justify-center">
                <Image src='/assets/img/wallet.png' alt="Image 1" width={100} height={100} />
                <div>
                  <p className="text-2xl font-bold">Secure Payment</p>
                  <p>Flexible & Secure payment on all orders</p>
                </div>
              </div>
            </div>
            <div className="w-full md:w-[30%]">
              <div className="flex gap-2 items-center lg:justify-center">
                <Image src='/assets/img/call-male.png' alt="Image 1" width={100} height={100} />
                <div>
                  <p className="text-2xl font-bold">24/7 Support</p>
                  <p>24/7 Support on all orders</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* <section className="pb-3">
          <div className="container mx-auto px-2">
            <div className="flex flex-wrap justify-center gap-y-4">
              <div className="w-full md:w-[46%] 2xl:w-[45.5%] px-1.5">
                <Image src='/assets/img/1000X1200.webp' alt="Image 1" width={1000} height={1200}/>
              </div>
              <div className="w-full md:w-[54%] 2xl:w-[54.5%] px-1.5">
                <Image className="mb-3" src='/assets/img/800X400.webp' alt="Image 1" width={800} height={400}/>
                <Image src='/assets/img/800X400.webp' alt="Image 1" width={800} height={400}/>
              </div>
            </div>
          </div>
        </section> */}

      <section>
        <div className="container mx-auto px-2">
          <div className="flex flex-wrap justify-center gap-y-4">
            <div className="w-full md:w-[35%] 2xl:w-[35%] px-1.5">
              <Image src='/assets/img/1000X1000.webp' alt="Image 1" width={1000} height={1000} />
            </div>
            <div className="w-full md:w-[65%] 2xl:w-[65%] px-1.5">
              <div className="flex gap-x-3 mb-3">
                <div>
                  <Image src='/assets/img/800X400.webp' alt="Image 1" width={800} height={400} />
                </div>
                <div>
                  <Image src='/assets/img/800X400.webp' alt="Image 1" width={800} height={400} />
                </div>
              </div>
              <div>
                <Image src='/assets/img/1200X325.webp' alt="Image 1" width={1200} height={330} />
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <section>
        <div className="container mx-auto px-4">
          <div className="py-3">
            <h2 className="text-center text-[20px] md:text-[30px] font-semibold">Feature Products</h2>
          </div>
          <CategoryTab
            products={products}
          />
        </div>
      </section>

      <section className="pt-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-y-3">
            <div className="w-full lg:w-[50%] px-1.5">
              <Image src='/assets/img/800X400.webp' alt="800X400" width={800} height={400} />
            </div>
            <div className="w-full lg:w-[50%] px-1.5">
              <Image src='/assets/img/800X400.webp' alt="800X400" width={800} height={400} />
            </div>
          </div>
        </div>
      </section>
        <section className="pt-6">
          <div className="container mx-auto px-4">
            <Splide
              options={{
                rewind: true,
                gap: '1rem',
                perPage: 5,
                breakpoints:{
                  1440:{
                    perPage: 4
                  },
                  1200:{
                    perPage: 3
                  },
                  500:{
                    perPage: 1
                  }
                }
              }}
              aria-label="My Favorite Images"
            >
              {
                [...Array(10)].map((_,i)=>{
                  return(
                    <SplideSlide key={i}>
                      <Image className="block m-auto" src='/assets/img/500X500.webp' alt="Image 1" width={500} height={500} />
                    </SplideSlide>

                  )
                })
              }
            </Splide>
          </div>
        </section>

        <section className="py-6">
          <div className="container mx-auto px-4">
              <Image src='/assets/img/1900X400.webp' alt="" width={1900} height={400}/>
          </div>
        </section>

      <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">

          <ul>
            <li>
              <Link href={`/category/nike?brand=Nike`}>Nike</Link>
            </li>
            <li>
              <Link href="/category/adidas?brand=adidas">Adidas</Link>
            </li>
          </ul>

          <div>
            {
              products?.products?.map((items, i) => {
                return (
                  <div key={i} className="max-w-sm bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700 mb-2">
                    <div className="p-5">
                      <Link href={`/products/${items._id}`}>
                        <Image className="mx-auto" src={items.images[0]} alt="" width={300} height={400} />
                      </Link>
                      <Link href={`/products/${items._id}`}>
                        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{items.name}</h5>
                      </Link>
                      <p className="mb-3 font-normal text-gray-700 dark:text-gray-400 line-clamp-2">{items.description}</p>
                      <p>{productSize}</p>
                      <AddCartsButton products={items._id} productSize={productSize} />
                    </div>
                  </div>
                )
              })
            }
          </div>


        </main>
        <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
          <a
            className="flex items-center gap-2 hover:underline hover:underline-offset-4"
            href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              aria-hidden
              src="/file.svg"
              alt="File icon"
              width={16}
              height={16}
            />
            Learn
          </a>
          <a
            className="flex items-center gap-2 hover:underline hover:underline-offset-4"
            href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              aria-hidden
              src="/window.svg"
              alt="Window icon"
              width={16}
              height={16}
            />
            Examples
          </a>
          <a
            className="flex items-center gap-2 hover:underline hover:underline-offset-4"
            href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              aria-hidden
              src="/globe.svg"
              alt="Globe icon"
              width={16}
              height={16}
            />
            Go to nextjs.org →
          </a>
        </footer>
      </div>
    </section>
  );
}
