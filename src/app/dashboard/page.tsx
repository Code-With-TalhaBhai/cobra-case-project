import { Card,CardHeader,CardTitle,CardDescription,CardContent,CardFooter } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Table,TableRow, TableBody, TableCaption, TableCell, TableHead, TableHeader } from "@/components/ui/table"
import { db } from "@/db"
import { formatPrice } from "@/lib/utils"
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server"
import { notFound } from "next/navigation"
import StatusDropDown from "./StatusDropdown"



const Page = async()=>{
    const {getUser} = getKindeServerSession()
    const user = await getUser()

    const ADMIN_EMAIL = process.env.ADMIN_EMAIL

    // if (!user || !user.email){
    //     return notFound()
    // }

    const orders = await db.order.findMany({
        where: {
            isPaid: true,
            createdAt: {
                gte: new Date(new Date().setDate(new Date().getDate()-7))
            }
        },
        orderBy: {
            createdAt: 'asc'
        },
        include: {
            user: true,
            ShippingAddress: true
        }
    })

    const lastWeekProfit = await db.order.aggregate({
        where: {
            isPaid: true,
            createdAt: {
                gte: new Date(new Date().setDate(new Date().getDate()-7))
            }
        },
        _sum: {
            amount: true
        }
    })

    const lastMonthProfit = await db.order.aggregate({
        where: {
            isPaid: true,
            createdAt: {
                gte: new Date(new Date().setDate(new Date().getDate()-30))
            }
        },
        _sum: {
            amount: true
        }
    })

    const WEEKLY_GOAL = 500
    const MONTHLY_GOAL = 2000

    return (
        <div className="flex min-h-screen w-full bg-muted/40">
            <div className="max-w-7xl w-full mx-auto flex flex-col sm:gap-4 sm:py-4">
                <div className="flex flex-col gap-16">
                    <div className="grid gap-4 sm:grid-cols-2">
                    <Card >
                        <CardHeader className="pb-2">
                            <CardDescription>Last Week</CardDescription>
                            <CardTitle className="text-4xl">{formatPrice(lastWeekProfit._sum.amount!)}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-sm text-muted-foreground">
                                of {formatPrice(WEEKLY_GOAL)} goal
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Progress value={(lastWeekProfit._sum.amount ?? 0 / WEEKLY_GOAL)*100}/>
                        </CardFooter>
                    </Card>

                    <Card >
                        <CardHeader className="pb-2">
                            <CardDescription>Last Week</CardDescription>
                            <CardTitle className="text-4xl">{formatPrice(lastWeekProfit._sum.amount!)}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-sm text-muted-foreground">
                                of {formatPrice(MONTHLY_GOAL)} goal
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Progress value={(lastMonthProfit._sum.amount ?? 0 / MONTHLY_GOAL)*100}/>
                        </CardFooter>
                    </Card>
                    </div>

                    <h1 className="text-4xl font-bold tracking-tight">Incoming orders</h1>

                    <Table>
                        <TableHeader>
                            <TableRow>
                            <TableHead>Customer</TableHead>
                            <TableHead className="hidden sm:table-cell">Status</TableHead>
                            <TableHead className="hidden sm:table-cell">Purchase Date</TableHead>
                            <TableHead className="text-right">Amount</TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                        {orders.map((order)=>(
                            <TableRow key={order.id} className="bg-accent">
                            <TableCell>
                                <div className="font-medium">
                                    {order.ShippingAddress?.name}
                                </div>
                                <div className="hidden text-sm text-muted-foreground md:inline">
                                    {order.user.email}
                                </div>
                            </TableCell>
                            <TableCell className="hidden sm:table-cell"><StatusDropDown id={order.id} orderStatus={order.status}/></TableCell>
                            <TableCell className="hidden md:table-cell">{order.createdAt.toLocaleDateString()}</TableCell>
                            <TableCell className="text-right">{formatPrice(order.amount)}</TableCell>
                            </TableRow>
                        ))}
                        </TableBody>
                        </Table>

                </div>
            </div>
        </div>
    )
}


export default Page