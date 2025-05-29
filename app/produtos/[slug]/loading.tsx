export default function Loading() {
    return (
        <div className="max-w-6xl mx-auto p-6 animate-pulse space-y-10">
            <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gray-200 h-64 rounded-lg" />
                <div className="space-y-4">
                    <div className="h-8 bg-gray-200 rounded w-3/4" />
                    <div className="h-5 bg-gray-200 rounded w-1/2" />
                    <div className="h-5 bg-gray-200 rounded w-1/3" />
                    <div className="h-10 bg-blue-200 rounded w-full" />
                </div>
            </div>
            <div className="flex justify-center pt-4">
                <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </div>
        </div>
    );
}
