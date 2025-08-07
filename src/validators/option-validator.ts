import { PRODUCT_PRICES } from "@/config/products"

export const COLORS = [
    {label: "Black", value: 'black', tw:'zinc-900'},
    {label: "Blue", value: 'blue', tw:'blue-950'},
    {label: "Rose", value: 'rose', tw:'rose-950'},
    {label: "Violet", value: 'violet', tw:'indigo-900'},
    {label: "Lime", value: 'lime', tw:'lime-600'},
    {label: "Fuchsia", value: 'fuchsia', tw:'fuchsia-900'},
    {label: "Pink", value: 'pink', tw:'pink-500'},
    {label: "Green", value: 'green', tw:'green-600'},
    {label: "Cyan", value: 'cyan', tw:'cyan-500'},
    {label: "Yellow", value: 'yellow', tw:'yellow-400'},
    {label: "Red", value: 'red', tw:'red-500'},
    {label: "Emerald", value: 'emerald', tw:'emerald-400'},
    {label: "Gray", value: 'gray', tw:'gray-600'},
] as const


export const MODELS = {
    name: 'models',
    options: [
        {
            label: 'iPhone X',
            value: 'iphonex'
        },
        {
            label: 'iPhone 11',
            value: 'iphone11'
        },
        {
            label: 'iPhone 12',
            value: 'iphone12'
        },
        {
            label: 'iPhone 13',
            value: 'iphone13'
        },
        {
            label: 'iPhone 14',
            value: 'iphone14'
        },
        {
            label: 'iPhone 15',
            value: 'iphone15'
        },
    ]
} as const


export const MATERIALS = {
    name: 'materials',
    options: [
        {
            label: 'Silicone',
            value: 'silicone',
            description: undefined,
            price: PRODUCT_PRICES.material.silicone
        },
        {
            label: 'Soft Polycarbonate',
            value: 'polycarbonate',
            description: 'Scratch-resistant coating',
            price: PRODUCT_PRICES.material.polycarbonate
        }
    ]
} as const


export const FINISHES = {
    name: 'finish',
    options: [
        {
            label: 'Smooth Finish',
            value: 'smooth',
            description: undefined,
            price: PRODUCT_PRICES.finish.smooth
        },
        {
            label: 'Textured Finish',
            value: 'textured',
            description: 'Soft-grippy texture',
            price: PRODUCT_PRICES.finish.textured
        }
    ]
} as const