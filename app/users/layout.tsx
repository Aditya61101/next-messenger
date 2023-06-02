import Sidebar from "../components/Sidebar/Sidebar"

export default async function UsersLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        //@ts-expect-error Server component
        <Sidebar>
        <main className="h-full">
            {children}
        </main>
        </Sidebar>
    )
}