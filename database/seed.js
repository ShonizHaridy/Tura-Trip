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

    // Update cities with taglines
    await connection.execute(`
      UPDATE cities SET tagline = CASE
        WHEN id = 1 THEN 'A hub for marine activities and desert safaris.'
        WHEN id = 2 THEN 'A hub for marine activities and desert safaris.'
        WHEN id = 3 THEN 'A Paradise of stunning beaches and diving spots.'
        WHEN id = 4 THEN 'Ancient Wonders'
        WHEN id = 5 THEN 'Open Air Museum'
      END
    `);

    // Update city translations with taglines for all languages
    await connection.execute(`
      UPDATE city_translations SET tagline = CASE
        -- Hurghada taglines
        WHEN city_id = 1 AND language_code = 'en' THEN 'A hub for marine activities and desert safaris.'
        WHEN city_id = 1 AND language_code = 'ru' THEN 'Центр морских развлечений и пустынных сафари.'
        WHEN city_id = 1 AND language_code = 'it' THEN 'Un centro per attività marine e safari nel deserto.'
        WHEN city_id = 1 AND language_code = 'de' THEN 'Ein Zentrum für Meeresaktivitäten und Wüstensafaris.'
        
        -- Sharm El-Sheikh taglines
        WHEN city_id = 2 AND language_code = 'en' THEN 'A hub for marine activities and desert safaris.'
        WHEN city_id = 2 AND language_code = 'ru' THEN 'Центр морских развлечений и пустынных сафари.'
        WHEN city_id = 2 AND language_code = 'it' THEN 'Un centro per attività marine e safari nel deserto.'
        WHEN city_id = 2 AND language_code = 'de' THEN 'Ein Zentrum für Meeresaktivitäten und Wüstensafaris.'
        
        -- Marsa Alam taglines
        WHEN city_id = 3 AND language_code = 'en' THEN 'A paradise of stunning beaches and diving spots.'
        WHEN city_id = 3 AND language_code = 'ru' THEN 'Рай потрясающих пляжей и мест для дайвинга.'
        WHEN city_id = 3 AND language_code = 'it' THEN 'Un paradiso di spiagge mozzafiato e spot per immersioni.'
        WHEN city_id = 3 AND language_code = 'de' THEN 'Ein Paradies mit atemberaubenden Stränden und Tauchplätzen.'
        
        -- Cairo taglines
        WHEN city_id = 4 AND language_code = 'en' THEN 'Ancient wonders and timeless history.'
        WHEN city_id = 4 AND language_code = 'ru' THEN 'Древние чудеса и вечная история.'
        WHEN city_id = 4 AND language_code = 'it' THEN 'Meraviglie antiche e storia senza tempo.'
        WHEN city_id = 4 AND language_code = 'de' THEN 'Antike Wunder und zeitlose Geschichte.'
        
        -- Luxor taglines
        WHEN city_id = 5 AND language_code = 'en' THEN 'The world\'s greatest open-air museum.'
        WHEN city_id = 5 AND language_code = 'ru' THEN 'Величайший музей под открытым небом.'
        WHEN city_id = 5 AND language_code = 'it' THEN 'Il più grande museo a cielo aperto del mondo.'
        WHEN city_id = 5 AND language_code = 'de' THEN 'Das größte Freilichtmuseum der Welt.'
      END
      WHERE city_id IN (1, 2, 3, 4, 5)
    `);

    // Insert city translations (add this after the cities insert)
    await connection.execute(`
      INSERT INTO city_translations (city_id, language_code, name, description) VALUES
      (1, 'en', 'Hurghada', 'Beautiful Red Sea destination with amazing diving opportunities and desert adventures.'),
      (1, 'ru', 'Хургада', 'Прекрасное место на Красном море с удивительными возможностями для дайвинга и пустынных приключений.'),
      (1, 'it', 'Hurghada', 'Bellissima destinazione del Mar Rosso con incredibili opportunità di immersioni e avventure nel deserto.'),
      (1, 'de', 'Hurghada', 'Wunderschönes Rotes Meer Reiseziel mit erstaunlichen Tauch- und Wüstenabenteuer-Möglichkeiten.'),
      
      (2, 'en', 'Sharm El-Sheikh', 'Premier resort town in South Sinai with world-class diving and snorkeling.'),
      (2, 'ru', 'Шарм-эль-Шейх', 'Первоклассный курортный город в Южном Синае с дайвингом и снорклингом мирового класса.'),
      (2, 'it', 'Sharm El-Sheikh', 'Principale località turistica nel Sinai meridionale con immersioni e snorkeling di classe mondiale.'),
      (2, 'de', 'Sharm El-Sheikh', 'Premier Ferienort im Südsinai mit Weltklasse-Tauchen und Schnorcheln.'),
      
      (3, 'en', 'Marsa Alam', 'Pristine diving destination with unspoiled coral reefs and marine life.'),
      (3, 'ru', 'Марса Алам', 'Первозданное место для дайвинга с нетронутыми коралловыми рифами и морской жизнью.'),
      (3, 'it', 'Marsa Alam', 'Destinazione immacolata per le immersioni con barriere coralline incontaminate e vita marina.'),
      (3, 'de', 'Marsa Alam', 'Unberührtes Tauchziel mit unberührten Korallenriffen und Meereslebewesen.'),
      
      (4, 'en', 'Cairo', 'Historic capital city home to the Pyramids of Giza and rich ancient culture.'),
      (4, 'ru', 'Каир', 'Историческая столица, дом пирамид Гизы и богатой древней культуры.'),
      (4, 'it', 'Il Cairo', 'Capitale storica che ospita le Piramidi di Giza e una ricca cultura antica.'),
      (4, 'de', 'Kairo', 'Historische Hauptstadt mit den Pyramiden von Gizeh und reicher antiker Kultur.'),
      
      (5, 'en', 'Luxor', 'Open-air museum with Valley of the Kings and magnificent ancient temples.'),
      (5, 'ru', 'Луксор', 'Музей под открытым небом с Долиной царей и великолепными древними храмами.'),
      (5, 'it', 'Luxor', 'Museo a cielo aperto con la Valle dei Re e magnifici templi antichi.'),
      (5, 'de', 'Luxor', 'Freilichtmuseum mit dem Tal der Könige und prächtigen antiken Tempeln.')
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

    // Insert tour category translations
await connection.execute(`
  INSERT INTO tour_category_translations (category_id, language_code, name, description) VALUES
  -- Historical Cities
  (1, 'en', 'Historical Cities', 'Explore ancient Egyptian history and archaeological wonders'),
  (1, 'ru', 'Исторические города', 'Исследуйте древнюю египетскую историю и археологические чудеса'),
  (1, 'it', 'Città Storiche', 'Esplora la storia dell\'antico Egitto e le meraviglie archeologiche'),
  (1, 'de', 'Historische Städte', 'Erkunden Sie die altägyptische Geschichte und archäologische Wunder'),
  
  -- Sea Excursions
  (2, 'en', 'Sea Excursions', 'Diving, snorkeling, and boat trips in the Red Sea'),
  (2, 'ru', 'Морские экскурсии', 'Дайвинг, снорклинг и морские прогулки в Красном море'),
  (2, 'it', 'Escursioni Marine', 'Immersioni, snorkeling e gite in barca nel Mar Rosso'),
  (2, 'de', 'Meeresausflüge', 'Tauchen, Schnorcheln und Bootsfahrten im Roten Meer'),
  
  -- Safari & Adventure
  (3, 'en', 'Safari & Adventure', 'Desert safaris, quad biking, and adventure activities'),
  (3, 'ru', 'Сафари и приключения', 'Пустынные сафари, поездки на квадроциклах и приключенческие мероприятия'),
  (3, 'it', 'Safari e Avventura', 'Safari nel deserto, quad e attività avventurose'),
  (3, 'de', 'Safari & Abenteuer', 'Wüstensafaris, Quad-Fahrten und Abenteueraktivitäten'),
  
  -- Entertainment & Spa
  (4, 'en', 'Entertainment & Spa', 'Relaxation, entertainment shows, and spa experiences'),
  (4, 'ru', 'Развлечения и спа', 'Отдых, развлекательные шоу и спа-процедуры'),
  (4, 'it', 'Intrattenimento e Spa', 'Relax, spettacoli di intrattenimento ed esperienze spa'),
  (4, 'de', 'Unterhaltung & Spa', 'Entspannung, Unterhaltungsshows und Spa-Erlebnisse'),
  
  -- Transfer
  (5, 'en', 'Transfer', 'Airport transfers and transportation services'),
  (5, 'ru', 'Трансфер', 'Трансферы из аэропорта и транспортные услуги'),
  (5, 'it', 'Trasferimento', 'Trasferimenti aeroportuali e servizi di trasporto'),
  (5, 'de', 'Transfer', 'Flughafentransfers und Transportdienstleistungen'),
  
  -- Individual Tours
  (6, 'en', 'Individual Tours', 'Private and customized tour experiences'),
  (6, 'ru', 'Индивидуальные туры', 'Частные и индивидуальные туристические впечатления'),
  (6, 'it', 'Tour Individuali', 'Esperienze di tour private e personalizzate'),
  (6, 'de', 'Individuelle Touren', 'Private und maßgeschneiderte Touren')
`);

// Add more tour content for missing languages
await connection.execute(`
  INSERT INTO tour_content (tour_id, language_code, title, category, duration, availability, description, included, not_included, trip_program, take_with_you)
  VALUES 
  -- Tour 3 - Desert Safari (missing languages)
  (3, 'en', 'Desert Safari by Quad Bike', 'Safari & Adventure', '4 Hours', 'Daily except Sunday',
   'Experience the thrill of desert adventure with quad biking, camel riding, and Bedouin culture.',
   '["Quad bike", "Safety equipment", "Camel ride", "Bedouin dinner", "Show entertainment"]',
   '["Personal expenses", "Photos", "Extra drinks"]',
   '["14:00 - Hotel pickup", "15:00 - Quad biking", "16:30 - Camel ride", "17:30 - Bedouin camp", "19:00 - Dinner & show", "21:00 - Hotel return"]',
   '["Comfortable clothes", "Closed shoes", "Sunglasses", "Scarf for dust protection"]'),
   
  (3, 'ru', 'Сафари в пустыне на квадроциклах', 'Сафари и приключения', '4 часа', 'Ежедневно кроме воскресенья',
   'Испытайте острые ощущения пустынного приключения с поездками на квадроциклах, верблюдах и культурой бедуинов.',
   '["Квадроцикл", "Защитное снаряжение", "Поездка на верблюде", "Ужин у бедуинов", "Шоу-программа"]',
   '["Личные расходы", "Фотографии", "Дополнительные напитки"]',
   '["14:00 - Трансфер из отеля", "15:00 - Поездка на квадроциклах", "16:30 - Поездка на верблюде", "17:30 - Лагерь бедуинов", "19:00 - Ужин и шоу", "21:00 - Возвращение в отель"]',
   '["Удобная одежда", "Закрытая обувь", "Солнцезащитные очки", "Шарф для защиты от пыли"]')
`);

    // Insert admin user
    await connection.execute(`
      INSERT INTO admin_users (admin_id, name, email, password_hash, role, is_active) VALUES
      ('admin001', 'System Administrator', 'admin@turatrip.com', ?, 'admin', TRUE)
    `, [hashedPassword]);

    // Insert FAQs (base rows)
    await connection.execute(`
      INSERT INTO faqs (is_active, display_order) VALUES
      (TRUE, 1),
      (TRUE, 2),
      (TRUE, 3)
    `);

    // Insert FAQ Translations
    await connection.execute(`
      INSERT INTO faq_translations (faq_id, language_code, question, answer) VALUES
      (1, 'en', 'What is the best time to visit Egypt?', 'Egypt is an amazing country with a rich ancient history, breathtaking landscapes and huge opportunities for quality recreation. The best time to visit is from October to April when temperatures are more comfortable.'),
      (1, 'ru', 'Какое лучшее время для посещения Египта?', 'Египет - удивительная страна с богатой древней историей, захватывающими пейзажами и огромными возможностями для качественного отдыха. Лучшее время для посещения - с октября по апрель.'),
      (1, 'it', 'Qual è il momento migliore per visitare l\'Egitto?', 'L\'Egitto è un paese straordinario con una ricca storia antica, paesaggi mozzafiato e enormi opportunità per una ricreazione di qualità. Il momento migliore per visitare è da ottobre ad aprile.'),
      (1, 'de', 'Wann ist die beste Zeit, um Ägypten zu besuchen?', 'Ägypten ist ein erstaunliches Land mit einer reichen antiken Geschichte, atemberaubenden Landschaften und enormen Möglichkeiten für qualitätsvolle Erholung.'),

      (2, 'en', 'Do I need a visa to visit Egypt?', 'Most visitors need a visa to enter Egypt. You can obtain a tourist visa on arrival at the airport or apply for an e-visa online before your trip.'),
      (2, 'ru', 'Нужна ли виза для посещения Египта?', 'Большинству посетителей необходима виза для въезда в Египет. Вы можете получить туристическую визу по прибытии в аэропорт.'),
      (2, 'it', 'Ho bisogno di un visto per visitare l\'Egitto?', 'La maggior parte dei visitatori ha bisogno di un visto per entrare in Egitto. Puoi ottenere un visto turistico all\'arrivo in aeroporto.'),
      (2, 'de', 'Brauche ich ein Visum für die Einreise nach Ägypten?', 'Die meisten Besucher benötigen ein Visum für die Einreise nach Ägypten. Sie können ein Touristenvisum bei der Ankunft erhalten.'),

      (3, 'en', 'What should I bring on the tours?', 'We recommend bringing sunscreen, comfortable walking shoes, a hat, sunglasses, and a camera. For water activities, bring swimwear and a towel.'),
      (3, 'ru', 'Что взять с собой в туры?', 'Мы рекомендуем взять солнцезащитный крем, удобную обувь для ходьбы, шляпу, солнцезащитные очки и камеру.'),
      (3, 'it', 'Cosa dovrei portare nei tour?', 'Consigliamo di portare crema solare, scarpe comode da passeggio, un cappello, occhiali da sole e una macchina fotografica.'),
      (3, 'de', 'Was sollte ich auf die Touren mitbringen?', 'Wir empfehlen Sonnencreme, bequeme Wanderschuhe, einen Hut, eine Sonnenbrille und eine Kamera mitzubringen.')
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

    // Insert promotional_reviews
    await connection.execute(`
      INSERT INTO promotional_reviews (client_name, review_date, is_active, display_order) VALUES
      ('Sarah Johnson', '2024-01-15', TRUE, 1),
      ('Marco Rossi', '2024-01-20', TRUE, 2),
      ('Anna Petrov', '2024-01-25', TRUE, 3)
    `);

    // Insert promotional_review_translations
    await connection.execute(`
      INSERT INTO promotional_review_translations (review_id, language_code, review_text) VALUES
      -- Sarah Johnson
      (1, 'en', 'Amazing Egyptian Adventure! Tura Trip provided the most incredible experience exploring the pyramids and diving in the Red Sea. Professional guides and perfect organization!'),
      (1, 'ru', 'Удивительное египетское приключение! Тура Трип предоставил самый невероятный опыт изучения пирамид и дайвинга в Красном море. Профессиональные гиды и идеальная организация!'),
      (1, 'it', 'Incredibile avventura egiziana! Tura Trip ha fornito l\'esperienza più incredibile esplorando le piramidi e immergendosi nel Mar Rosso. Guide professionali e organizzazione perfetta!'),
      (1, 'de', 'Erstaunliches ägyptisches Abenteuer! Tura Trip bot die unglaublichste Erfahrung bei der Erkundung der Pyramiden und beim Tauchen im Roten Meer. Professionelle Führer und perfekte Organisation!'),

      -- Marco Rossi
      (2, 'en', 'Unforgettable Journey! Best tour company in Egypt! From Cairo to Hurghada, every moment was perfectly planned. Highly recommend to all travelers!'),
      (2, 'ru', 'Незабываемое путешествие! Лучшая туристическая компания в Египте! От Каира до Хургады каждый момент был идеально спланирован. Настоятельно рекомендую всем путешественникам!'),
      (2, 'it', 'Viaggio indimenticabile! La migliore compagnia turistica in Egitto! Dal Cairo a Hurghada, ogni momento è stato perfettamente pianificato. Raccomando vivamente a tutti i viaggiatori!'),
      (2, 'de', 'Unvergessliche Reise! Beste Reisegesellschaft in Ägypten! Von Kairo bis Hurghada war jeder Moment perfekt geplant. Sehr empfehlenswert für alle Reisenden!'),

      -- Anna Petrov
      (3, 'en', 'Excellent Service! Tura Trip is the best company for traveling in Egypt. Great guides, comfortable transport and unforgettable impressions!'),
      (3, 'ru', 'Превосходный сервис! Тура Трип - лучшая компания для путешествий по Египту. Отличные гиды, комфортабельный транспорт и незабываемые впечатления!'),
      (3, 'it', 'Servizio eccellente! Tura Trip è la migliore compagnia per viaggiare in Egitto. Guide eccellenti, trasporto confortevole e impressioni indimenticabili!'),
      (3, 'de', 'Ausgezeichneter Service! Tura Trip ist die beste Firma für Reisen in Ägypten. Großartige Führer, komfortabler Transport und unvergessliche Eindrücke!')
    `);

      // More data

      // After the existing tour inserts, add these additional tours:

    // Insert additional tours with cover images
    await connection.execute(`
      INSERT INTO tours (city_id, category_id, location, price_adult, price_child, featured_tag, discount_percentage, status, views, cover_image) VALUES
      (2, 2, 'Ras Mohammed National Park', 85.00, 45.00, 'popular', 0.00, 'active', 1150, 'ras_mohammed.jpeg'),
      (1, 3, 'Eastern Desert', 95.00, 50.00, 'new', 20.00, 'active', 890, 'safari.jpg'),
      (5, 1, 'Luxor, Egypt', 195.00, 100.00, 'popular', 15.00, 'active', 1680, 'luxor.png'),
      (1, 2, 'Hurghada Reefs', 65.00, 35.00, 'great_value', 10.00, 'active', 720, 'ras_mohammed.jpeg'),
      (2, 3, 'Sinai Desert', 110.00, 60.00, 'new', 0.00, 'active', 560, 'safari.jpg'),
      (4, 1, 'Cairo and Giza', 160.00, 85.00, 'popular', 12.00, 'active', 1340, 'luxor.png')
    `);

    // Add the additional tour content after your existing tourContent array:
    const additionalTourContent = [
      // Tour 7 - Ras Mohammed National Park
      [7, 'en', 'Ras Mohammed National Park Snorkeling', 'Sea Excursions', '6 Hours', 'Daily', 
      'Explore the underwater paradise of Ras Mohammed National Park with its pristine coral reefs and diverse marine life.',
      '["Boat transportation", "Snorkeling equipment", "Professional guide", "Lunch", "Soft drinks", "Park fees"]',
      '["Personal expenses", "Alcoholic beverages", "Underwater photography", "Tips"]',
      '["08:00 - Hotel pickup", "09:00 - Boat departure from Sharm", "10:30 - First snorkeling stop", "12:00 - Second reef location", "13:00 - Lunch on boat", "14:30 - Third snorkeling spot", "16:00 - Return journey", "17:30 - Hotel drop-off"]',
      '["Swimwear", "Towel", "Sunscreen SPF 50+", "Sunglasses", "Underwater camera", "Light snacks"]'],

      [7, 'ru', 'Снорклинг в национальном парке Рас-Мохаммед', 'Морские экскурсии', '6 часов', 'Ежедневно',
      'Исследуйте подводный рай национального парка Рас-Мохаммед с его нетронутыми коралловыми рифами и разнообразной морской жизнью.',
      '["Транспорт на лодке", "Снаряжение для снорклинга", "Профессиональный гид", "Обед", "Безалкогольные напитки", "Входные билеты в парк"]',
      '["Личные расходы", "Алкогольные напитки", "Подводная фотография", "Чаевые"]',
      '["08:00 - Трансфер из отеля", "09:00 - Отправление лодки из Шарма", "10:30 - Первая остановка для снорклинга", "12:00 - Второй риф", "13:00 - Обед на лодке", "14:30 - Третье место для снорклинга", "16:00 - Обратный путь", "17:30 - Возвращение в отель"]',
      '["Купальник", "Полотенце", "Солнцезащитный крем SPF 50+", "Солнцезащитные очки", "Подводная камера", "Легкие закуски"]'],

      // Tour 8 - Premium Desert Safari
      [8, 'en', 'Premium Desert Safari Adventure', 'Safari & Adventure', '8 Hours', 'Daily except Sunday',
      'Ultimate desert experience with quad biking, camel rides, sandboarding, traditional Bedouin camp, and stargazing.',
      '["Quad bike adventure", "Professional guide", "Camel riding", "Sandboarding", "Bedouin dinner", "Traditional show", "Stargazing session", "Safety equipment"]',
      '["Personal expenses", "Professional photos", "Extra drinks", "Shisha"]',
      '["13:00 - Hotel pickup", "14:30 - Quad biking session", "16:00 - Sandboarding", "17:00 - Camel ride", "18:00 - Bedouin camp arrival", "19:30 - Traditional dinner", "20:30 - Cultural show", "21:30 - Stargazing", "22:30 - Hotel return"]',
      '["Comfortable clothes", "Closed shoes", "Sunglasses", "Scarf for dust", "Light jacket for evening", "Camera"]'],

      [8, 'ru', 'Премиум сафари в пустыне', 'Сафари и приключения', '8 часов', 'Ежедневно кроме воскресенья',
      'Максимальное приключение в пустыне с поездками на квадроциклах, верблюдах, сэндбордингом, традиционным лагерем бедуинов и наблюдением за звездами.',
      '["Приключение на квадроцикле", "Профессиональный гид", "Поездка на верблюде", "Сэндбординг", "Ужин у бедуинов", "Традиционное шоу", "Наблюдение за звездами", "Защитное снаряжение"]',
      '["Личные расходы", "Профессиональные фото", "Дополнительные напитки", "Кальян"]',
      '["13:00 - Трансфер из отеля", "14:30 - Поездка на квадроциклах", "16:00 - Сэндбординг", "17:00 - Поездка на верблюде", "18:00 - Прибытие в лагерь бедуинов", "19:30 - Традиционный ужин", "20:30 - Культурное шоу", "21:30 - Наблюдение за звездами", "22:30 - Возвращение в отель"]',
      '["Удобная одежда", "Закрытая обувь", "Солнцезащитные очки", "Шарф от пыли", "Легкая куртка на вечер", "Фотоаппарат"]'],

      // Tour 9 - Luxor Ancient Wonders
      [9, 'en', 'Luxor Ancient Wonders Tour', 'Historical Cities', 'Full Day', 'Daily',
      'Journey through time in Luxor, the world\'s greatest open-air museum. Visit Valley of the Kings, Karnak Temple, and Hatshepsut Temple.',
      '["Round-trip flights", "Egyptologist guide", "All entrance fees", "Lunch at Nile view restaurant", "Air-conditioned transport", "Small group tour"]',
      '["Personal expenses", "Drinks", "Tips", "Photography tickets", "Optional tomb visits"]',
      '["05:30 - Hotel pickup", "07:00 - Flight to Luxor", "08:30 - Valley of the Kings", "10:30 - Hatshepsut Temple", "12:00 - Lunch break", "14:00 - Karnak Temple Complex", "16:00 - Free time/shopping", "17:30 - Flight back", "19:00 - Hotel arrival"]',
      '["Comfortable walking shoes", "Sun hat", "Sunscreen", "Camera", "Cash for tips", "Light jacket"]'],

      [9, 'ru', 'Тур по древним чудесам Луксора', 'Исторические города', 'Полный день', 'Ежедневно',
      'Путешествие во времени в Луксоре, величайшем музее под открытым небом. Посетите Долину царей, храм Карнак и храм Хатшепсут.',
      '["Авиаперелет туда-обратно", "Гид-египтолог", "Все входные билеты", "Обед в ресторане с видом на Нил", "Транспорт с кондиционером", "Тур в малой группе"]',
      '["Личные расходы", "Напитки", "Чаевые", "Билеты на фотосъемку", "Дополнительные посещения гробниц"]',
      '["05:30 - Трансфер из отеля", "07:00 - Вылет в Луксор", "08:30 - Долина царей", "10:30 - Храм Хатшепсут", "12:00 - Обеденный перерыв", "14:00 - Комплекс храмов Карнак", "16:00 - Свободное время/шоппинг", "17:30 - Обратный рейс", "19:00 - Прибытие в отель"]',
      '["Удобная обувь для ходьбы", "Солнцезащитная шляпа", "Солнцезащитный крем", "Фотоаппарат", "Наличные для чаевые", "Легкая куртка"]']
    ];

    // Insert additional tour content
    for (const content of additionalTourContent) {
      await connection.execute(`
        INSERT INTO tour_content (tour_id, language_code, title, category, duration, availability, description, included, not_included, trip_program, take_with_you)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, content);
    }

    // Add additional reviews
    await connection.execute(`
      INSERT INTO reviews (tour_id, client_name, rating, comment, tour_name, review_date, is_active) VALUES
      (7, 'David Miller', 5, 'Incredible snorkeling experience! Ras Mohammed has the most beautiful coral reefs I\\'ve ever seen. Highly recommend!', 'Ras Mohammed National Park Snorkeling', '2024-01-28', TRUE),
      (8, 'Lisa Anderson', 5, 'Best desert safari ever! The stargazing was magical and the Bedouin dinner was authentic and delicious.', 'Premium Desert Safari Adventure', '2024-01-30', TRUE),
      (9, 'Roberto Bianchi', 4, 'Luxor is breathtaking! So much history in one place. The guide was very knowledgeable about ancient Egypt.', 'Luxor Ancient Wonders Tour', '2024-02-01', TRUE),
      (7, 'Helen Smith', 5, 'Perfect day trip! The marine life at Ras Mohammed is spectacular. Great organization and friendly crew.', 'Ras Mohammed National Park Snorkeling', '2024-02-03', TRUE)
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