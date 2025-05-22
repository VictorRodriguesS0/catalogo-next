// app/components/SkeletonProductCard.tsx
export default function SkeletonProductCard() {
    return (
        <div className="animate-pulse rounded-xl border border-gray-200 p-4 shadow-sm">
            <div className="bg-gray-200 h-40 rounded-xl mb-4" />
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
            <div className="h-3 bg-gray-200 rounded w-1/2" />
        </div>
    );
}
