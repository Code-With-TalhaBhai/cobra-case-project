'use client'
import { HTMLAttributes, useEffect, useRef, useState } from "react"
import MaxWidthWrapper from "./MaxWidthWrapper"
import { useInView } from "framer-motion"
import IPhone from "./IPhone"
import { cn } from "@/lib/utils"

const PHONES = [
    '/testimonials/1.jpg',
    '/testimonials/2.jpg',
    '/testimonials/3.jpg',
    '/testimonials/4.jpg',
    '/testimonials/5.jpg',
    '/testimonials/6.jpg',
  ]

// Reviews->ReviewGrid(SplitArray)->ReviewColumn->Review
function SplitArray(arr:Array<string>,no_of_cols:number){
    const result : Array<Array<string>> = []
    for(let i = 0; i < arr.length; i++){
        const idx = i % no_of_cols
        if (!(result[idx])){
            result[idx] = []
        }
        result[idx].push(arr[i])
    }
    return result
}


function Review({imgSrc,className}:{imgSrc:string,className?:string}){
    const POSSIBLE_ANIMATION_DELAYS = [
        '0s',
        '0.1s',
        '0.2s',
        '0.3s',
        '0.4s',
        '0.5s',
      ]

  const animation_delay = POSSIBLE_ANIMATION_DELAYS[Math.floor(Math.random()*POSSIBLE_ANIMATION_DELAYS.length)]
    return (
        <div 
        className={cn("animate-fade-in rounded-[2.25rem] p-6 bg-white shadow-xl opacity-0 shadow-slate-900/5",className)}
        style={{animationDelay: animation_delay}}
        >
            <IPhone imgSrc={imgSrc}/>
        </div>
    )
}


function ReviewColumn({reviews,className,reviewClassName,msPerPixel=0}:{reviews:string[],className?:string,reviewClassName?:(reviewIndex:number)=>string,msPerPixel:number}){
    const columnRef = useRef<HTMLDivElement | null>(null)
    const [columnHeight, setColumnHeight] = useState(0)
    const duration = `${columnHeight * msPerPixel}ms`

    useEffect(()=>{
        if (!columnRef.current) return 
        const resizeObserver = new window.ResizeObserver(()=>{
            setColumnHeight(columnRef.current?.offsetHeight ?? 0)
        })
        resizeObserver.observe(columnRef.current)

        return ()=>{
            resizeObserver.disconnect()
        }
    },[])


    return (
        <div
        ref={columnRef}
        className={cn("animate-marquee space-y-8 py-4",className)}
        style={{'--marquee-duration':duration} as React.CSSProperties}
        >
        {
            reviews.concat(reviews).map((img_src:any,index:number)=>(
            <Review
            key={index}
            className={reviewClassName?.(index%reviews.length)}
            imgSrc={img_src}/>
        ))
        }
        </div>
    )
}

function ReviewGrid(){
    const containerRef = useRef<HTMLDivElement | null>(null)
    const isInView = useInView(containerRef,{once:true, amount:0.4})
    const columns = SplitArray(PHONES,3)
    const column1 = columns[0]
    const column2 = columns[1]
    const column3 = SplitArray(columns[2],2)

    return (
        <div ref={containerRef} className="relative -mx-4 mt-16 grid h-[49rem] max-h-[150vh] grid-cols-1 items-start gap-8 overflow-hidden px-4 sm:mt-20 md:grid-cols-2 lg:grid-cols-3">
            {isInView ?
                (
                <>
                <ReviewColumn
                    reviews = {[...column1,...column3.flat(),...column2]}
                    reviewClassName={(reviewIndex)=>cn(
                        {
                            'md:hidden': reviewIndex >= column1.length + column3[0].length,
                            'lg:hidden': reviewIndex >= column1.length
                        }
                    )}
                    msPerPixel={10}
                 />
                <ReviewColumn
                    reviews = {[...column2,...column3[1]]}
                    className='hidden md:block'
                    reviewClassName={(reviewIndex)=>
                        reviewIndex >= column2.length ? 'lg:hidden' : ''
                    }
                    msPerPixel={15}
                 />
                <ReviewColumn
                    reviews = {[...column3.flat()]}
                    className='hidden md:block'
                    msPerPixel={10}
                 />
                </>
            ): null}
            <div className="pointers-event-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-slate-100"/>
            <div className="pointers-event-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-slate-100"/>
        </div>
    )
}


const Reviews = ()=>{
    return (
        <MaxWidthWrapper className="relative max-w-5xl">
            <img 
            src="/what-people-are-buying.png"
            alt="buying" 
            className="absolute select-none hidden xl:block -left-32 top-1/3"
        />
        <ReviewGrid/>
        </MaxWidthWrapper>
    )
}


export default Reviews