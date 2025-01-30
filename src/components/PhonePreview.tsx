'use client'

import { CaseColor } from "@prisma/client"
import { useEffect, useRef, useState } from "react"
import { AspectRatio } from "./ui/aspect-ratio"
import { COLORS } from "@/config/colors"
import { cn } from "@/lib/utils"


export default function PhonePreview({croppedImageUrl,color}:{croppedImageUrl:string,color:CaseColor}){
    const ref = useRef<HTMLDivElement>(null)
    const [renderedDimensions,setRenderedDimensions] = useState({
        width: 0,
        height: 0
    })

    const caseBackgroundColor = COLORS[color].tw

    const handleResize = ()=>{
        if (!ref.current) return
        const {width, height} : any = ref.current?.getBoundingClientRect()
        setRenderedDimensions({width,height})
    }

    useEffect(()=>{
        handleResize()
        // element.getBoundingClientRect() -> used to find 
    },[ref.current])


    return (
        <AspectRatio ref={ref} ratio={3000 / 2001} className="relative">
            <div 
            className="absolute z-20 scale-[1.0352]"
            style={{
                left: renderedDimensions.width / 2 - renderedDimensions.width / (1216/121),
                top: renderedDimensions.height / 6.22
            }}
            >
                <img width={renderedDimensions.width / (3000 / 637)}
                className={cn("phone-skew relative z-20 rounded-t-[15px] rounded-b-[10px] md:rounded-t-[30px] md:rounded-b-[20px]",`bg-${caseBackgroundColor}`)}
                src={croppedImageUrl} alt="" />
            </div>

            <div className="relative h-full w-full z-40">
                <img 
                src="/clearphone.png"
                className="pointer-events-none h-full w-full antialiased rounded-md"
                alt="phone" />
            </div>

        </AspectRatio>
    )
}