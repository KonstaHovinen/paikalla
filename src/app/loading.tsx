export default function Loading() {
  return (
    <div className="max-w-md mx-auto w-full px-6 py-16 animate-pulse">
      <div className="h-8 w-32 bg-secondary rounded-lg mb-4" />
      <div className="h-4 w-48 bg-secondary rounded-lg mb-12" />
      
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-20 w-full bg-secondary rounded-xl" />
        ))}
      </div>
    </div>
  );
}
