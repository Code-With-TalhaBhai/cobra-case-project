import Image from "next/image";
import { twMerge } from "tailwind-merge";
import MaxWidthWrapper from "@/components/MaxWidthWrapper"
import { Check, Star } from "lucide-react";
import Iphone from "@/components/IPhone";


export default function Home(props:any) {
  return (
    <main className='bg-slate-50'>
      <section>
        <MaxWidthWrapper className="pb-24 pt-10 lg:grid lg:grid-cols-3 sm:pb-32 lg:gap-x-0 xl:gap-x-8 lg:pt-24 lg:pb-52">
          <div className="col-span-2 px-6 lg:px-0 lg:pt-4">
            <div className="relative mx-auto text-center lg:text-left flex flex-col items-center lg:items-start">
              <div className="absolute left-0 -top-20 w-28 hidden lg:block">
                <img src="/snake-1.png" className="w-full"/>              
              </div>

              <h1 className="relative w-fit tracking-tight text-balance font-bold mt-16 !leading-tight text-gray-900 text-5xl md:text-6xl lg:text-7xl">
                Your Image on a {' '}
                <span className="bg-green-600 px-2 text-white">Custom</span>
                {' '}
                Phone Case
              </h1>

              <p className="mt-8 text-lg lg:pr-10 max-w-prose text-center lg:text-left text-balance md:text-wrap">
                Capture your favorite memories with your own, {' '} 
                <span className="font-semibold">one-of-one</span>
                {' '}
                phone case. CaseCobra allows you to protect your memories, not just your phone.
              </p>

              <ul className="mt-8 space-y-2 text-left font-medium flex flex-col items-center sm:items-start">
                 <div className="space-y-2 parent-li"> {/* parent-li and check-icon in globals.css */}
                    <li>
                      <Check className="check-icon"/>
                      High-quality, durable material
                    </li>
                    <li>
                    <Check className="check-icon"/>
                      5 year print gurantee
                    </li>
                    <li>
                    <Check className="check-icon"/>
                    Modern iPhone models supported
                    </li>
                </div>
              </ul>

              <div className="mt-12 flex flex-col sm:flex-row items-center sm:items-start gap-5">
                <div className="flex -space-x-4 user-img">
                  <img src="/users/user-1.png" alt="my-user" />
                  <img src="/users/user-2.png" alt="my-user" />
                  <img src="/users/user-3.png" alt="my-user" />
                  <img src="/users/user-4.jpg" alt="my-user" />
                  <img className="object-cover" src="/users/user-5.jpg" alt="my-user" />
                </div>
              <div className="flex flex-col justify-between items-center sm:items-start">
                <div className="flex gap-0.5 star-icon">
                  <Star/>
                  <Star/>
                  <Star/>
                  <Star/>
                  <Star/>
                </div>
                <p>
                  <span className="font-semibold">1,250</span>
                  {' '}happy customers
                </p>
              </div>
              </div>
            </div>  
          </div>

          {/* col-span-full-> span across all element */}
          <div className="col-span-full lg:col-span-1 w-full flex justify-center px-8 sm:px-16 md:px-0 mt-32 lg:mx-0 lg:mt-20 h-fit">
            <div className="relative md:max-w-full">
              <img className="absolute w-40 lg:w-52 left-48 -top-32 select-none hidden sm:block lg:hidden xl:block" src="/your-image.png" alt="" />
              <img className="absolute w-20 -left-6 -bottom-6 select-none" src="/line.png" alt="" />
              <Iphone className="w-64" imgSrc="/testimonials/1.jpg"/>
            </div>
          </div>


        </MaxWidthWrapper>
      </section>
    </main>
  );
}
