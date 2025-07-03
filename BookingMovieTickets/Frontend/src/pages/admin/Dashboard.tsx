import {
  Calendar,
  Film,
  MapPin,
  Ticket,
  Users,
  Bell,
  DollarSign,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { AdminLayout } from "../../layouts/AdminLayout";
import { Avatar, AvatarFallback } from "../../components/ui/avatar";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { TrendingUp, TrendingDown } from "lucide-react";

// StatsCard component
function StatsCard({ title, value, change, icon: Icon, trend }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground flex items-center gap-1">
          {trend === "up" ? (
            <TrendingUp className="h-3 w-3 text-green-500" />
          ) : (
            <TrendingDown className="h-3 w-3 text-red-500" />
          )}
          {change}
        </p>
      </CardContent>
    </Card>
  );
}

// RevenueChart component
function RevenueChart() {
  const data = [
    { name: "Jan", total: 12000 },
    { name: "Feb", total: 15000 },
    { name: "Mar", total: 18000 },
    { name: "Apr", total: 22000 },
    { name: "May", total: 25000 },
    { name: "Jun", total: 28000 },
    { name: "Jul", total: 32000 },
    { name: "Aug", total: 35000 },
    { name: "Sep", total: 30000 },
    { name: "Oct", total: 38000 },
    { name: "Nov", total: 42000 },
    { name: "Dec", total: 45000 },
  ];
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `$${value}`}
        />
        <Bar dataKey="total" fill="#dc2626" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

// RecentBookings component
function RecentBookings() {
  const bookings = [
    {
      id: "1",
      customer: "John Doe",
      movie: "Avengers: Endgame",
      amount: "$24.00",
      time: "2 hours ago",
    },
    {
      id: "2",
      customer: "Jane Smith",
      movie: "Dune: Part Two",
      amount: "$42.00",
      time: "4 hours ago",
    },
    {
      id: "3",
      customer: "Mike Johnson",
      movie: "The Batman",
      amount: "$26.00",
      time: "6 hours ago",
    },
    {
      id: "4",
      customer: "Sarah Wilson",
      movie: "Oppenheimer",
      amount: "$18.00",
      time: "8 hours ago",
    },
    {
      id: "5",
      customer: "Tom Brown",
      movie: "Barbie",
      amount: "$30.00",
      time: "10 hours ago",
    },
  ];
  return (
    <div className="space-y-8">
      {bookings.map((booking) => (
        <div key={booking.id} className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarFallback>
              {booking.customer
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">
              {booking.customer}
            </p>
            <p className="text-sm text-muted-foreground">{booking.movie}</p>
          </div>
          <div className="ml-auto font-medium">{booking.amount}</div>
        </div>
      ))}
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome to the Cinema Admin Dashboard
          </p>
        </div>
        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Revenue"
            value="$45,231.89"
            change="+20.1% from last month"
            icon={DollarSign}
            trend="up"
          />
          <StatsCard
            title="Total Bookings"
            value="2,350"
            change="+180.1% from last month"
            icon={Ticket}
            trend="up"
          />
          <StatsCard
            title="Active Users"
            value="12,234"
            change="+19% from last month"
            icon={Users}
            trend="up"
          />
          <StatsCard
            title="Movies Showing"
            value="23"
            change="+2 new this week"
            icon={Film}
            trend="up"
          />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Revenue Overview</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              <RevenueChart />
            </CardContent>
          </Card>
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Recent Bookings</CardTitle>
              <CardDescription>
                Latest ticket bookings from customers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RecentBookings />
            </CardContent>
          </Card>
        </div>
        {/* Quick Actions */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="cursor-pointer hover:bg-accent transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Manage Movies
              </CardTitle>
              <Film className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">23</div>
              <p className="text-xs text-muted-foreground">Active movies</p>
            </CardContent>
          </Card>
          <Card className="cursor-pointer hover:bg-accent transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Manage Cinemas
              </CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5</div>
              <p className="text-xs text-muted-foreground">Cinema locations</p>
            </CardContent>
          </Card>
          <Card className="cursor-pointer hover:bg-accent transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Showtimes</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">156</div>
              <p className="text-xs text-muted-foreground">This week</p>
            </CardContent>
          </Card>
          <Card className="cursor-pointer hover:bg-accent transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Notifications
              </CardTitle>
              <Bell className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">Pending alerts</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
