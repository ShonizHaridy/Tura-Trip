// src/components/FAQ.jsx - FIXED with real API data
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { IoAdd, IoRemove } from 'react-icons/io5';
import publicService from '../services/publicService';

const FAQ = () => {
  const { t, i18n } = useTranslation();
  const [openItems, setOpenItems] = useState(new Set());
  const [faqData, setFaqData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch FAQ data when component mounts or language changes
  useEffect(() => {
    fetchFAQData();
  }, [i18n.language]);

  const fetchFAQData = async () => {
    try {
      setLoading(true);
      const response = await publicService.getFAQs(i18n.language);
      if (response.success) {
        setFaqData(response.data);
      }
    } catch (error) {
      console.error('Error fetching FAQ data:', error);
      // Fallback to default data
      setFaqData([
        {
          id: 1,
          question: "What must be done in Egypt ?",
          answer: "Egypt is an amazing country with a rich ancient history, breathtaking landscapes and huge opportunities for quality recreation. The country of the pharaohs offers a diverse choice of resorts. The three most popular of them are:"
        },
        {
          id: 2,
          question: "How much money to take to Egypt for 7 days?",
          answer: "For a 7-day trip to Egypt, budget approximately $50-100 per day for mid-range travel, including meals, activities, and souvenirs. This covers most excursions, dining, and shopping expenses."
        },
        {
          id: 3,
          question: "What currency is better to take with you to Egypt ?",
          answer: "The best currencies to take to Egypt are USD or EUR. Egyptian Pounds (EGP) is the local currency, but US Dollars and Euros are widely accepted. We recommend bringing cash in these currencies for the best exchange rates."
        },
        {
          id: 4,
          question: "Is it possible to take rubles to Egypt?",
          answer: "Yes, it's possible to take Russian Rubles to Egypt. Many exchange options are available in tourist areas."
        },
        {
          id: 5,
          question: "What souvenirs can not be bought in Egypt",
          answer: "Avoid purchasing: antiquities or items claiming to be ancient artifacts (illegal), coral or shells from the Red Sea (protected), certain spices in large quantities, and counterfeit branded items."
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const toggleItem = (index) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(index)) {
      newOpenItems.delete(index);
    } else {
      newOpenItems.add(index);
    }
    setOpenItems(newOpenItems);
  };

  const isOpen = (index) => openItems.has(index);

  if (loading) {
    return (
      <section className="py-16 bg-[#f3f3ee]">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-teal-600 mx-auto"></div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-[#f3f3ee]">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Section Title - Cursive Style */}
        <div className="text-center mb-12">
          <h2 className="text-4xl lg:text-5xl text-danim-800 mb-2 font-great-vibes font-normal ">
            {t("homepage.faq.title")}
          </h2>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqData.map((item, index) => (
            <div 
              key={item.id}
              className="bg-white rounded-xl shadow-[0px_2px_12px_0px_rgba(20,20,43,0.08)] overflow-hidden"
            >
              {/* Question Row */}
              <div className="px-6 py-5 flex items-center justify-between">
                <h3 className="text-lg font-medium text-danim-800 flex-1 pr-4">
                  {item.question}
                </h3>
                
                <button
                  onClick={() => toggleItem(index)}
                  className="w-8 h-8 bg-danim-800 text-white flex items-center justify-center rounded transition-colors hover:bg-[#2d467c]"
                >
                  {isOpen(index) ? (
                    <IoRemove className="w-5 h-5" />
                  ) : (
                    <IoAdd className="w-5 h-5" />
                  )}
                </button>
              </div>

              {/* Answer Content */}
              {isOpen(index) && (
                <div className="px-6 pb-6 border-t border-gray-100">
                  <div className="pt-4">
                    <p className="text-gray-700 leading-relaxed">
                      {item.answer}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;