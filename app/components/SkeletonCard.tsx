// app/components/SkeletonCard.tsx
export default function SkeletonCard() {
    return (
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm animate-pulse">
            <div className="h-4 w-3/4 bg-gray-200 rounded mb-2"></div>
            <div className="h-3 w-full bg-gray-200 rounded mb-1"></div>
            <div className="h-3 w-1/2 bg-gray-200 rounded"></div>
        </div>
    );
}
