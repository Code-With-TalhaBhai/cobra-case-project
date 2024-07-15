import Image from "next/image";
import { twMerge } from "tailwind-merge";
import MaxWidthWrapper from "@/components/MaxWidthWrapper"


export default function Home(props:any) {
  console.log(props)
  return (
    <main className='bg-slate-50'>
      <section>
        <MaxWidthWrapper className="pb-24 pt-10 lg:grid lg:grid-rows-3 sm:pb-32 lg:gap-x-0 xl:gap-x-8 lg:pt-24 xl:pt-32 lg:pb-52">
          <div>This is good</div>
        </MaxWidthWrapper>
      </section>
    </main>
  );
}
