export default function Header() {
    return (
        <header className="bg-gray-800 text-white p-4">
            <div className="container mx-auto flex justify-between items-center">
                <h1 className="text-xl font-bold">QuickSurvey</h1>
                <nav>
                    <ul className="flex space-x-4">
                        <li><a href="/" className="hover:text-gray-300">Home</a></li>
                        <li><a href="/surveys" className="hover:text-gray-300">Surveys</a></li>
                        <li><a href="/login" className="hover:text-gray-300">Login</a></li>
                        <li><a href="/register" className="hover:text-gray-300">Register</a></li>
                    </ul>
                </nav>
            </div>
        </header>
    );
}