const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
};

const seedDatabase = async () => {
  let connection;
  
  try {
    connection = await mysql.createConnection(dbConfig);
    console.log('🔌 Connected to database for seeding...');

    // Hash password for admin user
    const hashedPassword = await bcrypt.hash('admin123', 12);

    // Clear existing data (optional - be careful in production)
    console.log('🧹 Clearing existing data...');
    await connection.execute('DELETE FROM reviews');
    await connection.execute('DELETE FROM tour_images');
    await connection.execute('DELETE FROM tour_content');
    await connection.execute('DELETE FROM tours');
    await connection.execute('DELETE FROM faqs');
    await connection.execute('DELETE FROM organizer_commission');
    await connection.execute('DELETE FROM currencies');
    await connection.execute('DELETE FROM tour_categories');
    await connection.execute('DELETE FROM cities');
    await connection.execute('DELETE FROM admin_users');

    // Reset auto increment
    await connection.execute('ALTER TABLE cities AUTO_INCREMENT = 1');
    await connection.execute('ALTER TABLE tour_categories AUTO_INCREMENT = 1');
    await connection.execute('ALTER TABLE tours AUTO_INCREMENT = 1');
    await connection.execute('ALTER TABLE admin_users AUTO_INCREMENT = 1');

    console.log('🌱 Seeding database with initial data...');

    // Insert currencies
    await connection.execute(`
      INSERT INTO currencies (code, name, symbol, exchange_rate, is_active) VALUES
      ('USD', 'US Dollar', '$', 1.000000, TRUE),
      ('EUR', 'Euro', '€', 0.850000, TRUE),
      ('RUB', 'Russian Ruble', '₽', 90.000000, TRUE),
      ('KZT', 'Kazakhstani Tenge', '₸', 450.000000, TRUE),
      ('UAH', 'Ukrainian Hryvnia', '₴', 36.000000, TRUE)
    `);

    // Insert organizer commissions
    await connection.execute(`
      INSERT INTO organizer_commission (currency_code, commission_amount, is_active) VALUES
      ('RUB', 7.00, TRUE),
      ('KZT', 10.00, TRUE),
      ('UAH', 3.00, TRUE)
    `);

    // Insert cities
    await connection.execute(`
      INSERT INTO cities (name, description, image, is_active) VALUES
      ('Hurghada', 'Beautiful Red Sea destination with amazing diving opportunities and desert adventures.', 'hurghada.jpg', TRUE),
      ('Sharm El-Sheikh', 'Premier resort town in South Sinai with world-class diving and snorkeling.', 'sharm.jpg', TRUE),
      ('Marsa Alam', 'Pristine diving destination with unspoiled coral reefs and marine life.', 'marsa-alam.jpg', TRUE),
      ('Cairo', 'Historic capital city home to the Pyramids of Giza and rich ancient culture.', 'cairo.jpg', TRUE),
      ('Luxor', 'Open-air museum with Valley of the Kings and magnificent ancient temples.', 'luxor.jpg', TRUE)
    `);

    // Insert tour categories
    await connection.execute(`
      INSERT INTO tour_categories (name, description, is_active) VALUES
      ('Historical Cities', 'Explore ancient Egyptian history and archaeological wonders', TRUE),
      ('Sea Excursions', 'Diving, snorkeling, and boat trips in the Red Sea', TRUE),
      ('Safari & Adventure', 'Desert safaris, quad biking, and adventure activities', TRUE),
      ('Entertainment & Spa', 'Relaxation, entertainment shows, and spa experiences', TRUE),
      ('Transfer', 'Airport transfers and transportation services', TRUE),
      ('Individual Tours', 'Private and customized tour experiences', TRUE)
    `);

    // Insert admin user
    await connection.execute(`
      INSERT INTO admin_users (admin_id, name, email, password_hash, role, is_active) VALUES
      ('admin001', 'System Administrator', 'admin@turatrip.com', ?, 'admin', TRUE)
    `, [hashedPassword]);

    // Insert sample FAQs
    await connection.execute(`
      INSERT INTO faqs (language_code, question, answer, is_active) VALUES
      ('en', 'What is the best time to visit Egypt?', 'Egypt is an amazing country with a rich ancient history, breathtaking landscapes and huge opportunities for quality recreation. The best time to visit is from October to April when temperatures are more comfortable.', TRUE),
      ('en', 'Do I need a visa to visit Egypt?', 'Most visitors need a visa to enter Egypt. You can obtain a tourist visa on arrival at the airport or apply for an e-visa online before your trip. The visa is typically valid for 30 days.', TRUE),
      ('en', 'What should I bring on the tours?', 'We recommend bringing sunscreen, comfortable walking shoes, a hat, sunglasses, and a camera. For water activities, bring swimwear and a towel. Specific requirements will be provided with your tour confirmation.', TRUE),
      ('ru', 'Какое лучшее время для посещения Египта?', 'Египет - удивительная страна с богатой древней историей, захватывающими пейзажами и огромными возможностями для качественного отдыха. Лучшее время для посещения - с октября по апрель.', TRUE),
      ('ru', 'Нужна ли виза для посещения Египта?', 'Большинству посетителей необходима виза для въезда в Египет. Вы можете получить туристическую визу по прибытии в аэропорт или подать заявку на электронную визу онлайн перед поездкой.', TRUE)
    `);

    // Insert sample tours
    await connection.execute(`
      INSERT INTO tours (city_id, category_id, location, price_adult, price_child, featured_tag, discount_percentage, status, views) VALUES
      (1, 1, 'Cairo, Egypt', 145.00, 75.00, 'popular', 10.00, 'active', 1250),
      (1, 2, 'Hurghada Marina', 45.00, 25.00, 'great_value', 0.00, 'active', 980),
      (1, 3, 'Eastern Desert', 65.00, 35.00, 'new', 15.00, 'active', 750),
      (2, 2, 'Ras Mohammed National Park', 55.00, 30.00, 'popular', 0.00, 'active', 890),
      (3, 2, 'Marsa Alam Reefs', 75.00, 40.00, 'great_value', 5.00, 'active', 650),
      (1, 4, 'Hurghada Hotels', 35.00, 20.00, NULL, 0.00, 'active', 420)
    `);

    // Insert tour content for multiple languages
    const tourContent = [
      // Tour 1 - Cairo Trip
      [1, 'en', 'Cairo from Hurghada (by Plane)', 'Historical Cities', 'Full Day', 'Daily', 
       'Discover the wonders of ancient Egypt with a day trip to Cairo from Hurghada. Visit the iconic Pyramids of Giza, the Sphinx, and the Egyptian Museum.',
       '["Round-trip flights", "Professional guide", "Entrance fees", "Lunch", "Air-conditioned transport"]',
       '["Personal expenses", "Drinks", "Tips", "Optional activities"]',
       '["06:00 - Hotel pickup", "07:30 - Flight to Cairo", "09:00 - Pyramids of Giza", "12:00 - Lunch", "14:00 - Egyptian Museum", "16:00 - Free time", "18:00 - Flight back", "20:30 - Hotel drop-off"]',
       '["Comfortable shoes", "Sun hat", "Sunscreen", "Camera", "Cash for tips"]'],
      
      [1, 'ru', 'Каир из Хургады (на самолете)', 'Исторические города', 'Полный день', 'Ежедневно',
       'Откройте для себя чудеса древнего Египта с однодневной поездкой в Каир из Хургады. Посетите знаменитые пирамиды Гизы, Сфинкса и Египетский музей.',
       '["Авиаперелет туда-обратно", "Профессиональный гид", "Входные билеты", "Обед", "Транспорт с кондиционером"]',
       '["Личные расходы", "Напитки", "Чаевые", "Дополнительные активности"]',
       '["06:00 - Трансфер из отеля", "07:30 - Вылет в Каир", "09:00 - Пирамиды Гизы", "12:00 - Обед", "14:00 - Египетский музей", "16:00 - Свободное время", "18:00 - Обратный рейс", "20:30 - Возвращение в отель"]',
       '["Удобная обувь", "Солнцезащитная шляпа", "Солнцезащитный крем", "Фотоаппарат", "Наличные для чаевых"]'],

      // Tour 2 - Orange Bay
      [2, 'en', 'Orange Bay Island', 'Sea Excursions', 'Full Day', 'Daily except Friday',
       'Experience the pristine beauty of Orange Bay Island with crystal clear waters, white sandy beaches, and excellent snorkeling opportunities.',
       '["Boat transfer", "Snorkeling equipment", "Lunch", "Soft drinks", "Guide"]',
       '["Personal expenses", "Alcoholic drinks", "Underwater photos"]',
       '["08:00 - Hotel pickup", "09:00 - Marina departure", "10:30 - Orange Bay arrival", "12:00 - Snorkeling", "13:00 - Lunch on island", "15:00 - Free time", "16:00 - Return journey", "18:00 - Hotel drop-off"]',
       '["Swimwear", "Towel", "Sunscreen", "Sunglasses", "Underwater camera"]'],

      [2, 'ru', 'Остров Оранж Бей', 'Морские экскурсии', 'Полный день', 'Ежедневно кроме пятницы',
       'Испытайте нетронутую красоту острова Оранж Бей с кристально чистыми водами, белоснежными пляжами и отличными возможностями для снорклинга.',
       '["Трансфер на лодке", "Снаряжение для снорклинга", "Обед", "Безалкогольные напитки", "Гид"]',
       '["Личные расходы", "Алкогольные напитки", "Подводные фото"]',
       '["08:00 - Трансфер из отеля", "09:00 - Отправление с марины", "10:30 - Прибытие на Оранж Бей", "12:00 - Снорклинг", "13:00 - Обед на острове", "15:00 - Свободное время", "16:00 - Обратный путь", "18:00 - Возвращение в отель"]',
       '["Купальник", "Полотенце", "Солнцезащитный крем", "Солнцезащитные очки", "Подводная камера"]']
    ];

    for (const content of tourContent) {
      await connection.execute(`
        INSERT INTO tour_content (tour_id, language_code, title, category, duration, availability, description, included, not_included, trip_program, take_with_you)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, content);
    }

    // Insert sample reviews
    await connection.execute(`
      INSERT INTO reviews (tour_id, client_name, rating, comment, tour_name, review_date, is_active) VALUES
      (1, 'Sarah Johnson', 5, 'Amazing experience! The pyramids were breathtaking and our guide was very knowledgeable. Highly recommend this tour!', 'Cairo from Hurghada (by Plane)', '2024-01-15', TRUE),
      (1, 'Michael Chen', 4, 'Great tour overall. The flight was comfortable and we had enough time at each location. Only complaint is lunch could be better.', 'Cairo from Hurghada (by Plane)', '2024-01-20', TRUE),
      (2, 'Emma Davis', 5, 'Orange Bay is paradise! Crystal clear water and amazing snorkeling. Perfect day trip from Hurghada.', 'Orange Bay Island', '2024-01-18', TRUE),
      (2, 'James Wilson', 4, 'Beautiful island and great snorkeling spots. The boat was comfortable and staff was friendly.', 'Orange Bay Island', '2024-01-22', TRUE),
      (1, 'Anna Petrov', 5, 'Незабываемое путешествие! Пирамиды впечатляют, а гид очень профессиональный.', 'Cairo from Hurghada (by Plane)', '2024-01-25', TRUE)
    `);

    console.log('✅ Database seeded successfully!');
    console.log('👤 Admin credentials: admin@turatrip.com / admin123');
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    if (connection) {
      await connection.end();
      console.log('🔌 Database connection closed');
    }
  }
};

// Run seeding if called directly
if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;