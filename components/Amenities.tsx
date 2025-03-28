import { Bed, Shield, Utensils, Wifi, Mountain, Lock } from "lucide-react";

const Amenities = () => {
  const amenities = [
    {
      icon: <Bed className="w-10 h-10" />,
      title: "Luxurious Bedrooms",
      description:
        "Spacious bedrooms with premium bedding and stunning views for ultimate comfort.",
    },
    {
      icon: <Shield className="w-10 h-10" />,
      title: "Private Pool",
      description:
        "Enjoy our infinity pool overlooking the breathtaking landscape.",
    },
    {
      icon: <Utensils className="w-10 h-10" />,
      title: "Gourmet Kitchen",
      description:
        "Fully equipped kitchen with high-end appliances for your culinary adventures.",
    },
    {
      icon: <Wifi className="w-10 h-10" />,
      title: "High-Speed WiFi",
      description:
        "Stay connected with complimentary high-speed internet throughout the property.",
    },
    {
      icon: <Mountain className="w-10 h-10" />,
      title: "Scenic Views",
      description:
        "Panoramic views of the surrounding landscape from every room.",
    },
    {
      icon: <Lock className="w-10 h-10" />,
      title: "24/7 Security",
      description:
        "Round-the-clock security for your peace of mind during your stay.",
    },
  ];
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Villa Amenities</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Our villa offers a range of premium amenities to make your stay
            comfortable and memorable.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {amenities.map((amenity, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex flex-col items-start"
            >
              <div className="mb-4">{amenity.icon}</div>
              <h3 className="text-xl font-bold mb-2">{amenity.title}</h3>
              <p className="text-gray-600">{amenity.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Amenities;
