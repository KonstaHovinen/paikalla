export default function Loading() {
  return (
    <div className="max-w-4xl mx-auto w-full px-6 py-10 animate-pulse">
      <div className="grid grid-cols-1 md:grid-cols-[1fr_360px] gap-10 md:gap-16 items-start">
        <div className="space-y-10">
          <header>
            <div className="h-4 w-24 bg-secondary rounded-lg mb-6" />
            <div className="h-10 w-64 bg-secondary rounded-lg mb-4" />
            <div className="h-8 w-40 bg-secondary rounded-lg" />
          </header>
          
          <div className="space-y-4">
            <div className="h-6 w-32 bg-secondary rounded-lg" />
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 w-full bg-secondary rounded-xl" />
              ))}
            </div>
          </div>
        </div>

        <div className="md:mt-20">
          <div className="h-[400px] w-full bg-secondary/50 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
