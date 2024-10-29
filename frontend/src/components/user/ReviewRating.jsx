import { Star, ThumbsUp, ThumbsDown, ChevronDown } from "lucide-react";

export default function Component() {
  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 bg-white shadow-lg rounded-lg">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h2 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-0">
          Ratings & Reviews
        </h2>
        <button className="w-full sm:w-auto px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors">
          Rate Product
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        <div>
          <div className="flex items-center mb-4">
            <span className="text-4xl sm:text-5xl font-bold mr-2">4.3</span>
            <Star className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-400 fill-current" />
          </div>
          <p className="text-xs sm:text-sm text-gray-600 mb-4">
            11,815 Ratings & 725 Reviews
          </p>
          {[5, 4, 3, 2, 1].map((rating) => (
            <div key={rating} className="flex items-center mb-2">
              <span className="w-3 text-sm">{rating}</span>
              <Star className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 ml-1" />
              <div className="w-full bg-gray-200 rounded-full h-1.5 sm:h-2 ml-2">
                <div
                  className="bg-green-500 h-1.5 sm:h-2 rounded-full"
                  style={{
                    width: `${
                      rating === 5
                        ? 70
                        : rating === 4
                        ? 20
                        : rating === 3
                        ? 5
                        : 2
                    }%`,
                  }}
                ></div>
              </div>

              <span className="ml-2 text-xs sm:text-sm text-gray-600">
                {rating === 5
                  ? "7,720"
                  : rating === 4
                  ? "2,133"
                  : rating === 3
                  ? "685"
                  : rating === 2
                  ? "335"
                  : "945"}
              </span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4">
          {["Camera", "Battery", "Display", "Design"].map((feature, index) => (
            <div key={feature} className="flex flex-col items-center">
              <div className="relative w-16 h-16 sm:w-20 sm:h-20">
                <svg className="w-full h-full" viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#E5E7EB"
                    strokeWidth="3"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#10B981"
                    strokeWidth="3"
                    strokeDasharray={`${[80, 76, 88, 88][index]}, 100`}
                  />
                </svg>

                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-base sm:text-lg font-semibold">
                  {[4.0, 3.8, 4.4, 4.4][index]}
                </div>
              </div>
              <span className="mt-2 text-xs sm:text-sm font-medium text-center">
                {feature}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* <div className="mt-6 sm:mt-8 grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="aspect-square bg-gray-200 rounded-lg overflow-hidden"
          >
            <img
              src={`/placeholder.svg?height=100&width=100`}
              alt={`Product image ${i + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div> */}

      <div className="mt-6 sm:mt-8 space-y-6">
        {[
          {
            rating: 4,
            title: "Good choice",
            pros: "Crisp display, Camera performed way better than my expectations. Battery lasted for 1.5 days after decent usage. Face detection and fingerprint sensors works swiftly.",
            cons: "Heating issue when camera is kept on for 10 mins and beyond. Camera app takes 3-5 secs to start which feels like phone is hung. No inbuilt gallery app, you have to use google photos app",
            author: "Sarthak Pandit",
            date: "1 month ago",
            likes: 431,
            dislikes: 114,
          },
          {
            rating: 5,
            title: "Excellent",
            pros: "Your phone comes with RAM boost ON when you get it. Turning it off when you get it in your hands will make it run smoother and the heating issue will resolve.",
            author: "ABHIJITH MADHU",
            date: "1 month ago",
            likes: 208,
            dislikes: 43,
          },
        ].map((review, index) => (
          <div key={index} className="border-t pt-4 sm:pt-6">
            <div className="flex items-center mb-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 sm:w-5 sm:h-5 ${
                    i < review.rating
                      ? "text-yellow-400 fill-current"
                      : "text-gray-300"
                  }`}
                />
              ))}

              <span className="ml-2 text-base sm:text-lg font-semibold">
                {review.title}
              </span>
            </div>
            <p className="mb-2 text-sm sm:text-base">
              <span className="font-semibold">Pros:</span> {review.pros}
            </p>
            {review.cons && (
              <p className="mb-2 text-sm sm:text-base">
                <span className="font-semibold">Cons:</span> {review.cons}
              </p>
            )}
            <div className="flex items-center text-xs sm:text-sm text-gray-600">
              <span>{review.author}</span>
              <span className="mx-2">•</span>
              <span>{review.date}</span>
            </div>
            <div className="mt-2 flex items-center space-x-4">
              <button className="flex items-center text-xs sm:text-sm text-gray-600">
                <ThumbsUp className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                {review.likes}
              </button>
              <button className="flex items-center text-xs sm:text-sm text-gray-600">
                <ThumbsDown className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                {review.dislikes}
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 sm:mt-8 flex items-center justify-center">
        <button className="flex items-center px-4 py-2 border rounded-full text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
          <span>Show more reviews</span>
          <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4 ml-1" />
        </button>
      </div>
    </div>
  );
}
