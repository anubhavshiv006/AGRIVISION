const fs = require('fs');
let code = fs.readFileSync('src/pages/Market.tsx', 'utf8');

// Insert tab
code = code.replace(
  "{isEn ? 'Mandi Prices' : 'मंडी भाव'}\n        </button>",
  "{isEn ? 'Mandi Prices' : 'मंडी भाव'}\n        </button>\n        <button\n          onClick={() => setActiveTab('rentals')}\n          className={cn(\"px-4 py-2 rounded-xl font-medium transition-colors flex items-center gap-2\", activeTab === 'rentals' ? \"bg-emerald-600 text-white\" : \"bg-white text-gray-600 border border-gray-200 hover:bg-gray-50\")}\n        >\n          <Tractor className=\"w-4 h-4\" />\n          {isEn ? 'Rentals (P2P)' : 'किराये पर (P2P)'}\n        </button>"
);

// Insert content
const rentalsContent = `
        {activeTab === 'rentals' && (
          <div className="space-y-6">
             <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Tractor className="w-5 h-5 text-amber-600" />
              {isEn ? 'Rent Equipment & Tractors' : 'उपकरण और ट्रैक्टर किराए पर लें'}
            </h2>
            <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-xl mb-6 flex justify-between items-center">
              <div>
                <p className="text-sm text-amber-800 font-medium">
                  {isEn ? 'KisanMitra takes a 2% platform fee for secure P2P rentals.' : 'किसानमित्र सुरक्षित P2P किराये के लिए 2% प्लेटफ़ॉर्म शुल्क लेता है।'}
                </p>
              </div>
              <button className="text-xs bg-amber-500 text-white px-3 py-1.5 rounded-lg font-bold">List Equipment</button>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { name: 'Mahindra 575 DI', owner: 'Ramesh Singh', price: '₹500/hr', img: 'https://images.unsplash.com/photo-1592982537447-75407703fc84?w=400&q=80' },
                { name: 'Rotavator Heavy Duty', owner: 'Suresh Kumar', price: '₹300/hr', img: 'https://images.unsplash.com/photo-1627521798319-335607db7b15?w=400&q=80' },
                { name: 'Seed Drill Machine', owner: 'Prakash', price: '₹250/hr', img: 'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=400&q=80' }
              ].map((item, i) => (
                <div key={i} className="border border-gray-200 rounded-2xl overflow-hidden hover:shadow-md transition-shadow">
                  <div className="h-40 overflow-hidden bg-gray-100">
                    <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-gray-900 mb-1">{item.name}</h3>
                    <p className="text-sm text-gray-500 mb-3">{isEn ? 'Owner:' : 'मालिक:'} {item.owner}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="font-black text-lg text-emerald-700">{item.price}</span>
                      <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-emerald-700">
                        {isEn ? 'Book Now' : 'अभी बुक करें'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
`;

code = code.replace(
  "{activeTab === 'online' && (",
  rentalsContent + "\n        {activeTab === 'online' && ("
);

fs.writeFileSync('src/pages/Market.tsx', code);
